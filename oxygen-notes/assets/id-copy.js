// 模块 id 复制：列表卡片与模块详情页共用同一份实现
// 暴露 window.ONI_ID_COPY.bindCopyButtons()，在页面初始化时调用一次即可

(function () {
  const FEEDBACK_MS = 1500;

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
    }, FEEDBACK_MS);
  }

  function selectNodeText(node) {
    if (!node || !window.getSelection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  let bound = false;

  function bindCopyButtons() {
    if (bound) return;
    bound = true;
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

  window.ONI_ID_COPY = { bindCopyButtons, copyText };
})();
