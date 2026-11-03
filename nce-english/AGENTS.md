# nce-english · 新概念英语第二册

本工作区用 `teach` skill 组织学习：文件模型与教学法遵循 teach，
本文件只记**本方向在 teach 之上的偏离与收紧**。未在本文件出现的规则，一律按 teach 的默认执行。

> **事实源优先级**：`NOTES.md` > 本文件 > teach 默认。
> 冲突时以 `NOTES.md` 为准，并回头改本文件。

## 与 teach 的三处不同

1. **结构固定成六节（01–06）**，定位是纸质教材与视频课程的**配套导学手册**：
   页面纯阅读，交互练习全部交给纸质教材、视频课程与 AI 对话。六环节表在 [NOTES.md](NOTES.md)，本文件不复述。
2. **reference 分两类**：`reference/lesson-0N-text.html` 是本课完整批注（可打印的手册），
   其余 `reference/*.html` 才是 teach 说的速查。同一句课文两处都出现时批注深度不同——
   课程里只批注与本课技能相关的点。
3. **[reference/review.html](reference/review.html) 是唯一需要反复回来的文档**，只追加不改写。
   它不在 teach 的 reference 概念里，是本工作区的累积总表。

## 硬约束

只写 teach 没有、或比 teach 更严的。

1. 只读写本目录；不查看 `teach-anything` 之外的工作区。
2. 课文原文与桥接句必须核对来源，**不凭记忆书写**；桥接句优先一手官方文档，逐字摘录，
   附链接与所在小节名。桥接语料取自 Spring Boot / Spring Framework / OpenJDK 生态
   （Gradle 是 Spring Boot 官方构建工具，可用）；换栈时整组替换，不要只改个别句子。
3. 每课走完六环节（01–06）；走完即止，**不凑内容，也不砍环节**。
4. 页面不放交互组件：不引用 `sentence.js` / `quiz.js` / `translate.js`（已删除），
   不写 localStorage，不出选择题。唯一的 JS 是 `assets/prompt.js`（复制提示词）。
5. 每课必须落到现实用法：第 04 节给 3 个场景，每个配一条「别这么说」误用对照。
6. 不收集学习结果反馈：不做摸底、不建学习记录、不要求学习者回填作答数据；
   下一课只依据教材进度与本结构生成。
7. `.md` 必须通过 `npm run lint`；中英混排时中文与英文/数字之间加一个半角空格。

## 术语

只列在 teach 之外新增或收窄的词。

| 术语 | 含义 | 易混处 |
| --- | --- | --- |
| 骨架 | 一个句子的主干加时态 | 不是「句子成分名称表」 |
| 导学 / 手册 | `lessons/` 导学，`reference/lesson-0N-text.html` 手册 | 同一句两处都出现，批注深度不同 |
| 生活场景 | 第 04 节的 3 个上班族对话场景 | 不是课文情节复述 |
| 提示词三件套 | 陪练 / 批改员 / 考官，统一嵌在第 06 节 | 只复制文本，不调 API |

## 新增一课：本地增量

先按 teach 的 Lessons 与 Assets 两节执行——复用 `assets/` 里的样式与 `prompt.js`、
页脚给首选精读源、末尾提醒可以追问。本文件只补 teach 没规定的步骤。

1. 读 [NOTES.md](NOTES.md)、[MISSION.md](MISSION.md)、
   [reference/review.html](reference/review.html)——分别取结构约定、目标与边界、要复习的骨架与生活句型。
2. 定本课**唯一收获**，一句话写清（01 节要用它）。
3. 核对课文原文：至少两个来源交叉验证，链接写进页脚。
4. 从 [RESOURCES.md](RESOURCES.md) 的桥接来源里挑 4 句真实技术句，逐字摘录并记小节名。
5. 按六环节写 `lessons/000N-<dash-case>.html`；第 02 节每条词卡带一个搭配与一个误用，
   第 03 节的示范每句书面走三步，第 06 节嵌三角色各一个复制提示词按钮
   （按钮模板与 `reference/ai-prompts.html` 同步各加一份）。
6. 写 `reference/lesson-0N-text.html`：完整批注，含全部生词、搭配、文化注释。
7. 在 `reference/review.html` 追加本课骨架行、3 条生活句型与一行更新记录，不改写已有行。
8. 在 `index.html` 的对应单元课程表追加本课一行（导学 + 手册）；单元不存在时先加该单元的
   `h3` 与 `ul`；同时更新页头「Lesson N 已上线」。
9. 跑 `npm run lint`；用 PowerShell 提取 `index.html` 的本地 `href` 逐个 `Test-Path`，
   再用 `file://` 打开课程，确认无控制台报错、提示词按钮可用。

判据：**读完页面，能不能说出本课唯一收获，能不能复述任一场景的两句英文。**
说不出，说明页面只在罗列知识没在教，本课不算完成。

## 不做什么

- 不建 `GLOSSARY.md` 与 `docs/adr/`——术语在本文件第 3 节，决策在 `NOTES.md` / `MISSION.md`。
- 不做页内交互练习（点词拆句、回译草稿、计时测验），也不做学习结果反馈与记录；
  旧摸底记录只归档、不更新。
- 不在本文件维护「当前进度」；进度看 `NOTES.md` 待办。
- 不在 `index.html` 里重复课程内容或维护学习状态；它只放链接与一行元信息，且不预填未上线课程。
- 不做口语、考试题型、第三册及以上（见 `MISSION.md` 的 Out of scope）。
