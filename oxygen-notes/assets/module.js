// 模块独立页：左侧导航 + 锚点滚动 + 图片缩放查看

const CATEGORY_NAMES = {};
const DIFFICULTY_STARS = ['', '★', '★★', '★★★', '★★★★', '★★★★★'];

const SECTIONS = [
  { id: 'overview', label: '概览' },
  { id: 'specs', label: '关键参数' },
  { id: 'layout', label: '建造布局' },
  { id: 'pipes', label: '管道 · 液门 · 走线' },
  { id: 'automation', label: '自动化' },
  { id: 'io', label: '投入产出' },
  { id: 'notes', label: '注意事项' },
  { id: 'shots', label: '示意图' }
];

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getPageModuleId() {
  const fromBody = document.body.dataset.moduleId;
  if (fromBody) return fromBody;
  const file = decodeURIComponent(location.pathname.split('/').pop() || '');
  return file.replace(/\.html$/, '');
}

function init() {
  const id = getPageModuleId();
  const data = window.ONI_DATA;
  if (!data) {
    document.getElementById('module-main').innerHTML =
      '<p class="error-msg">数据加载失败，请检查 data/modules.js</p>';
    return;
  }
  data.categories.forEach(c => { CATEGORY_NAMES[c.id] = c.name; });
  const m = data.modules.find(x => x.id === id);
  if (!m) {
    document.getElementById('module-main').innerHTML =
      '<p class="error-msg">未找到模块：' + esc(id) + '</p>';
    return;
  }
  document.title = m.name + ' · oxygen-notes';
  renderHeader(m);
  renderNav(m);
  renderMain(m);
  if (window.ONI_ID_COPY) window.ONI_ID_COPY.bindCopyButtons();
  bindLightbox();
  bindScrollSpy();
}

function renderHeader(m) {
  document.getElementById('module-title').textContent = m.name;
  const cat = CATEGORY_NAMES[m.category] || m.category;
  document.getElementById('module-sub').textContent =
    cat + ' · ' + (m.phase || '未标阶段') + ' · 难度 ' + (DIFFICULTY_STARS[m.difficulty] || '');
  renderHeaderId(m.id);
}

function renderHeaderId(id) {
  const sub = document.getElementById('module-sub');
  if (!sub) return;
  let row = document.getElementById('module-header-id-row');
  if (!row) {
    row = document.createElement('div');
    row.className = 'header-id-row';
    row.id = 'module-header-id-row';
    row.innerHTML = '<code class="card-id"></code>' +
      '<button class="copy-id-btn" type="button">复制</button>';
    sub.insertAdjacentElement('afterend', row);
  }
  const code = row.querySelector('.card-id');
  const btn = row.querySelector('.copy-id-btn');
  if (code) code.textContent = id;
  if (btn) {
    btn.dataset.copyId = id;
    btn.setAttribute('aria-label', '复制模块 id ' + id);
  }
}

function renderNav(m) {
  const nav = document.getElementById('side-nav');
  let html = '<p class="nav-head">本页导航</p><ul class="nav-list">';
  SECTIONS.forEach(s => {
    if (s.id === 'specs' && !(m.specs || []).length) return;
    if (s.id === 'shots' && !(m.screenshots || []).length) return;
    html += `<li><a href="#${s.id}" data-nav="${s.id}">${s.label}</a></li>`;
  });
  html += '</ul>';

  if ((m.screenshots || []).length) {
    html += '<p class="nav-head">图片索引</p><ul class="nav-list nav-shots">';
    m.screenshots.forEach((s, i) => {
      const file = typeof s === 'string' ? s : s.file;
      const desc = typeof s === 'string' ? `示意图 ${i + 1}` : (s.desc || `示意图 ${i + 1}`);
      html += `<li><a href="#shot-${i}" data-nav="shot-${i}">${esc(desc)}</a></li>`;
      void file;
    });
    html += '</ul>';
  }

  if (m.source) {
    html += `<a class="nav-source" href="${esc(m.source)}" target="_blank" rel="noopener">来源文档 ↗</a>`;
  }
  nav.innerHTML = html;
}

