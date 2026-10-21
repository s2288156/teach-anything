/* 中译英回译组件
   回译是最强的检索练习：给中文，让你从记忆里把英文骨架重建出来。
   草稿存 localStorage，刷新不丢，方便三天后回来看自己当时错在哪。

   用法：
   <div class="tr" data-translate="l1s1">
     <p class="tr-zh">上周我去了剧院。</p>
     <textarea class="tr-input" rows="2" placeholder="在这里写英文"></textarea>
     <p class="tr-state" data-tr-state></p>
     <details class="tr-ans">
       <summary>对照原文</summary>
       <p class="tr-en">Last week I went to the theatre.</p>
       <p class="tr-note">讲解</p>
     </details>
   </div>

   data-translate 的值必须在本工作区内唯一，它同时是 localStorage 的键。 */

(function () {
  "use strict";

  var PREFIX = "nce-english:translate:";

  function storageAvailable() {
    try {
      window.localStorage.setItem(PREFIX + "__probe", "1");
      window.localStorage.removeItem(PREFIX + "__probe");
      return true;
    } catch (err) {
      return false;
    }
  }

  function stamp() {
    var d = new Date();
    function pad(n) {
      return n < 10 ? "0" + n : String(n);
    }
    return (
      d.getFullYear() +
      "-" +
      pad(d.getMonth() + 1) +
      "-" +
      pad(d.getDate()) +
      " " +
      pad(d.getHours()) +
      ":" +
      pad(d.getMinutes())
    );
  }

  function initBox(box) {
    var id = box.getAttribute("data-translate");
    var input = box.querySelector(".tr-input");
    var state = box.querySelector("[data-tr-state]");
    if (!id || !input) {
      return;
    }

    var key = PREFIX + id;
    var ok = storageAvailable();

    function say(text) {
      if (state) {
        state.textContent = text;
      }
    }

    if (ok) {
      var saved = window.localStorage.getItem(key);
      if (saved) {
        input.value = saved;
        say("已恢复上次草稿");
      }
    } else {
      say("此浏览器不允许本地保存，草稿刷新后会丢");
    }

    var timer = null;
    input.addEventListener("input", function () {
      if (!ok) {
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        window.localStorage.setItem(key, input.value);
        say("草稿已保存 · " + stamp());
      }, 400);
    });

    var clear = box.querySelector("[data-tr-clear]");
    if (clear) {
      clear.addEventListener("click", function () {
        input.value = "";
        if (ok) {
          window.localStorage.removeItem(key);
        }
        say("已清空");
        input.focus();
      });
    }
  }

  function boot() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-translate]"),
      initBox
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
