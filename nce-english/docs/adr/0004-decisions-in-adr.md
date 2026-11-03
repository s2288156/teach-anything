# 决策记录改用 docs/adr/，术语仍只留在 AGENTS.md

`AGENTS.md` 的「不做什么」原本明写不建 `GLOSSARY.md` 与 `docs/adr/`，理由是术语在 AGENTS.md
术语表、决策在 `NOTES.md` / `MISSION.md`。本轮重构同时打破三条硬约束并新增一条课程系列，
决策量超出 `NOTES.md` 一行待办能承载的篇幅，故**放开 `docs/adr/`**。

`GLOSSARY.md` **仍然不建**：术语继续只在 `AGENTS.md` 术语表维护，避免两处重复而失同步。
`NOTES.md` 只留一行索引指向本目录。

## Consequences

只有同时满足「难以回退 + 无背景会让人困惑 + 真权衡」的决策才写 ADR；
日常取舍仍记在 `NOTES.md`，不要让本目录变成流水账。
