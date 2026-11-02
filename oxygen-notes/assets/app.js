// 总入口：渲染模块卡片、模块 id 对照表，并支持一键复制模块 id

const CATEGORY_NAMES = {};
const DIFFICULTY_STARS = ['', '★', '★★', '★★★', '★★★★', '★★★★★'];
const COPY_FEEDBACK_MS = 1500;

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function loadData() {
  if (!window.ONI_DATA) {
    document.getElementById('card-grid').innerHTML =
      '<p class="error-msg">数据加载失败，请检查 data/modules.js 文件</p>';
    return null;
  }
  return window.ONI_DATA;
}

function renderCard(m) {
  const id = m.id;
  const catName = CATEGORY_NAMES[m.category] || m.category;
  const diffStr = DIFFICULTY_STARS[m.difficulty] || '';
  const shotCount = (m.screenshots || []).length;
  return `
    <article class="module-card" id="${esc(id)}">
      <a class="card-link" href="modules/${esc(id)}.html">
        <span class="card-category">${esc(catName)}</span>
        <div class="card-name">${esc(m.name)}</div>
        <div class="card-meta">
          <span class="phase">${esc(m.phase || '未标阶段')}</span>
          <span class="difficulty">${diffStr}</span>
        </div>
        ${shotCount ? `<span class="card-shots">📷 ${shotCount} 张示意图</span>` : ''}
      </a>
      <div class="card-id-row">
        <code class="card-id">${esc(id)}</code>
        <button class="copy-id-btn" type="button" data-copy-id="${esc(id)}"
          aria-label="复制模块 id ${esc(id)}">复制</button>
      </div>
    </article>`;
}

function renderGrid(modules, filter) {
  const grid = document.getElementById('card-grid');
  const filtered = filter === 'all'
    ? modules
    : modules.filter(m => m.category === filter);
  grid.innerHTML = filtered.map(renderCard).join('')
    || '<p class="muted" style="grid-column:1/-1">该分类下暂无模块</p>';
}

function renderIdIndex(modules) {
  const body = document.getElementById('id-index-body');
  if (!body) return;
  if (!modules.length) {
    body.innerHTML = '<p class="muted">暂无模块</p>';
    return;
  }
  body.innerHTML = `
    <table class="id-table">
      <thead><tr><th>id</th><th>模块名</th></tr></thead>
      <tbody>${modules.map(m => `<tr><td><code>${esc(m.id)}</code></td><td>${esc(m.name)}</td></tr>`).join('')}</tbody>
    </table>
    <p class="id-note">页面结构锚点：<code>page-header</code> · <code>category-filter</code> · <code>card-grid</code> · <code>page-footer</code></p>`;
}

// file:// 等非安全上下文下 navigator.clipboard 不可用，退回 textarea + execCommand
function fallbackCopy(text) {
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '-9999px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    ok ? resolve() : reject(new Error('copy-failed'));
  });
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  }
  return fallbackCopy(text);
}

function setCopyState(btn, state, text) {
  if (btn.copyTimer) clearTimeout(btn.copyTimer);
  btn.classList.remove('copied', 'failed');
  if (state) btn.classList.add(state);
  btn.textContent = text;
  btn.copyTimer = setTimeout(() => {
    btn.classList.remove('copied', 'failed');
    btn.textContent = '复制';
    btn.copyTimer = null;
  }, COPY_FEEDBACK_MS);
}

function selectNodeText(node) {
  if (!node || !window.getSelection) return;
  const range = document.createRange();
  range.selectNodeContents(node);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function bindCopyButtons() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.copy-id-btn');
    if (!btn) return;
    e.preventDefault();
    const id = btn.dataset.copyId || '';
    copyText(id).then(() => {
      setCopyState(btn, 'copied', '已复制');
    }).catch(() => {
      setCopyState(btn, 'failed', '复制失败');
      selectNodeText(btn.parentElement.querySelector('.card-id'));
    });
  });
}

function init() {
  const data = loadData();
  if (!data) return;

  data.categories.forEach(c => { CATEGORY_NAMES[c.id] = c.name; });
  document.getElementById('module-count').textContent = (data.modules || []).length;

  renderIdIndex(data.modules || []);
  renderGrid(data.modules || [], 'all');
  bindCopyButtons();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGrid(data.modules || [], btn.dataset.cat);
    });
  });
}

init();
