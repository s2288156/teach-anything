# nce-english · 新概念英语第二册

本工作区用 `teach` skill 组织学习：文件模型与教学法遵循 teach，
本文件只记**本方向在 teach 之上的偏离与收紧**。未在本文件出现的规则，一律按 teach 的默认执行。

> **事实源优先级**：`NOTES.md` > 本文件 > teach 默认。
> 冲突时以 `NOTES.md` 为准，并回头改本文件。

## 与 teach 的三处不同

1. **结构固定成九节**，以「示范 → 你练 → 检索 → 产出」四步闭环为完成标准，
   替代 teach「越短越好」的建议。九环节的表在 [NOTES.md](NOTES.md)，本文件不复述。
2. **reference 分两类**：`reference/lesson-0N-text.html` 是本课完整批注（可打印的手册），
   其余 `reference/*.html` 才是 teach 说的速查。同一句课文两处都出现时批注深度不同——
   课程里只批注与本课技能相关的点。
3. **[reference/review.html](reference/review.html) 是唯一需要反复回来的文档**，只追加不改写。
   它不在 teach 的 reference 概念里，是本工作区的累积总表。

## 硬约束

只写 teach 没有、或比 teach 更严的。

1. 只读写本目录；不查看 `teach-anything` 之外的工作区。
2. 课文原文与桥接句必须核对来源，**不凭记忆书写**；桥接句优先一手官方文档，逐字摘录，
   附链接与所在小节名。桥接语料取自 Java / JVM 生态（Gradle、Spring、Maven、报错栈），
   这是**可修订假设**；换栈时整组替换，不要只改个别句子。
3. 每课走完九环节；走完即止，**不凑时长，也不砍环节**。
4. 只有首测与第 8 / 16 天换过题面的重测取数；同页重做记「复测」，不写进结论。
5. `learning-records/` 按缺口建，**全对不建档**；文件名用缺口命名，不用课号。
6. `.md` 必须通过 `npm run lint`；中英混排时中文与英文/数字之间加一个半角空格。
7. 组件通过 `data-*` 声明式绑定，`data-quiz` / `data-translate` 的值全工作区唯一；
   接口细节见 [NOTES.md](NOTES.md) 的「组件接口约定」一节。

## 术语

只列在 teach 之外新增或收窄的词。

| 术语 | 含义 | 易混处 |
| --- | --- | --- |
| 骨架 | 一个句子的主干加时态 | 不是「句子成分名称表」 |
| 四步闭环 | 示范 → 你练 → 检索 → 产出 | 不是时间预算 |
| 练场 / 手册 | `lessons/` 练，`reference/lesson-0N-text.html` 查 | 同一句两处都出现，批注深度不同 |
| 首测 / 复测 | 首测取数；看过解析后的重做只算复测 | 同页重做不等于进步 |
| 缺口记录 | `learning-records/` 只记没掌握住的 | 全对的课不建档 |

## 新增一课：本地增量

先按 teach 的 Lessons 与 Assets 两节执行——复用 `assets/` 里的组件、页脚给首选精读源、
末尾提醒可以追问。本文件只补 teach 没规定的步骤。

1. 读 [NOTES.md](NOTES.md)、[MISSION.md](MISSION.md)、`learning-records/`、
   [reference/review.html](reference/review.html)——分别取结构约定、目标与边界、已有缺口、要复习的骨架。
2. 定本课**唯一收获**，一句话写清（01 节要用它）。
3. 核对课文原文：至少两个来源交叉验证，链接写进页脚。
4. 从 [RESOURCES.md](RESOURCES.md) 的桥接来源里挑 4 句真实技术句，逐字摘录并记小节名。
5. 按九环节写 `lessons/000N-<dash-case>.html`。
6. 写 `reference/lesson-0N-text.html`：完整批注，含全部生词、搭配、文化注释。
7. 在 `reference/review.html` 追加本课骨架行与一行更新记录，不改写已有行。
8. 跑 `npm run lint`；用 `file://` 打开课程，确认组件可用、无控制台报错。
9. 判是否建档：全对不建；有缺口才建缺口记录，并同步 `NOTES.md` 待办。

判据：**第 04、05、06 节能不能不回看第 02、03 节就完成？**
不能，说明还在靠翻页而不是靠记忆，本课不算完成。

## 不做什么

- 不建 `GLOSSARY.md` 与 `docs/adr/`——术语在本文件第 3 节，决策在 `NOTES.md` / `MISSION.md`。
- 不在本文件维护「当前进度」；进度看 `NOTES.md` 待办与 `learning-records/`。
- 不做口语、考试题型、第三册及以上（见 `MISSION.md` 的 Out of scope）。
