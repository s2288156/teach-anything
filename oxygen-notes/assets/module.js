// 模块详情页：左侧导航 + 锚点滚动 + 图片缩放查看
// 只走 image-index 一条渲染管线（text-section 模式已退役）

function shotTitle(s, i) {
  return s.title || s.desc || '示意图 ' + (i + 1);
}

function getPageModuleId() {
  const fromBody = document.body.dataset.moduleId;
  if (fromBody) return fromBody;
  const file = decodeURIComponent(location.pathname.split('/').pop() || '');
  return file.replace(/\.html$/, '');
}

// ──────────── 启动 ────────────

function init() {
  const data = window.ONI_DATA;
  if (!data || !window.ONI_CORE) {
    document.getElementById('module-main').innerHTML =
      '<p class="error-msg">数据加载失败，请检查 data/modules.js 与 assets/oni-core.js</p>';
    return;
  }

  // 1. 校验（AGENTS.md 规则）
  const errs = window.ONI_SCHEMA.validateAll(data);
  if (errs.length) {
    console.warn('[oni-core] schema 告警（不阻塞渲染）:\n  ' + errs.join('\n  '));
  }

  // 2. 规范化 shape
  const normalized = window.ONI_CORE.normalizeAll(data);
  const id = getPageModuleId();
  const m = normalized.modules.find(x => x.id === id);
  if (!m) {
    document.getElementById('module-main').innerHTML =
      '<p class="error-msg">未找到模块：' + window.ONI_CORE.esc(id) + '</p>';
    return;
  }

  document.title = m.name + ' · oxygen-notes';
  renderHeader(m);
  renderNav(m);
  renderMain(m);
  if (window.ONI_ID_COPY) window.ONI_ID_COPY.bindCopyButtons();
  bindLightbox();
  bindScrollSpy();
  bindFloatingBack();
}

// ──────────── Header ────────────

function renderHeader(m) {
  const $ = (id) => document.getElementById(id);
  $('module-title').textContent = m.name;
  $('module-sub').textContent =
    m._categoryName + ' · ' + (m.phase || '未标阶段') +
    ' · 难度 ' + (m._difficultyStars || '');

  let row = document.getElementById('module-header-id-row');
  if (!row) {
    row = document.createElement('div');
    row.className = 'header-id-row';
    row.id = 'module-header-id-row';
    row.innerHTML = '<code class="card-id"></code>' +
      '<button class="copy-id-btn" type="button">复制</button>';
    $('module-sub').insertAdjacentElement('afterend', row);
  }
  row.querySelector('.card-id').textContent = m.id;
  const btn = row.querySelector('.copy-id-btn');
  btn.dataset.copyId = m.id;
  btn.setAttribute('aria-label', '复制模块 id ' + m.id);
}

// ──────────── 左侧导航 ────────────

function renderNav(m) {
  const nav = document.getElementById('side-nav');
  const shots = m.screenshots;
  let html = '<p class="nav-head">图片索引</p><ul class="nav-list nav-shots">';
  shots.forEach((s, i) => {
    html += '<li><a href="#shot-' + i + '" data-nav="shot-' + i + '">' +
      String(i + 1).padStart(2, '0') + ' · ' +
      window.ONI_CORE.esc(shotTitle(s, i)) + '</a></li>';
  });
  html += '</ul><p class="nav-head">文字数据</p><ul class="nav-list">' +
    '<li><a href="#io" data-nav="io">投入产出</a></li>' +
    '<li><a href="#materials" data-nav="materials">建筑材料要求</a></li></ul>';
  if (m.source) {
    html += '<a class="nav-source" href="' + window.ONI_CORE.esc(m.source) +
      '" target="_blank" rel="noopener">来源文档 ↗</a>';
  }
  nav.innerHTML = html;
}

// ──────────── 正文 ────────────

