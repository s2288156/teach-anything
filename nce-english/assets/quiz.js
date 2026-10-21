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
   data-answer 是从 0 开始的正确选项下标。 */

(function () {
  "use strict";

  function initQuiz(quiz) {
    var questions = Array.prototype.slice.call(quiz.querySelectorAll(".q"));
    var scoreEl = quiz.querySelector("[data-score]");
    var answered = 0;
    var correct = 0;

    questions.forEach(function (q) {
      var answer = Number(q.getAttribute("data-answer"));
      var opts = Array.prototype.slice.call(q.querySelectorAll(".opt"));
      var explain = q.querySelector(".explain");

      opts.forEach(function (opt, index) {
        opt.addEventListener("click", function () {
          if (q.getAttribute("data-done")) {
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

          if (scoreEl && answered === questions.length) {
            scoreEl.textContent =
              "本轮答对 " + correct + " / " + questions.length + " 题";
            scoreEl.hidden = false;
          }
        });
      });
    });
  }

  function boot() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-quiz]"),
      initQuiz
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
