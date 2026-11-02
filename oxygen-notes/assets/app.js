// 总入口：渲染模块卡片，点击进入独立模块页

const CATEGORY_NAMES = {};
const DIFFICULTY_STARS = ['', '★', '★★', '★★★', '★★★★', '★★★★★'];

function loadData() {
  if (!window.ONI_DATA) {
    document.getElementById('card-grid').innerHTML =
      '<p class="error-msg">数据加载失败，请检查 data/modules.js 文件</p>';
    return null;
  }
  return window.ONI_DATA;
}

function renderCard(m) {
  const catName = CATEGORY_NAMES[m.category] || m.category;
  const diffStr = DIFFICULTY_STARS[m.difficulty] || '';
  const shotCount = (m.screenshots || []).length;
  return `
    <a class="module-card" href="modules/${m.id}.html">
      <span class="card-category">${catName}</span>
      <div class="card-name">${m.name}</div>
      <div class="card-meta">
        <span class="phase">${m.phase || '未标阶段'}</span>
        <span class="difficulty">${diffStr}</span>
      </div>
      ${shotCount ? `<span class="card-shots">📷 ${shotCount} 张示意图</span>` : ''}
    </a>`;
}

function renderGrid(modules, filter) {
  const grid = document.getElementById('card-grid');
  const filtered = filter === 'all'
    ? modules
    : modules.filter(m => m.category === filter);
  grid.innerHTML = filtered.map(renderCard).join('')
    || '<p class="muted" style="grid-column:1/-1">该分类下暂无模块</p>';
}

function init() {
  const data = loadData();
  if (!data) return;

  data.categories.forEach(c => { CATEGORY_NAMES[c.id] = c.name; });
  document.getElementById('module-count').textContent = (data.modules || []).length;

  renderGrid(data.modules || [], 'all');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGrid(data.modules || [], btn.dataset.cat);
    });
  });
}

init();