function renderMain(m) {
  const cat = CATEGORY_NAMES[m.category] || m.category;

  const specsHtml = (m.specs || []).length
    ? `<section class="module-section" id="specs">
        <h2>关键参数</h2>
        <table class="spec-table"><tbody>
          ${m.specs.map(s => `<tr><th>${esc(s.key)}</th><td>${esc(s.value)}</td></tr>`).join('')}
        </tbody></table>
      </section>` : '';

  const materialsHtml = (m.materials || []).length
    ? `<ul class="material-list">${(m.materials || []).map(x => {
        const count = typeof x.count === 'number' ? `<span class="mat-count">×${x.count}</span>` : '';
        const mat = x.material ? ` <span class="mat-material">(${esc(x.material)})</span>` : '';
        return `<li>${count}${esc(x.building)}${mat}</li>`;
      }).join('')}</ul>` : '<p class="muted">暂无数据</p>';

  const inputsHtml = (m.inputs_per_cycle || []).length
    ? `<ul>${(m.inputs_per_cycle || []).map(x => `<li><strong>${esc(x.resource)}</strong> — ${esc(x.amount)}</li>`).join('')}</ul>`
    : '<p class="muted">暂无数据</p>';
  const outputsHtml = (m.outputs_per_cycle || []).length
    ? `<ul>${(m.outputs_per_cycle || []).map(x => `<li><strong>${esc(x.resource)}</strong> — ${esc(x.amount)}</li>`).join('')}</ul>`
    : '<p class="muted">暂无数据</p>';

  const notesHtml = (m.notes || []).length
    ? `<ul class="note-list">${(m.notes || []).map(n => `<li>${esc(n)}</li>`).join('')}</ul>`
    : '<p class="muted">暂无注意事项</p>';

  const shotsHtml = (m.screenshots || []).length
    ? (m.screenshots || []).map((s, i) => {
        const file = typeof s === 'string' ? s : s.file;
        const desc = typeof s === 'string' ? `示意图 ${i + 1}` : (s.desc || `示意图 ${i + 1}`);
        const view = typeof s === 'string' ? '' : (s.view || '');
        const shows = typeof s === 'string' ? [] : (s.shows || []);
        const tags = shows.length
          ? `<div class="shot-tags">${shows.map(t => `<span class="shot-tag">${esc(t)}</span>`).join('')}</div>`
          : '';
        return `<figure class="shot" id="shot-${i}">
          ${view ? `<figcaption class="shot-view">${esc(view)}</figcaption>` : ''}
          <img src="../screenshots/${esc(file)}" alt="${esc(m.name + ' ' + desc)}" data-zoom="1">
          <figcaption>${esc(desc)} · 点击放大</figcaption>
          ${tags}
        </figure>`;
      }).join('')
    : '<p class="muted">暂无示意图</p>';

  const credit = m.imageCredit
    ? `<p class="image-credit">${esc(m.imageCredit)}</p>` : '';

  const html = `
    <section class="module-section" id="overview">
      <h2>概览</h2>
      <p class="muted">分类：${esc(cat)}　阶段：${esc(m.phase || '未标')}　适用：${esc(m.dlc || '未标')}</p>
      <p>${esc(m.layout || '（待补充布局说明）')}</p>
    </section>

    ${specsHtml}

    <section class="module-section" id="layout">
      <h2>建造布局</h2>
      <p>${esc(m.layout || '（待补充）')}</p>
      <h3>建筑材料清单</h3>
      ${materialsHtml}
    </section>

    <section class="module-section" id="pipes">
      <h2>管道 · 液门 · 走线</h2>
      <p>${esc(m.pipes_wiring || '（待补充）')}</p>
    </section>

    <section class="module-section" id="automation">
      <h2>自动化</h2>
      <p>${esc(m.automation || '（待补充）')}</p>
    </section>

    <section class="module-section" id="io">
      <h2>每周期投入 / 产出</h2>
      <div class="section-split">
        <div><h4 class="input">📥 消耗</h4>${inputsHtml}</div>
        <div><h4 class="output">📤 产出</h4>${outputsHtml}</div>
      </div>
    </section>

    <section class="module-section" id="notes">
      <h2>注意事项</h2>
      ${notesHtml}
    </section>

    <section class="module-section" id="shots">
      <h2>示意图</h2>
      ${shotsHtml}
      ${credit}
    </section>

    <p class="updated-line">更新于 ${esc(m.updated || '未知')}</p>
  `;

  document.getElementById('module-main').innerHTML = html;
}

function bindLightbox() {
  document.querySelectorAll('img[data-zoom]').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });
}

function openLightbox(src, alt) {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = `
    <div class="lightbox-toolbar">
      <button data-act="out">−</button>
      <span class="zoom-val">100%</span>
      <button data-act="in">+</button>
      <button data-act="reset">复位</button>
      <button data-act="close">关闭</button>
    </div>
    <div class="lightbox-stage"><img src="${src}" alt="${alt}"></div>
    <span class="lightbox-hint">滚轮缩放 · 拖动查看细节</span>`;

  document.body.appendChild(box);
  const stage = box.querySelector('.lightbox-stage');
  const img = box.querySelector('img');
  const val = box.querySelector('.zoom-val');
  let zoom = 1;

  const apply = () => {
    img.style.transform = `scale(${zoom})`;
    val.textContent = Math.round(zoom * 100) + '%';
  };

  box.querySelector('.lightbox-toolbar').addEventListener('click', e => {
    const act = e.target.dataset.act;
    if (!act) return;
    if (act === 'in') zoom = Math.min(zoom + 0.25, 5);
    if (act === 'out') zoom = Math.max(zoom - 0.25, 0.5);
    if (act === 'reset') zoom = 1;
    if (act === 'close') { box.remove(); return; }
    apply();
  });

  stage.addEventListener('wheel', e => {
    e.preventDefault();
    zoom = Math.min(Math.max(zoom + (e.deltaY < 0 ? 0.15 : -0.15), 0.5), 5);
    apply();
  }, { passive: false });

  // 拖动平移
  let dragging = false, sx = 0, sy = 0, sl = 0, st = 0;
  stage.addEventListener('mousedown', e => {
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    sl = stage.scrollLeft; st = stage.scrollTop;
    stage.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', () => { dragging = false; stage.style.cursor = 'grab'; });
  stage.addEventListener('mousemove', e => {
    if (!dragging) return;
    stage.scrollLeft = sl - (e.clientX - sx);
    stage.scrollTop = st - (e.clientY - sy);
  });

  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape') { box.remove(); document.removeEventListener('keydown', onKey); }
  });

  apply();
}

function bindScrollSpy() {
  const links = Array.from(document.querySelectorAll('.nav-list a[data-nav]'));
  const targets = links
    .map(a => document.getElementById(a.dataset.nav))
    .filter(Boolean);
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active', a.dataset.nav === entry.target.id));
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  targets.forEach(t => observer.observe(t));
}

init();
