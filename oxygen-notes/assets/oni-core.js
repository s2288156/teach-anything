// oxygen-notes · 核心模块
// 跨 app.js / module.js 的唯一数据边界 adapter
// 暴露 ONI_CORE 与 ONI_SCHEMA
//
// 职责分层：
//   ONI_SCHEMA.validate(raw, categories) → errors[]
//     编码 AGENTS.md 规则，发现数据问题
//   ONI_CORE.normalizeModule(raw, categories) → module (shape 统一)
//     把 raw JSON 规范化为渲染器可直接消费的形态
//   ONI_CORE.esc / difficultyStars / resolveCategory
//     共享工具，不再在 app.js / module.js 各写一份

(function () {

  // ──────────────────────────── Shared utils ─────────────────────────────

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  const DIFFICULTY_STARS = ['', '★', '★★', '★★★', '★★★★', '★★★★★'];

  function difficultyStars(d) {
    return DIFFICULTY_STARS[d] || '';
  }

  function resolveCategory(id, categories) {
    if (!Array.isArray(categories)) return id;
    const found = categories.find(c => c.id === id);
    return found ? found.name : id;
  }

  // ──────────────────────────── Validator ────────────────────────────────

  const REQUIRED_FIELDS = ['id', 'name', 'category', 'phase', 'difficulty',
    'materials', 'inputs_per_cycle', 'outputs_per_cycle'];

  const IMAGE_INDEX_FORBIDDEN_FIELDS = [
    'layout', 'pipes_wiring', 'automation', 'notes', 'specs'
  ];

  function kebabCaseId(id) {
    return /^[a-z][a-z0-9-]*[a-z0-9]$/.test(id);
  }

  function validateModule(raw, categories) {
    const errors = [];
    if (!raw || typeof raw !== 'object') {
      errors.push('模块数据不是对象');
      return errors;
    }

    REQUIRED_FIELDS.forEach(key => {
      if (!(key in raw)) errors.push('缺少必填字段：' + key);
    });

    if (typeof raw.id === 'string' && !kebabCaseId(raw.id)) {
      errors.push('id 必须是 lowercase kebab-case，当前：' + raw.id);
    }

    if (typeof raw.category === 'string' && Array.isArray(categories)) {
      const known = categories.some(c => c.id === raw.category);
      if (!known) errors.push('category 未在 categories 表里登记：' + raw.category);
    }

    if (typeof raw.difficulty === 'number' &&
        (raw.difficulty < 1 || raw.difficulty > 5)) {
      errors.push('difficulty 应在 1-5 之间，当前：' + raw.difficulty);
    }

    // image-index 专属检查
    if (raw.layoutMode === 'image-index') {
      IMAGE_INDEX_FORBIDDEN_FIELDS.forEach(key => {
        if (key in raw) errors.push(
          'image-index 模块不得包含 ' + key + ' 字段（写进 screenshot 的 note 里）'
        );
      });
      if (!('materials_note' in raw)) errors.push(
        'image-index 模块应包含 materials_note'
      );
    }

    // screenshots：image-index 下必填且 shape 必须是 object
    const shots = raw.screenshots;
    if (Array.isArray(shots)) {
      shots.forEach((s, i) => {
        if (typeof s === 'string') {
          errors.push('screenshots[' + i + '] 是字符串，应升级为 object shape');
          return;
        }
        if (!s || typeof s !== 'object') {
          errors.push('screenshots[' + i + '] 不是有效对象');
          return;
        }
        ['file', 'title', 'note'].forEach(k => {
          if (!(k in s)) errors.push('screenshots[' + i + '] 缺少：' + k);
        });
      });
    }

    return errors;
  }

  function validateAll(data) {
    const errs = [];
    if (!data || !Array.isArray(data.modules)) return errs;
    data.modules.forEach(m => {
      const sub = validateModule(m, data.categories);
      sub.forEach(e => errs.push('[module ' + (m.id || '?') + '] ' + e));
    });
    return errs;
  }

  // ──────────────────────────── Normalizer ───────────────────────────────

  function normalizeShot(s, i) {
    if (typeof s === 'string') return { file: s, title: '示意图 ' + (i + 1),
      desc: '', view: '', note: '', shows: [] };
    if (!s || typeof s !== 'object') return null;
    return Object.assign({ file: '', title: '', desc: '', view: '', note: '', shows: [] }, s);
  }

  function normalizeModule(raw, categories) {
    if (!raw || typeof raw !== 'object') return null;
    const catName = resolveCategory(raw.category, categories);
    return Object.assign({}, raw, {
      _categoryName: catName,
      _difficultyStars: difficultyStars(raw.difficulty),
      screenshots: Array.isArray(raw.screenshots)
        ? raw.screenshots.map(normalizeShot).filter(Boolean)
        : []
    });
  }

  function normalizeAll(data) {
    if (!data || !Array.isArray(data.modules)) return { modules: [] };
    return {
      categories: data.categories || [],
      modules: data.modules.map(m => normalizeModule(m, data.categories)).filter(Boolean)
    };
  }

  // ──────────────────────────── Exports ──────────────────────────────────

  window.ONI_CORE = {
    esc, difficultyStars, resolveCategory,
    normalizeModule, normalizeAll
  };

  window.ONI_SCHEMA = {
    validateModule, validateAll
  };

})();
