# oxygen-notes

《缺氧》（Oxygen Not Included）建造模块笔记系统。记录游玩过程中喜欢的各种模块的建造方法、注意事项、投入产出数据，方便随时查阅更新。

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
| `source` | string | 参考来源链接（可选，如语雀 / 论坛方案原文） |
| `specs` | array | 关键参数表：`key` + `value`，如尺寸、供应人数、温度阈值等 |
| `materials` | array | 所需建筑清单：建筑名 + 数量 + 建议材料（数量可为数字或"按布局"） |
| `layout` | string | 建造布局描述（文字 + 示意图） |
| `pipes_wiring` | string | 管道、水门、走线说明 |
| `automation` | string | 自动化逻辑描述 |
| `screenshots` | array | 示意图（存放在 `screenshots/` 目录）。可写文件名字符串，或 `{ "file": "x.jpeg", "desc": "整体布局图" }` 对象；页面内点击可放大查看细节 |
| `inputs_per_cycle` | array | 每周期资源消耗：资源名 + 消耗量 |
| `outputs_per_cycle` | array | 每周期资源产出：资源名 + 产出量 |
| `notes` | array | 注意事项、避坑点（每条一个字符串） |
| `dlc` | string | 适用 DLC |
| `updated` | string | 最后更新日期 YYYY-MM-DD |

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

## 截图存放

游戏截图放入 `screenshots/` 目录，文件名建议 `<模块id>-<序号>.png`，在 JSON 的 `screenshots` 字段填入文件名即可。
