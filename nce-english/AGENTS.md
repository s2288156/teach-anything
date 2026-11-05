# nce-english · 新概念英语第二册

本工作区用 `teach` skill 组织学习：文件模型与教学法遵循 teach，
本文件只记**本方向在 teach 之上的偏离与收紧**。未在本文件出现的规则，一律按 teach 的默认执行。

> **事实源优先级**：`NOTES.md` > `MISSION.md` > 本文件 > teach 默认。
> 冲突时以 `NOTES.md` 为准，并回头改本文件。
> 难以回退的结构性决策记在 [docs/adr/](docs/adr/)，本文件与 `NOTES.md` 只引用不复述。

## 与 teach 的差异

1. **结构固定成七节（01–07）**：页面纯阅读，交互练习全部交给纸质教材、视频课程与 AI 对话。
   七环节表在 [NOTES.md](NOTES.md)，本文件不复述。
2. **reference 分两类**：`reference/lesson-0N-text.html` 是本课全文批注版（可打印的手册），
   其余 `reference/*.html` 才是 teach 说的速查。同一句课文两处都出现时批注深度不同——
   课程页只批注与本课句型相关的点。
3. **[reference/review.html](reference/review.html) 是唯一需要反复回来的文档**；
   追加规则见 [NOTES.md](NOTES.md)「lesson 与 reference 的分工」。它不在 teach 的 reference
   概念里，是本工作区的累积总表。
4. **多一条课程系列**：`speaking/` 工作口语课，编号独立于 `lessons/`，
   见 [ADR 0003](docs/adr/0003-speaking-topics-series.md)。

## 硬约束

只写 teach 没有、或比 teach 更严的。

1. 只写 `nce-english/` 内的文件；`teach-anything/` 的其它目录只读，不改动
   `teach-anything/` 之外的工作区。
2. 课文原文与第 05 节的技术文档原文必须核对来源，**不凭记忆书写**；优先一手官方文档，
   **整段逐字摘录，不改写、不跨页拼接**，附链接与所在小节名。语料范围与换栈规则见
   [MISSION.md](MISSION.md) 的 Constraints。我们自己写的句子只允许出现在第 06 节，并标明是练习句。
3. 每课按 [NOTES.md](NOTES.md) 的七环节表走完 01–07；走完即止，**不凑内容，也不砍环节**。
4. 页面不放交互组件：不写 localStorage，不出选择题，不嵌音频、不做语音识别。
   唯一的 JS 是 `assets/prompt.js`（复制提示词）。
5. 每课必须落到现实用法：第 04、06 节的规格与用句限制见 [NOTES.md](NOTES.md) 的七环节表。
6. 不收集学习结果反馈：不做摸底、不建学习记录、不要求学习者回填作答数据；
   下一课只依据教材进度与本结构生成。个性化记忆放在 AI 项目侧
   （见 [ADR 0002](docs/adr/0002-pages-stay-read-only.md)）。
7. 写中文用日常说法，**不生造压缩术语**（「装备」「桥接」已废弃，见
   [ADR 0005](docs/adr/0005-plain-chinese-section-names.md)）；必要时直接用英文。
8. `.md` 必须通过 `npm run lint`；中英混排时中文与英文/数字之间加一个半角空格。

## 术语

只列在 teach 之外新增或收窄的词。

| 术语 | 含义 | 易混处 |
| --- | --- | --- |
| 句子骨架 | 一个句子的主干加时态；25 课起的扩展见 [NOTES.md](NOTES.md) 的「教学偏好与约定」 | 不是「句子成分名称表」；页面上首次出现要给白话解释 |
| 课程页 / 全文批注版 | `lessons/`（与 `speaking/`）是课程页，`reference/lesson-0N-text.html` 是全文批注版 | 同一句两处都出现，批注深度不同 |
| 技术文档原句 | 第 05 节整段摘录的官方文档原文 | 不是我们仿写的句子；仿写只出现在第 06 节 |
| 三个 AI 角色 | 陪练 / 批改 / 出题，统一嵌在第 07 节 | 只复制文本，不调 API；陪练建议用豆包语音，批改与出题建议用 Trae / codex |
| 工作口语课 | `speaking/S00N-*.html`，按工作场景插入，只准用已学句型 | 编号独立于 `lessons/`，不按教材顺序 |

