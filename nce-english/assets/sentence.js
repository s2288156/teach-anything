/* 句子拆解组件
   本 mission 的核心动作是「拆开一个英文句子」，选择题只能考认得出，
   点选才考找得到，所以单独做一个组件。

   两种模式：

   1) 示范模式 data-sent-demo —— 逐步演示「找动词 → 定时间 → 切主干」
      <div class="sent" data-sent-demo>
        <p class="sent-text">
          <span class="tok" data-step="1" data-role="verb">went</span>
        </p>
        <ol class="steps">
          <li data-step="1">第一步的讲解</li>
        </ol>
        <button class="sent-play" type="button">逐步演示</button>
      </div>

   2) 练习模式 data-sent-find="verb" —— 用户点击符合要求的词
      <div class="sent" data-sent-find="verb">
        <p class="sent-label">点击句中所有动词</p>
        <p class="sent-text">
          <button class="tok" type="button" data-role="verb">turned</button>
        </p>
        <p class="sent-fb" hidden>答完才展开的讲解</p>
      </div>

   data-role 取值：subj 主语 / verb 动词 / obj 宾语 / adv 状语 / comp 补语 / aux 助动词
   data-step 是示范模式的步骤序号，从 1 开始。 */

(function () {
  "use strict";

  var ROLES = {
    subj: "主语",
    verb: "动词",
    obj: "宾语",
    adv: "状语",
    comp: "补语",
    aux: "助动词",
  };

  function roleLabel(role) {
    return ROLES[role] || role;
  }

  function tag(token, role) {
    if (token.querySelector(".role-tag")) {
      return;
    }
    var el = document.createElement("span");
    el.className = "role-tag";
    el.textContent = roleLabel(role);
    token.appendChild(el);
  }

  /* ---------- 示范模式 ---------- */

  function initDemo(box) {
    var steps = Array.prototype.slice.call(box.querySelectorAll(".steps > li"));
    var play = box.querySelector(".sent-play");
    var current = 0;

    steps.forEach(function (li) {
      li.hidden = true;
    });

    function show(step) {
      Array.prototype.forEach.call(
        box.querySelectorAll('.tok[data-step="' + step + '"]'),
        function (tok) {
          tok.classList.add("lit");
          var role = tok.getAttribute("data-role");
          if (role) {
            tag(tok, role);
          }
        }
      );
      steps.forEach(function (li) {
        if (Number(li.getAttribute("data-step")) === step) {
          li.hidden = false;
        }
      });
    }

    if (!play) {
      steps.forEach(function (li, i) {
        li.hidden = false;
        show(i + 1);
      });
      return;
    }

    play.addEventListener("click", function () {
      if (current >= steps.length) {
        current = 0;
        box.classList.remove("done");
        Array.prototype.forEach.call(
          box.querySelectorAll(".tok"),
          function (tok) {
            tok.classList.remove("lit");
            var t = tok.querySelector(".role-tag");
            if (t) {
              t.remove();
            }
          }
        );
        steps.forEach(function (li) {
          li.hidden = true;
        });
        play.textContent = "逐步演示";
        return;
      }
      current += 1;
      show(current);
      if (current === steps.length) {
        box.classList.add("done");
        play.textContent = "重新演示";
      } else {
        play.textContent = "下一步（" + (current + 1) + " / " + steps.length + "）";
      }
    });
  }

  /* ---------- 练习模式 ---------- */

  function initFind(box) {
    var want = box.getAttribute("data-sent-find");
    var tokens = Array.prototype.slice.call(box.querySelectorAll(".tok"));
    var targets = tokens.filter(function (tok) {
      return tok.getAttribute("data-role") === want;
    });
    var fb = box.querySelector(".sent-fb");
    var found = 0;
    var misses = 0;

    if (!targets.length) {
      return;
    }

    tokens.forEach(function (tok) {
      tok.addEventListener("click", function () {
        if (box.classList.contains("done")) {
          return;
        }
        if (tok.classList.contains("hit")) {
          return;
        }

        if (tok.getAttribute("data-role") === want) {
          tok.classList.add("hit");
          tok.classList.remove("miss");
          tag(tok, want);
          found += 1;
        } else {
          tok.classList.add("miss");
          misses += 1;
          var role = tok.getAttribute("data-role");
          tok.setAttribute(
            "title",
            role ? "这个是" + roleLabel(role) : "这个不是要找的成分"
          );
        }

        if (found === targets.length) {
          box.classList.add("done");
          tokens.forEach(function (t) {
            t.disabled = true;
          });
          if (fb) {
            fb.hidden = false;
            fb.textContent =
              (misses === 0 ? "一次点对。" : "点错 " + misses + " 次。") +
              fb.getAttribute("data-text");
          }
        }
      });
    });
  }

  function boot() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-sent-demo]"),
      initDemo
    );
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-sent-find]"),
      initFind
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
