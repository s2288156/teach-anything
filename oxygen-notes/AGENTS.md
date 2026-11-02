# oxygen-notes

《缺氧》（Oxygen Not Included）建造模块笔记系统。记录游玩过程中喜欢的各种模块的建造方法、注意事项、投入产出数据，方便随时查阅更新。

## 页面架构

```text
index.html              总入口：分类筛选 + 模块卡片，点击卡片跳转独立模块页
modules/<id>.html       每个模块一个独立页面（骨架固定，内容由 module.js 渲染）
data/modules.js         唯一数据源
assets/style.css        共享样式
assets/app.js           入口页：渲染卡片网格、模块 id 对照表
assets/id-copy.js       共享：模块 id 复制（列表卡片 + 详情页头部）
assets/module.js        模块页：两种内容模式（分节文字 / 图片索引）+ 左侧导航 + 锚点滚动 + 图片缩放
screenshots/            示意图
```

模块页布局：左侧固定导航（按内容模式显示章节或图片索引，加来源链接），右侧纵向排列各条目。图片点击后进入全屏查看器，支持滚轮缩放和拖动平移，便于查看管道、电线、液门等细节。

新增模块时，除了在 `modules.js` 加数据，还需要复制一份 `modules/<id>.html`（复制现有任意模块页，改 `data-module-id` 即可，页面主体由 JS 渲染）。

## 详情页内容模式

- 默认（不设 `layoutMode`）：左侧按固定章节导航，正文依次是概览、关键参数、建造布局、管道、自动化、投入产出、注意事项、示意图。
- `layoutMode: "image-index"`：以图为主。正文不再按主题分节写文字，每张图一个条目（编号 + 标题 + 图 + 一到两句说明），左侧导航按图片条目加「投入产出」「建筑材料要求」组织；纯文字只保留这两块。
- 图片说明要写清「这张图在看什么、关键点是什么」，不要复述图上已经明示的参数；没有对应图片的主题并入相邻图片说明，或极简一两句带过，不要为了凑结构硬开一节。
- 样板：`modules/bristle-sleet-wheat-sludge.html`。新增模块若截图已能覆盖布局、管线与自动化，优先采用图片索引模式。

## 模块 id 与维护规则

`index.html` 上的每张模块卡片都带一个稳定 id，卡片底部显示 id 并提供「复制」按钮；模块详情页头部（标题与 meta 下方）显示同一 id 与复制按钮。复制交互由 `assets/id-copy.js` 提供，两类页面共用同一实现。页面顶部的「模块 ID 对照表」由 `data/modules.js` 自动生成，不手工维护。

- id 直接复用 `data/modules.js` 中模块的 `id` 字段，同时也是 `modules/<id>.html` 的文件名，全站只保留这一套命名。
- 命名规范：小写 kebab-case，`<功能或设备>-<形态或方案>`，例如 `electrolyzer-high-pressure`；语义清晰、可读、可口头传达，禁止序号式命名（`module-1`、`m01`）。
- 新增模块必须分配全新 id，禁止复用已删除模块的 id。
- 已发布的 id 永久不变：改标题、换方案、重排章节都不改 id。
- 模块合并或拆分时不得静默改名：合并要保留旧 id 作为跳转锚点（指向新模块页），拆分则新旧 id 并存，并在对照表中注明。
- 页面结构锚点（`page-header`、`category-filter`、`card-grid`、`page-footer`、`module-id-index`）同样保持稳定。
- 需要助手定位模块时，复制卡片或详情页头部的 id 发过去即可：id 对应 `data/modules.js` 的模块对象与 `modules/<id>.html` 页面。
- 新增模块必须同时覆盖列表卡片与详情页：列表卡片由 `app.js` 自动渲染；详情页复制骨架页后引入 `id-copy.js` 与 `module.js`，头部 id 由页面 `data-module-id`（缺省时取文件名）解析，并经 `modules.js` 校验后渲染，不需要手写 id。

## 数据结构

所有模块数据存放在 `data/modules.js`（以 `window.ONI_DATA = { ... }` 形式包裹 JSON 数据），页面通过 `<script>` 标签加载后动态渲染。**新增/更新模块 = 编辑该文件 → 保存刷新**。

