// oxygen-notes · 数据加载 + 渲染

const CATEGORY_NAMES = {};
const DIFFICULTY_STARS = ['', '★', '★★', '★★★', '★★★★', '★★★★★'];

async function loadData() {
  try {
    const res = await fetch('data/modules.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (e) {
    console.error('Failed to load modules.json:', e);
    document.getElementById('card-grid').innerHTML =
      '<p style="color:#ff6b6b;padding:40px;text-align:center">数据加载失败，请检查 modules.json 文件</p>';
    return null;
  }
}

function buildCategoryMap(categories) {
  categories.forEach(c => { CATEGORY_NAMES[c.id] = c.name; });
}

function renderCard(module) {
  const catName = CATEGORY_NAMES[module.category] || module.category;
  const diffStr = DIFFICULTY_STARS[module.difficulty] || '';
  return `
    <div class="module-card" data-id="${module.id}">
      <span class="card-category">${catName}</span>
      <div class="card-name">${module.name}</div>
      <div class="card-meta">
        <span class="phase">${module.phase || '未标阶段'}</span>
        <span class="difficulty">${diffStr}</span>
      </div>
    </div>
  `;
}

function renderGrid(modules, filter) {
  const grid = document.getElementById('card-grid');
  const filtered = filter === 'all'
    ? modules
    : modules.filter(m => m.category === filter);
  grid.innerHTML = filtered.map(renderCard).join('');

  // 绑定点击事件
  grid.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const mod = modules.find(m => m.id === id);
      if (mod) openDetail(mod);
    });
  });
}

function openDetail(m) {
  const catName = CATEGORY_NAMES[m.category] || m.category;
  const diffStr = DIFFICULTY_STARS[m.difficulty] || '';
  const inputsHtml = (m.inputs_per_cycle || []).map(x =>
    `<li><strong>${x.resource}</strong> — ${x.amount}</li>`
  ).join('') || '<li style="color:var(--text-dim)">暂无数据</li>';
  const outputsHtml = (m.outputs_per_cycle || []).map(x =>
    `<li><strong>${x.resource}</strong> — ${x.amount}</li>`
  ).join('') || '<li style="color:var(--text-dim)">暂无数据</li>';
  const materialsHtml = (m.materials || []).map(x =>
    `<li><span class="mat-count">×${x.count}</span>${x.building}${x.material ? ' <span style="color:var(--text-dim)">(' + x.material + ')</span>' : ''}</li>`
  ).join('') || '<li style="color:var(--text-dim)">暂无数据</li>';
  const notesHtml = (m.notes || []).map(n => `<li>${n}</li>`).join('') || '<li style="color:var(--text-dim)">暂无注意事项</li>';
  const shotsHtml = m.screenshots && m.screenshots.length
    ? m.screenshots.map(s => `<img src="screenshots/${s}" alt="截图">`).join('')
    : '<div class="screenshot-area">📷 截图占位 · 游戏内截图放入 screenshots/ 目录后在此显示</div>';

  const html = `
    <h2 class="detail-title">${m.name}</h2>
    <span class="detail-cat-tag">${catName} · ${m.phase || ''} · 难度 ${diffStr}</span>

    <div class="detail-section">
      <h3>建造布局</h3>
      <p>${m.layout || '（待补充）'}</p>
    </div>

    <div class="detail-section">
      <h3>管道 · 水门 · 走线</h3>
      <p>${m.pipes_wiring || '（待补充）'}</p>
    </div>

    <div class="detail-section">
      <h3>自动化</h3>
      <p>${m.automation || '（待补充）'}</p>
    </div>

    <div class="detail-section">
      <h3>建筑材料清单</h3>
      <ul class="material-list">${materialsHtml}</ul>
    </div>

    <div class="detail-section">
      <h3>每周期投入 / 产出</h3>
      <div class="section-split">
        <div>
          <h4 class="input">📥 消耗</h4>
          <ul>${inputsHtml}</ul>
        </div>
        <div>
          <h4 class="output">📤 产出</h4>
          <ul>${outputsHtml}</ul>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <h3>注意事项</h3>
      <ul class="note-list">${notesHtml}</ul>
    </div>

    <div class="detail-section">
      <h3>截图 / 示意图</h3>
      ${shotsHtml}
    </div>

    <div style="color:var(--text-dim);font-size:12px;text-align:right;margin-top:16px">
      ${m.dlc ? '适用: ' + m.dlc + ' · ' : ''}
      更新于 ${m.updated || '未知'}
    </div>
  `;

  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal').hidden = false;
}

function closeModal() {
  document.getElementById('modal').hidden = true;
}

async function init() {
  const data = await loadData();
  if (!data) return;

  buildCategoryMap(data.categories || []);
  document.getElementById('module-count').textContent = (data.modules || []).length;

  let currentFilter = 'all';
  renderGrid(data.modules || [], currentFilter);

  // 筛选按钮
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.cat;
      renderGrid(data.modules || [], currentFilter);
    });
  });

  // 弹窗关闭
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

init();