## 新增一课教材课程

先按 teach 的 Lessons 与 Assets 两节执行——复用 `assets/` 里的样式与 `prompt.js`、
页脚给首选精读源、末尾提醒可以追问。本文件只补 teach 没规定的步骤。

1. 读 [NOTES.md](NOTES.md)、[MISSION.md](MISSION.md)、
   [reference/review.html](reference/review.html)——分别取结构约定、目标与边界、要复习的句子骨架与句型。
2. 定本课**唯一收获**，一句话写清（01 节要用它）。
3. 核对课文原文：至少两个来源交叉验证，链接写进页脚。
4. 从 [RESOURCES.md](RESOURCES.md) 的来源里挑**一段连续**的真实技术文档（同一页同一小节连续 3 句），
   逐字摘录并记小节名。
5. 按 [NOTES.md](NOTES.md) 的七环节表写 `lessons/000N-<dash-case>.html`；
   第 07 节嵌三个角色各一个复制提示词按钮（按钮模板与 `reference/ai-prompts.html`
   同步各加一份）。
6. 写 `reference/lesson-0N-text.html`：全文批注，含全部生词、搭配、文化注释。
7. 在 `reference/review.html` 按 [NOTES.md](NOTES.md)「lesson 与 reference 的分工」登记本课：
   第 01、02、04、05 节追加行，第 07 节记一条更新记录；若本课引入新的时态或时间标志词，
   同步第 03 节「怎么判断时间」的判据。第 06 节只指向第 01、02 节，不写具体条数。
8. 在 `index.html` 的对应单元课程表追加本课一行：标题直接链到课程页，右侧只放「全文批注版」；
   单元不存在时先加该单元的 `h3` 与 `ul`。在 [RESOURCES.md](RESOURCES.md) 的课程清单
   追加课程页与全文批注版两条。
9. 跑 `npm run check`——它检查全站 HTML 的本地链接、提示词模板与重复 id，再跑 Markdown 格式。
   再用浏览器打开课程页与全文批注版，确认无控制台报错、提示词按钮可用。

判据见 [NOTES.md](NOTES.md) 的「验收判据」一节；达不到就不算完成。

## 新增一课工作口语课

1. 读 `reference/review.html`，确认本课要用的句型**全部已登记**；缺就先上教材课。
2. 定场景：什么时候会用这几句（演示的哪一分钟、会议的哪种卡壳）。
3. 按 4 节写 `speaking/S00N-<dash-case>.html`：01 什么时候用 / 02 脚本句（6–8 句）/
   03 别这么说（3 条中式英语对照）/ 04 拿去和 AI 练（豆包语音陪练提示词）。
4. 在 `review.html` 第 02 节追加本课句型（来源标 `S00N`），在 `index.html`
   的「工作口语课」区块追加一行。
5. 跑 `npm run check`，再用浏览器打开本课页面，确认提示词按钮可用。

## 不做什么

- 不建 `GLOSSARY.md`——术语只在本文件的「术语」一节维护；日常取舍记 `NOTES.md`，
  结构性决策记 `docs/adr/`（见 [ADR 0004](docs/adr/0004-decisions-in-adr.md)）。
- 不做页内交互练习（点词拆句、回译草稿、计时测验），也不做学习结果反馈与记录。
- 不做发音教学，也不在页内嵌音频或做语音识别（标准发音用第三方 app 获取，见 ADR 0002）。
- 不做考试题型、第三册及以上（见 `MISSION.md` 的 Out of scope）。
- 口语只有两种形态：**教材课的第 06 节**（[ADR 0001](docs/adr/0001-speaking-as-second-output.md)）
  与 **`speaking/` 工作口语课**（ADR 0003）；不新开第三条口语主线。
- 不在本文件维护「当前进度」；进度看 `NOTES.md` 待办。
- 页面文字只写给学习者：制作流程、课程进度、上线状态、维护说明留在 `AGENTS.md` 与
  `NOTES.md`，不写进 HTML；`index.html` 只放链接与课程标题，不预填未上线课程。