function materialsListHtml(m) {
  return (m.materials && m.materials.length)
    ? '<ul class="material-list">' + m.materials.map(x => {
        const $ = window.ONI_CORE.esc;
        // count 允许数字（渲染为 ×N）或字符串（如「按布局」，原样输出）
        const count = (x.count === 0 || x.count)
          ? '<span class="mat-count">' +
            (typeof x.count === 'number' ? '×' + x.count : $(x.count)) +
            '</span>' : '';
        const mat = x.material ? ' <span class="mat-material">(' + $(x.material) + ')</span>' : '';
        return '<li>' + count + $(x.building) + mat + '</li>';
      }).join('') + '</ul>'
    : '<p class="muted">暂无数据</p>';
}

function ioSectionHtml(m) {
  const $ = window.ONI_CORE.esc;
  const inItems = (m.inputs_per_cycle || []).map(x =>
    '<li><strong>' + $(x.resource) + '</strong> — ' + $(x.amount) + '</li>'
  ).join('') || '<p class="muted">暂无数据</p>';
  const outItems = (m.outputs_per_cycle || []).map(x =>
    '<li><strong>' + $(x.resource) + '</strong> — ' + $(x.amount) + '</li>'
  ).join('') || '<p class="muted">暂无数据</p>';
  return '<section class="module-section" id="io">' +
    '<h2>投入产出</h2>' +
    '<div class="section-split">' +
      '<div><h4 class="input">📥 消耗</h4><ul>' + inItems + '</ul></div>' +
      '<div><h4 class="output">📤 产出</h4><ul>' + outItems + '</ul></div>' +
    '</div></section>';
}

function materialsSectionHtml(m) {
  const $ = window.ONI_CORE.esc;
  const note = m.materials_note
    ? '<p class="material-note">' + $(m.materials_note) + '</p>' : '';
  return '<section class="module-section" id="materials">' +
    '<h2>建筑材料要求</h2>' + materialsListHtml(m) + note +
  '</section>';
}

function renderMain(m) {
  const $ = window.ONI_CORE.esc;

  const shotSections = m.screenshots.map((s, i) => {
    const viewTag = s.view
      ? '<span class="shot-view">' + $(s.view) + '</span>' : '';
    const shows = Array.isArray(s.shows) ? s.shows : [];
    const tags = shows.length
      ? '<div class="shot-tags">' + shows.map(t =>
          '<span class="shot-tag">' + $(t) + '</span>'
        ).join('') + '</div>' : '';
    const noteHtml = s.note
      ? '<p class="image-note">' + $(s.note) + '</p>' : '';
    return '<section class="module-section image-entry" id="shot-' + i + '">' +
      '<h2><span class="shot-num">' + String(i + 1).padStart(2, '0') +
      '</span>' + $(shotTitle(s, i)) + '</h2>' + viewTag +
      '<figure class="shot">' +
        '<img src="../screenshots/' + $(s.file) +
        '" alt="' + $(m.name + ' · ' + (s.desc || s.title)) +
        '" data-zoom="1" loading="lazy" decoding="async">' +
      '</figure>' + noteHtml + tags + '</section>';
  }).join('');

  const credit = m.imageCredit
    ? '<p class="image-credit">' + $(m.imageCredit) + '</p>' : '';

  document.getElementById('module-main').innerHTML =
    shotSections +
    ioSectionHtml(m) +
    materialsSectionHtml(m) +
    credit +
    '<p class="updated-line">更新于 ' + $(m.updated || '未知') + '</p>';
}

// ──────────── 图片缩放 / 滚动高亮 ────────────

function bindLightbox() {
  document.querySelectorAll('img[data-zoom]').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });
}

