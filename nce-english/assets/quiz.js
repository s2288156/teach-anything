/* 测验组件
   用法：
   <section class="quiz" data-quiz>
     <div class="q" data-answer="1">
       <p class="q-text"><span class="q-no">1</span>题干</p>
       <div class="opts">
         <button class="opt" type="button">选项</button>
       </div>
       <p class="explain" hidden>解析</p>
     </div>
     <p class="score" data-score hidden></p>
   </section>
   data-answer 是从 0 开始的正确选项下标。

   可选：给 section 加 data-quiz="l1-00"。
   加上后：
   - 题目前会挂一个「开始答题」按钮，点击后才计时、才能选项，
     计时在答完最后一题时停止；
   - 本轮作答存进 localStorage，测验尾部出现记录条
     （上次记录 · 复制为 Markdown · 清空）。
   data-quiz 的值必须在本工作区内唯一，它同时是 localStorage 的键。
   不加 data-quiz 时组件无状态、也不计时，行为和以前一样。 */

(function () {
  "use strict";

  var PREFIX = "nce-english:quiz:";

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

  /* 把一轮作答渲染成可以直接粘进 learning-records 的 Markdown 表格。
     「学习者选择」按人眼看的第 1–4 项记，所以存的是 0 起算下标，输出时 +1。
     「用时」是单题耗时：第一题从点「开始答题」算起，之后每题从上一次作答算起。 */
  function toMarkdown(id, run) {
    var lines = [];
    var right = run.picks.filter(function (p) {
      return p.ok;
    }).length;
    var head = "> " + id + " · " + run.at + " · 答对 " + right + " / " + run.picks.length;
    if (typeof run.total === "number") {
      head += " · 总用时 " + run.total + " 秒";
    }
    lines.push(head);
    lines.push("");
    lines.push("| # | 学习者选择 | 对错 | 用时（秒） | 备注 |");
    lines.push("| --- | --- | --- | --- | --- |");
    run.picks.forEach(function (p, i) {
      lines.push(
        "| " + (i + 1) + " | " + (p.c + 1) + " | " + (p.ok ? "对" : "错") + " | " + p.sec + " | |"
      );
    });
    return lines.join("\n");
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

  /* file:// 下 Clipboard API 常被禁用，退回到 execCommand 的老办法。 */
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

  function buildGate() {
    var gate = document.createElement("div");
    gate.className = "quiz-gate";
    gate.innerHTML =
      '<p class="quiz-gate-text">计时从点这个按钮开始，答完最后一题自动停。</p>' +
      '<button class="quiz-btn" type="button" data-quiz-start>开始答题</button>';
    return gate;
  }

  function buildBar() {
    var bar = document.createElement("div");
    bar.className = "quiz-bar";
    bar.innerHTML =
      '<p class="quiz-status" data-quiz-status></p>' +
      '<p class="quiz-tools">' +
      '<button class="quiz-btn" type="button" data-quiz-copy disabled>复制为 Markdown</button>' +
      '<button class="quiz-btn" type="button" data-quiz-reset disabled>清空</button>' +
      "</p>" +
      '<pre class="quiz-md" data-quiz-md hidden></pre>';
    return bar;
  }

  function initQuiz(quiz) {
    var questions = Array.prototype.slice.call(quiz.querySelectorAll(".q"));
    var scoreEl = quiz.querySelector("[data-score]");
    var id = quiz.getAttribute("data-quiz");
    var answered = 0;
    var correct = 0;
    var picks = [];
    var run = null;
    var started = false;
    var startAt = 0;
    var lastAt = 0;
    var total = 0;

    var gate = null;
    var startBtn = null;
    var bar = null;
    var statusEl = null;
    var copyBtn = null;
    var resetBtn = null;
    var mdEl = null;
    var canStore = false;

    function allOpts() {
      return Array.prototype.slice.call(quiz.querySelectorAll(".opt"));
    }

    function lockOpts() {
      allOpts().forEach(function (o) {
        o.disabled = true;
      });
    }

    function unlockOpts() {
      allOpts().forEach(function (o) {
        o.disabled = false;
      });
    }

    if (id) {
      canStore = storageAvailable();

      gate = buildGate();
      startBtn = gate.querySelector("[data-quiz-start]");
      if (questions.length) {
        quiz.insertBefore(gate, questions[0]);
      } else {
        quiz.appendChild(gate);
      }
      lockOpts();

      bar = buildBar();
      quiz.appendChild(bar);
      statusEl = bar.querySelector("[data-quiz-status]");
      copyBtn = bar.querySelector("[data-quiz-copy]");
      resetBtn = bar.querySelector("[data-quiz-reset]");
      mdEl = bar.querySelector("[data-quiz-md]");

      if (canStore) {
        var raw = window.localStorage.getItem(PREFIX + id);
        if (raw) {
          try {
            run = JSON.parse(raw);
          } catch (err) {
            run = null;
          }
        }
        if (run && run.picks) {
          var right = run.picks.filter(function (p) {
            return p.ok;
          }).length;
          var note = "上次记录：" + run.at + " · 答对 " + right + " / " + run.picks.length + " 题";
          if (typeof run.total === "number") {
            note += " · 总用时 " + run.total + " 秒";
          }
          statusEl.textContent = note;
          copyBtn.disabled = false;
          resetBtn.disabled = false;
        }
      } else {
        statusEl.textContent = "此浏览器不允许本地保存，作答记录刷新后会丢";
      }

      startBtn.addEventListener("click", function () {
        started = true;
        startAt = Date.now();
        lastAt = startAt;
        gate.hidden = true;
        unlockOpts();
      });
    }

    function save() {
      if (!id || !canStore) {
        return;
      }
      run = { at: stamp(), picks: picks, total: total };
      try {
        window.localStorage.setItem(PREFIX + id, JSON.stringify(run));
      } catch (err) {
        return;
      }
      copyBtn.disabled = false;
      resetBtn.disabled = false;
    }

    questions.forEach(function (q, qi) {
      var answer = Number(q.getAttribute("data-answer"));
      var opts = Array.prototype.slice.call(q.querySelectorAll(".opt"));
      var explain = q.querySelector(".explain");

      opts.forEach(function (opt, index) {
        opt.addEventListener("click", function () {
          if (q.getAttribute("data-done")) {
            return;
          }
          if (id && !started) {
            return;
          }
          q.setAttribute("data-done", "1");
          answered += 1;

          opts.forEach(function (o, i) {
            o.disabled = true;
            if (i === answer) {
              o.classList.add("correct");
            }
          });

          if (index === answer) {
            correct += 1;
          } else {
            opt.classList.add("wrong");
          }

          if (explain) {
            explain.hidden = false;
          }

          if (id) {
            var now = Date.now();
            var sec = Math.max(1, Math.round((now - lastAt) / 1000));
            lastAt = now;
            picks[qi] = { c: index, ok: index === answer, sec: sec };

            if (answered === questions.length) {
              total = Math.max(1, Math.round((now - startAt) / 1000));
            }
            save();
          }

          if (scoreEl && answered === questions.length) {
            scoreEl.textContent =
              "本轮答对 " +
              correct +
              " / " +
              questions.length +
              " 题" +
              (id ? " · 总用时 " + total + " 秒" : "");
            scoreEl.hidden = false;
          }
        });
      });
    });

    if (!id) {
      return;
    }

    copyBtn.addEventListener("click", function () {
      if (!run || !run.picks) {
        return;
      }
      copyText(toMarkdown(id, run), function (ok) {
        if (ok) {
          statusEl.textContent = "已复制，粘进 learning-records 即可";
          mdEl.hidden = true;
          return;
        }
        mdEl.textContent = toMarkdown(id, run);
        mdEl.hidden = false;
        statusEl.textContent = "浏览器不允许自动复制，手动选中下面这段";
      });
    });

    resetBtn.addEventListener("click", function () {
      if (canStore) {
        window.localStorage.removeItem(PREFIX + id);
      }
      run = null;
      picks = [];
      answered = 0;
      correct = 0;
      started = false;
      total = 0;
      copyBtn.disabled = true;
      resetBtn.disabled = true;
      mdEl.hidden = true;
      statusEl.textContent = "已清空记录，重新点「开始答题」即可";
      gate.hidden = false;
      Array.prototype.forEach.call(quiz.querySelectorAll(".q"), function (q) {
        q.removeAttribute("data-done");
        Array.prototype.forEach.call(q.querySelectorAll(".opt"), function (o) {
          o.classList.remove("correct", "wrong");
        });
        var explain = q.querySelector(".explain");
        if (explain) {
          explain.hidden = true;
        }
      });
      lockOpts();
      if (scoreEl) {
        scoreEl.hidden = true;
      }
    });
  }

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-quiz]"), initQuiz);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
