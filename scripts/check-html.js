#!/usr/bin/env node
// 检查全站 HTML：本地链接是否存在、提示词按钮是否有对应模板、页内 id 是否重复。
// 用法：node scripts/check-html.js（在仓库根目录运行 npm run check:html）

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SKIP_DIRS = new Set(["node_modules", ".git", ".trae", "_site", "temp"]);

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function attrs(html, name) {
  const re = new RegExp(
    `(?<![-:\\w])${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`,
    "gi"
  );
  const out = [];
  for (const m of html.matchAll(re)) {
    out.push(m[1] !== undefined ? m[1] : m[2]);
  }
  return out;
}

function templateIds(html) {
  const out = [];
  for (const m of html.matchAll(/<template\b([^>]*)>/gi)) {
    const ids = attrs(m[1], "id");
    if (ids.length) out.push(ids[0]);
  }
  return out;
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

const files = walk(ROOT, []).sort();
const errors = [];
let linkCount = 0;
let promptCount = 0;

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const name = rel(file);

  const ids = attrs(html, "id");
  const seen = new Map();
  for (const id of ids) {
    seen.set(id, (seen.get(id) || 0) + 1);
  }
  for (const [id, count] of seen) {
    if (count > 1) errors.push(`${name}: id="${id}" 出现 ${count} 次`);
  }

  for (const value of attrs(html, "href").concat(attrs(html, "src"))) {
    const target = value.trim();
    if (!target || target.startsWith("#")) continue;
    if (target.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;

    linkCount += 1;
    const pathPart = target.split(/[?#]/, 1)[0];
    if (!pathPart) continue;

    let decoded;
    try {
      decoded = decodeURIComponent(pathPart);
    } catch {
      decoded = pathPart;
    }
    const resolved = path.resolve(path.dirname(file), decoded);
    if (!fs.existsSync(resolved)) {
      errors.push(`${name}: 本地链接指向不存在的文件 ${target}`);
    }
  }

  const templates = templateIds(html);
  const templateSet = new Set(templates);
  const used = new Set();
  for (const id of attrs(html, "data-copy-prompt")) {
    promptCount += 1;
    used.add(id);
    if (!templateSet.has(id)) {
      errors.push(`${name}: data-copy-prompt="${id}" 没有对应的 <template id>`);
    }
  }
  for (const id of templates) {
    if (!used.has(id)) {
      errors.push(`${name}: <template id="${id}"> 没有被任何 data-copy-prompt 引用`);
    }
  }
}

if (errors.length) {
  console.error(`HTML 检查失败：${errors.length} 处问题`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}

console.log(
  `HTML 检查通过：${files.length} 个文件，${linkCount} 个本地链接，${promptCount} 个提示词按钮，id 无重复`
);