> 为什么不用 `.json`：浏览器在 `file://` 协议下会阻止 `fetch()` 读取本地 JSON，导致本地双击打开页面时数据加载失败。改用 `.js` 数据文件后，本地双击和线上 GitHub Pages 都能正常加载。

### modules.js 字段说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 唯一标识，kebab-case |
| `name` | string | 模块中文名 |
| `category` | string | 所属功能分类（见下方分类表） |
| `phase` | string | 推荐游戏阶段（早期/中期/晚期） |
| `difficulty` | number | 搭建难度 1-5 |
| `layoutMode` | string | 详情页内容模式；设 `image-index` 时以图为主（可选，缺省为分节文字模式） |
| `source` | string | 参考来源链接（可选，如语雀 / 论坛方案原文） |
| `specs` | array | 关键参数表：`key` + `value`，如尺寸、供应人数、温度阈值等 |
| `materials` | array | 所需建筑清单：建筑名 + 数量 + 建议材料（数量可为数字或"按布局"） |
| `materials_note` | string | 建筑材料的额外约束（如禁用材料），可选；图片索引模式显示在「建筑材料要求」末尾 |
| `layout` | string | 建造布局描述（文字 + 示意图） |
| `pipes_wiring` | string | 管道、水门、走线说明 |
| `automation` | string | 自动化逻辑描述 |
| `screenshots` | array | 示意图（存放在 `screenshots/` 目录）。可写文件名字符串，或对象：`{ "file", "title", "desc", "view", "note", "shows" }`。`title` 是图片索引条目标题，`view` 是视图类型标签（如"全景视图"），`note` 是图片索引模式下的说明（一到两句），`shows` 是这张图能看到的内容标签（如"液体管道""电线""液门"） |
| `imageCredit` | string | 图片来源与版权说明（可选）。引用他人的图时必须填写，会在示意图下方显示 |
| `inputs_per_cycle` | array | 每周期资源消耗：资源名 + 消耗量 |
| `outputs_per_cycle` | array | 每周期资源产出：资源名 + 产出量 |
| `notes` | array | 注意事项、避坑点（每条一个字符串） |
| `dlc` | string | 适用 DLC |
| `updated` | string | 最后更新日期 YYYY-MM-DD |

`specs`、`layout`、`pipes_wiring`、`automation`、`notes` 只在默认模式下渲染；`layoutMode: "image-index"` 时这些内容要改写进每张图的 `note` 与 `materials_note`，不要保留与图片重复的纯文字。

## 功能分类

| id | 分类名 | 说明 |
| --- | --- | --- |
| `oxygen` | 氧气系统 | 制氧、储氧、高压氧 |
| `power` | 电力系统 | 发电、输电、变压器配置 |
| `farming` | 农业/食物 | 种植、养殖、食物加工 |
| `industry` | 工业/制造 | 炼钢、玻璃、陶瓷、精炼 |
| `energy` | 能源/燃料 | 原油、石油、天然气处理 |
| `temperature` | 温控系统 | 降温、加热、温度缓冲 |
| `storage` | 高压存储 | 高压液库、高压水库 |
| `habitat` | 生活区 | 卧室、浴室、医疗 |
| `recreation` | 娱乐区 | 娱乐建筑、士气管理 |
| `rocket` | 火箭模块 | 火箭建造、发射、载荷 |
| `geothermal` | 地热开发 | 泉水、火山开发利用 |

## 更新流程

```text
1. 打开 data/modules.js
2. 找到对应模块 → 编辑字段，或追加新模块（注意 JSON 逗号语法）
3. 本地刷新页面确认效果
4. git commit -m "notes: 更新/添加 XXX 模块"
5. git push
6. GitHub Pages 自动刷新
```

## 本地草稿区

`temp/` 是本地草稿区，用来放截图、参考笔记等临时资料，只用于给助手补充上下文。该目录已在根 `.gitignore` 中排除，不提交、不纳入版本控制，Pages 发布时也会剔除。

## 截图存放

游戏截图放入 `screenshots/` 目录，文件名建议 `<模块id>-<序号>.png`，在 JSON 的 `screenshots` 字段填入文件名即可。图片索引模式还要给每张图补 `title` 与 `note`，否则导航只能用 `desc` 兜底。
