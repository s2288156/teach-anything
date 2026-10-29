# 新概念英语第二册 Resources

## Knowledge

- [教材：《新概念英语》第二册（外研社 / Longman）](https://www.fltrp.com/)
  课文原文、生词表、Key Structures（关键句型）与配套录音的一手依据。
  Use for: 课文原文、生词释义、句型出处。

- [《新概念英语》第二册文本（高中英语教学交流网）](http://www.zshunj.cn/minishow.asp?id=1498)
  第二册逐课课文纯文本。Use for: 核对课文原文。

- [新概念第二册第一课（环球网校）](https://www.hqwx.com/legacy_news/html/2008-2/200822792148329.html)
  Lesson 1 课文原文。Use for: 本课原文的第二来源交叉核对。

- [新概念英语第二册课文翻译及学习笔记（无忧考网）](https://www.51test.net/show/8836692.html)
  逐课课文、参考译文与学习笔记。Use for: 译文比对、易混词辨析。

- [新概念第二册 Lesson 2 课文深度解析（沪江网）](https://www.hujiang.com/c/xgnyydec/p989168/)
  Lesson 2 课文逐句解析与语法点归纳。Use for: 本课原文的第二来源交叉核对、
  一般现在时与现在进行时的课文依据。

- [新概念英语第二册 30 篇课文（沪江网）](https://m.hujiang.com/c/nceer/p1148716/)
  Lesson 2 课文原文与中文译文。Use for: 原文逐字核对、译文比对。
  该来源将 `lunchtime` 排作 `lunch time`，本课统一采用教材合写 `lunchtime`。

### 桥接语料（真实技术英语）

课程第 08 节的四句原文逐字摘录、未作改写。
选材标准：挑「已经发生的事」——release notes、升级说明、故障排查。
这类文本时态切换密集，也正是读 Spring / JDK 文档时最先撞上的那类句子。

- [Spring Boot Release Notes（GitHub Wiki）](https://github.com/spring-projects/spring-boot/wiki)
  每版变更说明。`Upgrading from Spring Boot 3.x` 各小节用
  `has been added` / `Previously, ... would have been used` 讲已发生的变化。
  Use for: 现在完成时、过去时、被动语态。**新增课程的首选来源。**

- [Spring Boot Reference](https://docs.spring.io/spring-boot/reference/index.html)
  官方参考文档。陈述语体为主，长句多、从句嵌套深。
  Use for: 主干切分、从句嵌套、条件与目的状语。

- [Spring Framework Reference](https://docs.spring.io/spring-framework/reference/index.html)
  官方参考文档，与 Spring Boot 同一套语体，但更偏原理与设计。
  Use for: 比对同一概念的两种英文写法，练「同义不同句」。

- [Spring Framework Wiki（What's New / Upgrade Notes）](https://github.com/spring-projects/spring-framework/wiki)
  版本升级与行为变更说明。
  Use for: 行为变更语体，`no longer` / `instead` 这类转折句。

- [OpenJDK JEP 索引](https://openjdk.org/jeps/0)
  每份 JEP 都有 `History` 段，用过去时串起一个特性的演进
  （如 JEP 543：`was first delivered as` / `It became` / `It re-previewed`）。
  Use for: 过去时连用、技术决策语体。

#### Lesson 1 已用语料（保留）

第 1 课第 08 节的四句取自下面两处。Gradle 是 Spring Boot 官方支持的构建工具，
这四句仍属本技术栈，保留不改；新增课程优先从上面的 Spring / OpenJDK 来源取句。

- [Gradle 8.10 Release Notes](https://docs.gradle.org/8.10/release-notes.html)
  官方版本说明。Build authoring improvements 与 Promoted features 两小节含大量过去时与过去进行时句子，
  且常在一句里并存三种时态（`are` / `were incubating` / `are now supported`）。
  Use for: 过去时被动、过去进行时的真实例句。

- [Gradle User Guide · Troubleshooting builds](https://docs.gradle.org/current/userguide/troubleshooting.html)
  官方故障排查文档。**第 1 课首选精读源**——问题描述 + 已发生的事 + 下一步建议，时态切换密集，
  结构正是学习者未来最常读的那类文本。`Getting additional help` 与
  `Troubleshooting daemon connection issues` 两小节已用于第 08 节。
  Use for: 报错语体、情态动词过去式、`did not + 原形` 的真实用例。

#### Lesson 2 已用语料

第 2 课第 08 节的四句同出一页，覆盖一般现在时、现在进行时、现在进行时被动、
一般现在时被动四种骨架：

- [Spring Boot Reference · SpringApplication](https://docs.spring.io/spring-boot/reference/features/spring-application.html)
  官方参考文档。本课用到其中四节：
  `SpringApplication`（`provides a convenient way to bootstrap`）、
  `Application Availability`（`If you are using ... these states are exposed as health endpoint groups`）、
  `Liveness State`（`tells whether its internal state allows it to work correctly`）、
  `Readiness State`（`while CommandLineRunner and ApplicationRunner components are being processed`）。
  Use for: 一般现在时陈述定义、现在进行时被动、一般现在时被动。

> 注意：技术栈为 Spring Boot / Spring Framework / OpenJDK（见 `MISSION.md`）。
> 若将来换栈，整组替换已产出课程的桥接句，不要只改个别句子。

## Skills

- [课程总目录](index.html)
  所有课程与速查的唯一入口。纯静态，桌面双击或手机经静态服务器访问均可。
- [Lesson 1 · A Private Conversation](lessons/0001-a-private-conversation.html)
  交互式课程本体。纯静态、无构建、无外部依赖，`file://` 直接打开即可练习。
- [Lesson 2 · Breakfast or Lunch](lessons/0002-breakfast-or-lunch.html)
  交互式课程本体，练「一般现在时 vs 现在进行时」。
- [Lesson 2 课文全文批注](reference/lesson-02-text.html)
  Lesson 2 的完整批注手册，含 18 句逐句注释、生词与搭配、文化注释、背诵方法。
- [AI 提示词库](reference/ai-prompts.html)
  考官 / 批改员 / 陪练三个角色的提示词，含每课专用版本。复制到任意 AI 对话即可用，
  课程本身不调用任何 AI 接口。
- [已学骨架总表](reference/review.html)
  间隔复习的唯一入口，含 16 个骨架、6 条生活句型与 2 / 4 / 8 / 16 天复习节奏，随课程累积更新。

## Wisdom (Communities)

- [英语家园 · 新概念交流版块](https://www.enfamily.cn/forum-30-81.html)
  老牌新概念学习论坛，长期沉淀录音、文本、背诵经验与方法汇总。
  Use for: 背诵方法、学习计划、疑难句式讨论。

## Gaps

- 未找到稳定可访问的「第二册逐课官方语法点清单」，暂以教材每课 Key Structures 为准。
