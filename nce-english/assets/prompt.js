/* 复制提示词组件
   课程不调用 AI 接口，只负责把写好的提示词放进剪贴板，
   由学习者自己粘到任意 AI 对话里。

   用法：
   <div class="prompt">
     <p class="prompt-lead">让 AI 当批改员。</p>
     <p class="prompt-tools">
       <button class="prompt-btn" type="button" data-copy-prompt="p-l1-correct">复制提示词</button>
       <span class="prompt-state" data-prompt-state></span>
     </p>
     <template id="p-l1-correct">
       <p>第一段指令。</p>
       <p>第二段指令。</p>
     </template>
   </div>

   template 内用多个 <p> 分段，复制时按空行拼接。
   file:// 下 Clipboard API 常被禁用，自动退回 execCommand。 */

(function () {
  "use strict";

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "readonly");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          done(true);
        },
        function () {
          done(fallbackCopy(text));
        }
      );
      return;
    }
    done(fallbackCopy(text));
  }

  function blockText(el) {
    var copy = el.cloneNode(true);
    Array.prototype.forEach.call(copy.querySelectorAll("br"), function (br) {
      br.parentNode.replaceChild(document.createTextNode("\n"), br);
    });
    return copy.textContent.trim();
  }

  function readPrompt(id) {
    var tpl = document.getElementById(id);
    if (!tpl) {
      return "";
    }
    var root = tpl.content || tpl;
    var blocks = root.querySelectorAll("p");
    if (blocks.length) {
      return Array.prototype.map
        .call(blocks, blockText)
        .filter(function (t) {
          return t !== "";
        })
        .join("\n\n");
    }
    return blockText(root);
  }

  function findBox(el) {
    var node = el.parentNode;
    while (node && node.nodeType === 1) {
      if (node.classList && node.classList.contains("prompt")) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  }

  /* 复制被浏览器拒绝时，把提示词展开到页面上并自动全选，
     否则「请手动选取」这句话无处可选——模板内容本来是不可见的。 */
  function showFallback(box, text) {
    if (!box) {
      return;
    }
    var pre = box.querySelector(".prompt-fallback");
    if (!pre) {
      pre = document.createElement("pre");
      pre.className = "prompt-fallback";
      box.appendChild(pre);
    }
    pre.textContent = text;
    var range = document.createRange();
    range.selectNodeContents(pre);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function clearFallback(box) {
    var pre = box && box.querySelector(".prompt-fallback");
    if (pre) {
      pre.parentNode.removeChild(pre);
    }
  }

  function initButton(btn) {
    var id = btn.getAttribute("data-copy-prompt");
    var box = findBox(btn);
    var state = box ? box.querySelector("[data-prompt-state]") : null;
    var label = btn.textContent;
    var timer = null;

    function say(text) {
      if (state) {
        state.textContent = text;
      }
    }

    btn.addEventListener("click", function () {
      var text = readPrompt(id);
      if (!text) {
        say("找不到提示词模板");
        return;
      }
      copyText(text, function (ok) {
        if (ok) {
          btn.textContent = "已复制";
          say("粘到任意 AI 对话即可");
          clearFallback(box);
        } else {
          btn.textContent = "复制失败";
          say("浏览器不允许自动复制，已展开提示词，请手动全选复制");
          showFallback(box, text);
        }
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          btn.textContent = label;
          say("");
        }, 1800);
      });
    });
  }

  function boot() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-copy-prompt]"),
      initButton
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
