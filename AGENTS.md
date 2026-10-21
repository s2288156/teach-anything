# teach-anything

个人学习仓库：一个学习方向一个目录，目录内自带 `AGENTS.md` 描述该方向。

## 组织约定

- 一个目录 = 一个学习方向；目录内应有 `AGENTS.md`，由它描述该方向的方向、框架与细节。
  允许先有内容、后补 `AGENTS.md`；补上之前，须在目录路由的「一句话说明」里注明待补。
- 目录名用英文小写 dash-case（例：`nce-english`、`java-gradle`）。
- 目录内部放哪些文件、子 `AGENTS.md` 写哪几段，由该方向自行决定，本文件不做全局规定。

## 目录路由

读某个学习方向前，先看下表定位目录，再进入该目录读它的 `AGENTS.md`。

| 学习方向 | 目录 | 状态 | 一句话说明 |
| --- | --- | --- | --- |
| 新概念英语 | `nce-english` | 进行中 | 第二册课文当语料练句子骨架，桥接 Spring Boot / OpenJDK 技术英语 |

## 站点发布

- 线上入口 `https://s2288156.github.io/teach-anything/`，根 `index.html` 是总目录。
- [.github/workflows/pages.yml](.github/workflows/pages.yml) 只发布根 `index.html` 与各课程目录。新增课程时，根页加一行链接，并在 `Stage site` 步骤追加 `cp -r <课程目录> _site/<课程目录>`。
- 改仓库可见性、启用 Pages、重跑 workflow 需在 GitHub 网页操作；当前 CLI 是集成 token，无仓库管理权限。