// 每次打开创建一个 AbortController：关闭时一次性摘掉本实例挂的所有监听，
// 避免连续翻图时 mouseup / keydown 监听器累积。
function openLightbox(src, alt) {
  const ac = new AbortController();
  const sig = { signal: ac.signal };
  const prevFocus = document.activeElement;

  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', alt || '示意图放大查看');
  box.innerHTML =
    '<div class="lightbox-toolbar">' +
      '<button type="button" data-act="out" aria-label="缩小">−</button>' +
      '<span class="zoom-val">100%</span>' +
      '<button type="button" data-act="in" aria-label="放大">+</button>' +
      '<button type="button" data-act="reset">复位</button>' +
      '<button type="button" data-act="close">关闭</button>' +
    '</div>' +
    '<div class="lightbox-stage"></div>' +
    '<span class="lightbox-hint">滚轮缩放 · 拖动查看细节</span>';

  const stage = box.querySelector('.lightbox-stage');
  // src / alt 走 DOM 属性赋值，不经 innerHTML 拼接，避免属性被截断
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  stage.appendChild(img);

  const val = box.querySelector('.zoom-val');
  let zoom = 1;

  const apply = () => {
    img.style.transform = 'scale(' + zoom + ')';
    val.textContent = Math.round(zoom * 100) + '%';
  };

  function close() {
    ac.abort();
    box.remove();
    if (prevFocus && prevFocus.focus) prevFocus.focus();
  }

  document.body.appendChild(box);

  box.querySelector('.lightbox-toolbar').addEventListener('click', e => {
    const act = e.target.dataset ? e.target.dataset.act : '';
    if (!act) return;
    if (act === 'close') { close(); return; }
    if (act === 'in') zoom = Math.min(zoom + 0.25, 5);
    if (act === 'out') zoom = Math.max(zoom - 0.25, 0.5);
    if (act === 'reset') zoom = 1;
    apply();
  }, sig);

  stage.addEventListener('wheel', e => {
    e.preventDefault();
    zoom = Math.min(Math.max(zoom + (e.deltaY < 0 ? 0.15 : -0.15), 0.5), 5);
    apply();
  }, Object.assign({ passive: false }, sig));

  // Pointer Events：鼠标与触屏共用一套拖动逻辑
  let pid = null, sx = 0, sy = 0, sl = 0, st = 0;
  stage.addEventListener('pointerdown', e => {
    pid = e.pointerId;
    sx = e.clientX; sy = e.clientY;
    sl = stage.scrollLeft; st = stage.scrollTop;
    stage.setPointerCapture(pid);
    stage.classList.add('dragging');
  }, sig);
  stage.addEventListener('pointermove', e => {
    if (e.pointerId !== pid) return;
    stage.scrollLeft = sl - (e.clientX - sx);
    stage.scrollTop = st - (e.clientY - sy);
  }, sig);
  const endDrag = e => {
    if (e.pointerId !== pid) return;
    pid = null;
    stage.classList.remove('dragging');
  };
  stage.addEventListener('pointerup', endDrag, sig);
  stage.addEventListener('pointercancel', endDrag, sig);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    // 焦点锁在工具栏内，不让 Tab 跑到背景页面
    const btns = Array.from(box.querySelectorAll('button'));
    const first = btns[0], last = btns[btns.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }, sig);

  apply();
  box.querySelector('[data-act="close"]').focus();
}

function bindScrollSpy() {
  const links = Array.from(document.querySelectorAll('.nav-list a[data-nav]'));
  const targets = links.map(a => document.getElementById(a.dataset.nav)).filter(Boolean);
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active', a.dataset.nav === entry.target.id));
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  targets.forEach(t => observer.observe(t));
}

// ──────────── 悬浮返回按钮 ────────────

function bindFloatingBack() {
  const link = document.createElement('a');
  link.className = 'back-float';
  link.href = '../index.html';
  link.textContent = '← 返回模块列表';
  link.setAttribute('aria-label', '返回模块列表');
  document.body.appendChild(link);

  const header = document.querySelector('.site-header');
  if (!header) { link.classList.add('visible'); return; }

  // 头部完全滚出视口时显示，回到视野内隐藏
  new IntersectionObserver(entries => {
    entries.forEach(e => link.classList.toggle('visible', !e.isIntersecting));
  }, { threshold: 0 }).observe(header);
}

init();
