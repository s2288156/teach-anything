// oxygen-notes · 模块数据（双击本地 HTML 也能加载，不受 file:// CORS 限制）
// 编辑说明：直接改下面对象里的内容，保存后刷新页面即可看到效果。

window.ONI_DATA = {
  "categories": [
    { "id": "oxygen", "name": "氧气系统" },
    { "id": "power", "name": "电力系统" },
    { "id": "farming", "name": "农业/食物" },
    { "id": "industry", "name": "工业/制造" },
    { "id": "energy", "name": "能源/燃料" },
    { "id": "temperature", "name": "温控系统" },
    { "id": "storage", "name": "高压存储" },
    { "id": "habitat", "name": "生活区" },
    { "id": "recreation", "name": "娱乐区" },
    { "id": "rocket", "name": "火箭模块" },
    { "id": "geothermal", "name": "地热开发" }
  ],
  "modules": [
    {
      "id": "electrolyzer-high-pressure",
      "name": "电解水高压制氧",
      "category": "oxygen",
      "phase": "中期",
      "difficulty": 3,
      "materials": [
        { "building": "电解器", "count": 2, "material": "钻石（耐高温）/ 花岗岩" },
        { "building": "气泵", "count": 4, "material": "塑料" },
        { "building": "氧气散布器", "count": 2, "material": "玻璃" },
        { "building": "液泵", "count": 1, "material": "塑料" }
      ],
      "layout": "电解器置于高压室底部，氢气口朝上通氢气室，氧气口朝下通氧气室。两个气泵分别抽氢气和氧气，氧气散布器放在房间顶部。",
      "pipes_wiring": "液泵从主水管抽水到电解器进水口。氢气出气口向上接气泵→高压储氢罐；氧气出气口向下接气泵→高压储氧罐。电路串联变压器，总负载不超过变压器额定功率。",
      "automation": "氢气室压力超过阈值（如 2kg）时关闭氢气气泵；氧气室压力超过阈值时关闭氧气气泵。自动化信号线从压力传感器接气泵输入端。",
      "screenshots": [],
      "inputs_per_cycle": [
        { "resource": "水", "amount": "约 10 kg/s（2 台电解器）" },
        { "resource": "电力", "amount": "4 kW（2 台电解器）+ 气泵耗电" }
      ],
      "outputs_per_cycle": [
        { "resource": "氧气", "amount": "约 888 g/s（2 台合计）" },
        { "resource": "氢气", "amount": "约 111 g/s（2 台合计）" }
      ],
      "notes": [
        "电解器重启后出气口位置会乱序，必须重新交换管道",
        "高压制氧室压力超过 2kg 时氧气散布器会被压爆",
        "用钻石做电解器能扛更高温度，适合靠近热源的布局",
        "电解器不能接触液体，进水口朝上安装"
      ],
      "dlc": "基础版 + 太空行业",
      "updated": "2026-11-02"
    },
    {
      "id": "bristle-sleet-wheat-sludge",
      "name": "毛刺花+冰霜小麦（浆果糕）",
      "category": "farming",
      "phase": "中期",
      "difficulty": 4,
      "source": "https://www.yuque.com/u25332524/ftq4u7/ztbrcd",
      "specs": [
        { "key": "模块尺寸", "value": "21×11（231 格），上下互为镜像" },
        { "key": "供应人数", "value": "8 人" },
        { "key": "作物配置", "value": "毛刺花 12 株 + 冰霜小麦 10 株" },
        { "key": "灌溉水温", "value": "≥ 5°C（低于 5°C 毛刺花停止生长，控热不控冷）" },
        { "key": "已验证工况", "value": "灌溉水温 99°C + 泥土温度 85°C 正常运行" },
        { "key": "温控阈值", "value": "低于 12°C / 高于 -5°C" },
        { "key": "过滤门延时", "value": "5 秒" },
        { "key": "铺油", "value": "50 kg/格，每格留一滴油" },
        { "key": "房间气体", "value": "氧气或二氧化碳 2 kg/格" },
        { "key": "倒水", "value": "400 kg" },
        { "key": "蒸汽室", "value": "必须抽真空" },
        { "key": "泥土", "value": "1000 kg，箱子每格装 5 kg" }
      ],
      "materials": [
        { "building": "液温调节器", "count": 2, "material": "钢" },
        { "building": "机械气闸", "count": 2, "material": "钢 / 铜矿 / 铁矿 / 钴矿 / 铝矿（禁用金汞齐）" },
        { "building": "普通砖块", "count": "按布局", "material": "花岗岩（禁用铅 / 汞 / 贫铀）" },
        { "building": "变温板", "count": "按布局", "material": "花岗岩（必须贴满）" },
        { "building": "电线 / 信号线", "count": "按布局", "material": "可用铅" },
        { "building": "高负荷电线（粗线）", "count": "按布局", "material": "高负荷电线 / 高负荷导线" }
      ],
      "layout": "21×11 矩形，上下两半互为镜像，组成一套 8 人份浆果糕生产线。左、右各有一个入水口，只能选一侧通水灌溉，禁止左右同时灌水。蒸汽室内部必须抽真空，变温板贴满墙面。具体建筑位置与管线走向以来源文档的标注图为准。",
      "pipes_wiring": "左右入水口二选一。液温调节器（钢造）负责维持灌溉水温不低于 5°C。铺油 50 kg/格并每格留一滴油作为液体锁，房间充氧气或二氧化碳至 2 kg/格，倒水 400 kg 建立水封。过滤门延时设为 5 秒。",
      "automation": "按来源文档标注：温度低于 12°C / 高于 -5°C 触发对应控制；过滤门延时 5 秒。机械气闸造好后先手动关闭一次，并让两个箱子的优先级一侧高于另一侧（详见注意事项）。具体信号接线以来源图为准。",
      "screenshots": [],
      "inputs_per_cycle": [
        { "resource": "水", "amount": "440 kg（毛刺花 12×20 + 冰霜小麦 10×20）" },
        { "resource": "泥土", "amount": "50 kg（冰霜小麦 10×5）" },
        { "resource": "电力", "amount": "液温调节器 + 微生物搅拌机（制浆果糕）" }
      ],
      "outputs_per_cycle": [
        { "resource": "浆果糕", "amount": "2 份 = 8000 kcal（8 人份，永不变质）" },
        { "resource": "净增热量", "amount": "每份净增 2400 kcal（4000 - 1600 浆果）" }
      ],
      "notes": [
        "控热不控冷：灌溉水温低于 5°C 毛刺花会停止生长，所以灌溉水温不要低于 5°C",
        "已在灌溉水温 99°C、泥土温度 85°C 条件下测试通过，不怕热水",
        "左右两处入水口只能选一个方向灌水，不能左右同时灌",
        "蒸汽室一定要抽真空，否则温控失效",
        "机械气闸造好后先手动关闭一次，避免气闸内有气体",
        "两个箱子优先级：一个比左侧箱子高，一个比右侧箱子低",
        "变温板必须贴满，可用花岗岩造",
        "所有砖块 / 建筑 / 管道不要用铅、汞、贫铀（蒸汽机除外，可用铅）",
        "机械气闸不要用金汞齐",
        "毛刺花需要光照，冰霜小麦不需要；毛刺花会散发花香病菌，过敏小人应禁止进入"
      ],
      "dlc": "基础版",
      "updated": "2026-11-02"
    },
    {
      "id": "gecko-farming",
      "name": "壁虎养殖模块",
      "category": "farming",
      "phase": "中期",
      "difficulty": 2,
      "materials": [
        { "building": "养殖盒", "count": 4, "material": "花岗岩/塑料" }
      ],
      "layout": "养殖盒放在生活区附近，温度控制在 20-30°C。每盒 1 只壁虎，提供充足氧气。",
      "pipes_wiring": "无需管道。养殖盒自动产出生肉和壁虎蛋。",
      "automation": "可选用孵蛋器自动化孵化。",
      "screenshots": [],
      "inputs_per_cycle": [
        { "resource": "电力", "amount": "微量（养殖盒本身耗电）" }
      ],
      "outputs_per_cycle": [
        { "resource": "生肉", "amount": "每只壁虎周期产约 2 kg" },
        { "resource": "壁虎蛋", "amount": "约 1 个/周期" }
      ],
      "notes": [
        "壁虎寿命较长，死亡频率低",
        "生肉烹饪后做成烤肉串，营养密度高",
        "壁虎蛋可直接吃或孵化新壁虎"
      ],
      "dlc": "基础版",
      "updated": "2026-11-02"
    },
    {
      "id": "oil-reservoir-drilling",
      "name": "储油石开发",
      "category": "energy",
      "phase": "中期",
      "difficulty": 3,
      "materials": [
        { "building": "储油石钻探器", "count": 1, "material": "金属矿石" },
        { "building": "液泵", "count": 2, "material": "塑料/镍合金" },
        { "building": "变压器", "count": 1, "material": "精炼金属" }
      ],
      "layout": "钻探器直接放在储油石上方一格。原油出口接液泵→炼油模块或高压储油罐。",
      "pipes_wiring": "钻探器原油出口向下接液泵，液泵出油口接主管道到炼油厂或高压库。电路直接接主电网，注意钻探器耗电 2kW。",
      "automation": "可选用油位传感器，原油储量低于阈值时开启钻探器。",
      "screenshots": [],
      "inputs_per_cycle": [
        { "resource": "电力", "amount": "2 kW（钻探器）" }
      ],
      "outputs_per_cycle": [
        { "resource": "原油", "amount": "每储油石储量有限，持续开采" }
      ],
      "notes": [
        "储油石是不可再生资源，采完就没了",
        "钻探器钻头磨损快，建议定期更换",
        "储油石周围通常有蒸汽/热水，注意温度影响"
      ],
      "dlc": "基础版",
      "updated": "2026-11-02"
    },
    {
      "id": "steel-production",
      "name": "炼钢模块",
      "category": "industry",
      "phase": "中期",
      "difficulty": 3,
      "materials": [
        { "building": "金属精炼器", "count": 2, "material": "黑曜石/耐火材料" },
        { "building": "气体分离器", "count": 1, "material": "金属矿石" }
      ],
      "layout": "精炼器并排摆放，气体分离器在侧方。周围留操作空间给小人运送矿料。高温区单独规划，远离有机物。",
      "pipes_wiring": "铁矿石/精炼金属通过滑轨或人工运送至精炼器。精炼器产出钢和二氧化碳，二氧化碳通过管道导出到处理系统。",
      "automation": "可用自动化传感器控制精炼器开关，避免空转浪费电力。",
      "screenshots": [],
      "inputs_per_cycle": [
        { "resource": "精炼金属（铁矿）", "amount": "每 100kg 钢需约 200kg 精炼金属" },
        { "resource": "电力", "amount": "精炼器耗电较高，注意变压器配置" }
      ],
      "outputs_per_cycle": [
        { "resource": "钢", "amount": "按配方计算产出" },
        { "resource": "二氧化碳", "amount": "副产物，需处理" }
      ],
      "notes": [
        "炼钢会大量产二氧化碳，需配套污水处理/气体处理模块",
        "高温环境，附近建筑要用耐高温材料",
        "钢是中后期核心材料，建议集中规划炼钢厂"
      ],
      "dlc": "基础版",
      "updated": "2026-11-02"
    },
    {
      "id": "petroleum-refining",
      "name": "炼油模块",
      "category": "energy",
      "phase": "中期",
      "difficulty": 3,
      "materials": [
        { "building": "精炼器（原油转石油）", "count": 1, "material": "耐火材料" },
        { "building": "液泵", "count": 2, "material": "镍合金（耐原油腐蚀）" },
        { "building": "变压器", "count": 1, "material": "精炼金属" }
      ],
      "layout": "炼油器靠近储油石开发模块，减少管道距离。原油入口在上，石油出口在侧边。",
      "pipes_wiring": "原油从储油石经液泵→炼油器入口；石油出口经液泵→高压储油库或直接接石油发电机。气体副产物（天然气/二氧化碳）导出处理。",
      "automation": "石油发电机发电量阈值联动炼油器，电量充足时暂停炼油节省资源。",
      "screenshots": [],
      "inputs_per_cycle": [
        { "resource": "原油", "amount": "按炼油器规格计算" },
        { "resource": "电力", "amount": "炼油器耗电 + 液泵耗电" }
      ],
      "outputs_per_cycle": [
        { "resource": "精炼石油", "amount": "按转化率计算（约 80-90% 转化效率）" },
        { "resource": "天然气", "amount": "副产物，可接天然气发电机" },
        { "resource": "二氧化碳", "amount": "副产物，需处理" }
      ],
      "notes": [
        "原油有腐蚀性，管道用镍合金做的泵",
        "天然气副产物不要浪费，直接接发电机",
        "炼油器温度高，远离生活区和有机物"
      ],
      "dlc": "基础版",
      "updated": "2026-11-02"
    }
  ]
};
