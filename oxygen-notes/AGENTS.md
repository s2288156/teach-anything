# oxygen-notes

《缺氧》（Oxygen Not Included）建造模块笔记系统。记录游玩过程中喜欢的各种模块的建造方法、注意事项、投入产出数据，方便随时查阅更新。

## 页面架构

```text
index.html              总入口：分类筛选 + 模块卡片
modules/<id>.html       每个模块一个独立页面（骨架固定，内容由 JS 渲染）
data/modules.js         唯一数据源（window.ONI_DATA = { categories, modules }）
assets/style.css        共享样式
assets/oni-core.js      核心模块：数据校验 + shape 规范化 + 共享 util
assets/app.js           入口页：渲染卡片网格、模块 id 对照表
assets/id-copy.js       共享：模块 id 复制（列表卡片 + 详情页头部）
assets/module.js        模块页：图片索引渲染 + 左侧导航 + 锚点滚动 + 图片缩放
screenshots/            示意图
```

> 为什么不用 `.json`：浏览器在 `file://` 协议下会阻止 `fetch()` 读取本地 JSON，导致本地双击打开页面时数据加载失败。

## 模块数据结构

`assets/oni-core.js` 中的 `ONI_SCHEMA.validateAll()` 编码了本节全部规则，渲染前自动校验。

### 必填字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | kebab-case，规则见「模块 id 与维护规则」 |
| `name` | string | 模块中文名 |
| `category` | string | 功能分类（见下方分类表） |
| `phase` | string | 推荐游戏阶段（早期 / 中期 / 晚期） |
| `difficulty` | number | 搭建难度 1-5 |
| `source` | string | 参考来源链接（可选） |
| `materials` | array | 建筑清单：建筑名 + 数量 + 建议材料 |
| `materials_note` | string | 材料额外约束（如禁用材料） |
| `screenshots` | array | 示意图，见下节 |
| `imageCredit` | string | 图片来源与版权（引用他人图时必填） |
| `inputs_per_cycle` | array | 每周期资源消耗 |
| `outputs_per_cycle` | array | 每周期资源产出 |
| `dlc` | string | 适用 DLC |
| `updated` | string | 最后更新日期 YYYY-MM-DD |

### screenshots 结构

全站唯一渲染模式，每张图必须是 object shape：

```js
{
  file:   "oil-reservoir-drilling-01.jpeg",  // 必填，文件名
  title:  "全景 · 上下镜像布局",              // 必填
  note:   "…",                               // 必填，1-2 句判断依据，不复述图上已明示信息
  desc:   "",                                // 可选，备用描述
  view:   "全景视图",                         // 可选，视图类型标签
  series: "版本一",                           // 可选，同页多版本分组；有值时索引显示「版本前缀 + 版本内序号」
  shows:  ["液体管道", "气泵位置"]             // 可选，图上可见内容标签
}
```

### 禁止字段

`specs`、`layout`、`pipes_wiring`、`automation`、`notes`

相关内容改写进对应图片的 `note` 或 `materials_note`。

### 渲染规则

- 只保留两块固定章节：**投入产出**（`#io`）与 **建筑材料要求**（`#materials`）
- 不得新增建造布局、管道、自动化、注意事项等与图片重复的章节
- 左侧导航由渲染层自动生成：图片条目锚点 `#shot-0`、`#shot-1`…… + 两块文字章节，顺序与正文一致
- 同页出现多个 `series` 时，图片索引按连续 `series` 分组：顶部版本下拉跳转，组内用 `<details>` 折叠；无 `series` 的模块保持平铺

## 模块 id 与维护规则

- id 直接复用 `data/modules.js` 的 `id`，同时是 `modules/<id>.html` 文件名
- 命名规范：小写 kebab-case，`<功能或设备>-<形态或方案>`，禁止序号式命名
- 新增模块分配全新 id，禁止复用已删除模块的 id
- 已发布 id 永久不变：改标题、换方案、重排章节都不改 id
- 列表卡片与详情页头部共用 `assets/id-copy.js` 复制实现
- 需要助手定位模块时，发卡片或详情页头部的 id 即可

## 功能分类

| id | 分类名 | 说明 |
| --- | --- | --- |
| `oxygen` | 氧气系统 | 制氧、储氧、高压氧 |
| `power` | 电力系统 | 发电、输电、变压器配置 |
| `farming` | 农业/食物 | 种植、养殖、食物加工 |
| `industry` | 工业/制造 | 炼钢、玻璃、陶瓷、精炼 |
| `energy` | 能源/燃料 | 原油、石油、天然气处理、液体泉液库 |
| `habitat` | 房间 | 卧室、浴室、医疗 |
| `rocket` | 火箭模块 | 火箭建造、发射、载荷 |

## 新增模块自检清单

validator 自动覆盖的项已省略。以下人工检查：

- [ ] 投入产出写清速率或周期口径；建筑材料写清数量与材料
- [ ] 本地逐页检查控制台无报错；390px 窄屏无横向溢出
- [ ] 左侧导航所有锚点实际可跳转
- [ ] 详情页头部模块 id 复制功能正常（成功 + 失败回退）

## 更新流程

```text
1. 打开 data/modules.js
2. 找到对应模块 → 编辑字段，或追加新模块
3. 新增模块按「新增模块自检清单」逐条核对
4. 本地刷新页面确认效果
5. git commit -m "notes: 更新/添加 XXX 模块"
6. git push
7. GitHub Pages 自动刷新
```

## 截图存放与草稿区

- 截图放入 `screenshots/` 目录，文件名建议 `<模块id>-<两位序号>.jpeg`
- `temp/` 是本地草稿区（已在根 `.gitignore` 排除），放截图、参考笔记等临时资料，只用于给助手补充上下文
