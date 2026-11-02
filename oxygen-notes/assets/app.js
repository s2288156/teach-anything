// 总入口：渲染模块卡片、模块 id 对照表，并支持一键复制模块 id

function loadData() {
  if (!window.ONI_DATA || !window.ONI_CORE) {
    document.getElementById('card-grid').innerHTML =
      '<p class="error-msg">数据加载失败，请检查 data/modules.js 和 assets/oni-core.js</p>';
    return null;
  }
  return window.ONI_DATA;
}

function renderCard(m) {
  const $ = window.ONI_CORE.esc;
  const shotCount = (m.screenshots || []).length;
  return '<article class="module-card" id="' + $(m.id) + '">' +
    '<a class="card-link" href="modules/' + $(m.id) + '.html">' +
      '<span class="card-category">' + $(m._categoryName) + '</span>' +
      '<div class="card-name">' + $(m.name) + '</div>' +
      '<div class="card-meta">' +
        '<span class="phase">' + $(m.phase || '未标阶段') + '</span>' +
        '<span class="difficulty">' + (m._difficultyStars || '') + '</span>' +
      '</div>' +
      (shotCount ? '<span class="card-shots">📷 ' + shotCount + ' 张示意图</span>' : '') +
    '</a>' +
    '<div class="card-id-row">' +
      '<code class="card-id">' + $(m.id) + '</code>' +
      '<button class="copy-id-btn" type="button" data-copy-id="' + $(m.id) + '"' +
      ' aria-label="复制模块 id ' + $(m.id) + '">复制</button>' +
    '</div>' +
  '</article>';
}

function renderGrid(modules, filter) {
  const grid = document.getElementById('card-grid');
  const filtered = filter === 'all'
    ? modules
    : modules.filter(m => m.category === filter);
  grid.innerHTML = filtered.map(renderCard).join('') ||
    '<p class="muted" style="grid-column:1/-1">该分类下暂无模块</p>';
}

function renderIdIndex(modules) {
  const body = document.getElementById('id-index-body');
  if (!body) return;
  const $ = window.ONI_CORE.esc;
  if (!modules.length) {
    body.innerHTML = '<p class="muted">暂无模块</p>';
    return;
  }
  body.innerHTML =
    '<table class="id-table"><thead><tr><th>id</th><th>模块名</th></tr></thead><tbody>' +
    modules.map(m => '<tr><td><code>' + $(m.id) + '</code></td><td>' + $(m.name) + '</td></tr>').join('') +
    '</tbody></table>' +
    '<p class="id-note">页面结构锚点：<code>page-header</code> · <code>category-filter</code> · <code>card-grid</code> · <code>page-footer</code></p>';
}

function init() {
  const data = loadData();
  if (!data) return;

  // 1. 校验
  const errs = window.ONI_SCHEMA.validateAll(data);
  if (errs.length) console.warn('[oni-core] schema 告警:\n  ' + errs.join('\n  '));

  // 2. 规范化
  const normalized = window.ONI_CORE.normalizeAll(data);
  const modules = normalized.modules;

  document.getElementById('module-count').textContent = modules.length;
  renderIdIndex(modules);
  renderGrid(modules, 'all');
  if (window.ONI_ID_COPY) window.ONI_ID_COPY.bindCopyButtons();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGrid(modules, btn.dataset.cat);
    });
  });
}

init();
