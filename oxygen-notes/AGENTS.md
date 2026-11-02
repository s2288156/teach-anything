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

### 默认采用图片索引

新建模块页默认写 `layoutMode: "image-index"`，正文按图组织，不再按主题分节写文字。未设置该字段的旧模块继续按分节文字模式渲染，不需要回改。

分节文字模式只在以下情况使用，并要在提交说明里写明原因：

- 模块没有任何可用截图；
- 截图数量或视角不足以覆盖布局、管道、液门、走线、自动化中的关键部分。

只要截图能说明建造方式，就不允许退回分节文字模式。

### 图片索引条目结构

每张截图对应一个条目，固定为「编号 + 标题 + 图 + 说明」：

1. 编号：按 `01`、`02` 顺序自动生成，与 `screenshots` 数组顺序一致。
2. 标题：写在 `screenshots[].title`，概括这张图看的是什么，例如「全景 · 上下镜像布局」「管道 · 左右入水口二选一」。
3. 图：写在 `screenshots[].file`，点击可放大查看。
4. 说明：写在 `screenshots[].note`，一到两句，讲清「这张图在看什么、关键点是什么、为什么这样做」。

说明只补充图上读不出的判断依据和取舍，不得复述图里已经明示的参数、位置或颜色；不得编造图中没有的布局、数值或设备。

### 纯文字章节范围

图片索引模式只保留两块纯文字章节，章节 id 固定为 `io` 与 `materials`：

- **投入产出**：输入 / 输出资源，必须写清速率或周期口径。
- **建筑材料要求**：建筑清单与数量门槛，跨模块的禁用材料写在 `materials_note`。

不得新增建造布局、管道、液门、走线、自动化、注意事项等与图片重复的章节。避坑点并入对应图片的 `note`，材料限制并入 `materials_note`。

### 缺图处理

某个主题没有对应图片时，不要为了凑结构新开一节：并入相邻图片的说明，或用一两句话极简带过。禁止用文字把已有图片的内容再讲一遍。

### 页内导航

图片索引模式的左侧导航由渲染层自动生成，不手工维护：

- 图片条目按编号 + `title` 生成，锚点为 `#shot-0`、`#shot-1`……
- 两块文字章节固定为「投入产出」（`#io`）与「建筑材料要求」（`#materials`）。

导航顺序、文字与正文锚点必须一致，不得出现指向不存在条目的链接。

### 数据与渲染约定

- 模式开关写在模块对象：`layoutMode: "image-index"`。
- 图片条目写在数据源：`screenshots[].file`、`screenshots[].title`、`screenshots[].note`；可选 `view`（视图类型标签）与 `shows`（图上可见内容标签）。
- 材料限制写在 `materials_note`；投入产出写在 `inputs_per_cycle` / `outputs_per_cycle`。
- 渲染层 `assets/module.js` 按 `layoutMode` 分支；禁止在 `modules/<id>.html` 或 JS 里硬编码标题、说明、导航项。
- 引用他人的图必须在 `imageCredit` 标注来源与版权。

### 保留不变项

以下约定与页面模式无关，继续有效：

- 详情页头部保留模块 id 与「复制」按钮，位置在标题与 meta 下方。
- 模块 id 直接复用 `data/modules.js` 的 `id`，同时是 `modules/<id>.html` 文件名；已发布的 id 永久不变。
- 列表卡片与详情页头部共用 `assets/id-copy.js` 的复制实现，不各页复制粘贴。
- id 命名与合并 / 拆分规则见下方「模块 id 与维护规则」。

### 新增模块自检清单

提交前逐条勾选，任一项不满足就不得合并：

- [ ] `id` 为新的小写 kebab-case，且与 `modules/<id>.html` 文件名、`data/modules.js` 中的 `id` 一致。
- [ ] 已写 `layoutMode: "image-index"`；若用分节文字模式，提交说明里有明确原因。
- [ ] 每张图都有 `file`、`title`、`note`，说明为一到两句，且没有复述图上已明示的信息。
- [ ] 正文只有「投入产出」与「建筑材料要求」两块文字，没有建造布局、管道、自动化、注意事项等重复章节。
- [ ] 投入产出写清速率或周期；建筑材料写清数量与材料，禁用材料写在 `materials_note`。
- [ ] 左侧导航按图片条目 + 两块文字自动生成，所有锚点可跳转且与正文一致。
- [ ] 详情页头部显示模块 id 与复制按钮，复制成功、失败回退均正常。
- [ ] 本地逐页检查控制台无报错；390px 窄屏无横向溢出，图片与说明一一对应。
- [ ] 引用他人图片时 `imageCredit` 已标注来源。
- [ ] `npm run lint` 通过。

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
| `layoutMode` | string | 详情页内容模式。新建模块固定写 `"image-index"`；只有确实无图可依时才省略，回退到分节文字模式 |
| `source` | string | 参考来源链接（可选，如语雀 / 论坛方案原文） |
| `specs` | array | 关键参数表：`key` + `value`；仅分节文字模式使用，图片索引模式不填 |
| `materials` | array | 所需建筑清单：建筑名 + 数量 + 建议材料（数量可为数字或"按布局"）；两种模式都用 |
| `materials_note` | string | 建筑材料的额外约束（如禁用材料），可选；图片索引模式显示在「建筑材料要求」末尾 |
| `layout` | string | 建造布局描述；仅分节文字模式使用，图片索引模式不填 |
| `pipes_wiring` | string | 管道、水门、走线说明；仅分节文字模式使用，图片索引模式不填 |
| `automation` | string | 自动化逻辑描述；仅分节文字模式使用，图片索引模式不填 |
| `screenshots` | array | 示意图（存放在 `screenshots/` 目录）。可写文件名字符串，或对象：`{ "file", "title", "desc", "view", "note", "shows" }`。图片索引模式下 `file`、`title`、`note` 必填；`view` 是视图类型标签（如"全景视图"），`shows` 是图上可见内容标签（如"液体管道""电线""液门"），`desc` 仅作备用描述 |
| `imageCredit` | string | 图片来源与版权说明（可选）。引用他人的图时必须填写，会在示意图下方显示 |
| `inputs_per_cycle` | array | 每周期资源消耗：资源名 + 消耗量 |
| `outputs_per_cycle` | array | 每周期资源产出：资源名 + 产出量 |
| `notes` | array | 注意事项、避坑点（每条一个字符串）；仅分节文字模式使用，图片索引模式不填 |
| `dlc` | string | 适用 DLC |
| `updated` | string | 最后更新日期 YYYY-MM-DD |

`specs`、`layout`、`pipes_wiring`、`automation`、`notes` 只在分节文字模式下渲染；`layoutMode: "image-index"` 时不要填写这些字段，相关内容必须改写进每张图的 `note` 与 `materials_note`。

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
3. 新增模块按「新增模块自检清单」逐条核对
4. 本地刷新页面确认效果
5. git commit -m "notes: 更新/添加 XXX 模块"
6. git push
7. GitHub Pages 自动刷新
```

## 本地草稿区

`temp/` 是本地草稿区，用来放截图、参考笔记等临时资料，只用于给助手补充上下文。该目录已在根 `.gitignore` 中排除，不提交、不纳入版本控制，Pages 发布时也会剔除。

## 截图存放

游戏截图放入 `screenshots/` 目录，文件名建议 `<模块id>-<两位序号>.png`，例如 `electrolyzer-high-pressure-01.png`。图片索引模式必须在数据里给每张图补 `title` 与 `note`，否则导航与条目说明不完整。
