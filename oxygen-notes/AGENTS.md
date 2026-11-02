# oxygen-notes

《缺氧》（Oxygen Not Included）建造模块笔记系统。记录游玩过程中喜欢的各种模块的建造方法、注意事项、投入产出数据，方便随时查阅更新。

## 数据结构

所有模块数据存放在 `data/modules.json`，页面通过 JS 动态渲染。**新增/更新模块 = 编辑 JSON → commit → push**。

### modules.json 字段说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 唯一标识，kebab-case |
| `name` | string | 模块中文名 |
| `category` | string | 所属功能分类（见下方分类表） |
| `phase` | string | 推荐游戏阶段（早期/中期/晚期） |
| `difficulty` | number | 搭建难度 1-5 |
| `materials` | array | 所需建筑清单：建筑名 + 数量 + 建议材料 |
| `layout` | string | 建造布局描述（文字 + 示意图） |
| `pipes_wiring` | string | 管道、水门、走线说明 |
| `automation` | string | 自动化逻辑描述 |
| `screenshots` | array | 截图文件名（存放在 `screenshots/` 目录） |
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
1. 打开 data/modules.json
2. 找到对应模块 → 编辑字段，或追加新模块
3. git commit -m "notes: 更新/添加 XXX 模块"
4. git push
5. GitHub Pages 自动刷新
```

## 截图存放

游戏截图放入 `screenshots/` 目录，文件名建议 `<模块id>-<序号>.png`，在 JSON 的 `screenshots` 字段填入文件名即可。
