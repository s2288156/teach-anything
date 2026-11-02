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
      "layoutMode": "image-index",
      "source": "https://www.yuque.com/u25332524/ftq4u7/ztbrcd",
      "materials": [
        { "building": "液温调节器", "count": 2, "material": "钢" },
        { "building": "机械气闸", "count": 2, "material": "钢 / 铜矿 / 铁矿 / 钴矿 / 铝矿（禁用金汞齐）" },
        { "building": "普通砖块", "count": "按布局", "material": "花岗岩（禁用铅 / 汞 / 贫铀）" },
        { "building": "变温板", "count": "按布局", "material": "花岗岩（必须贴满）" },
        { "building": "电线 / 信号线", "count": "按布局", "material": "可用铅" },
        { "building": "高负荷电线（粗线）", "count": "按布局", "material": "高负荷电线 / 高负荷导线" }
      ],
      "materials_note": "所有砖块、管道与建筑不要用铅、汞、贫铀（蒸汽机除外，可用铅）；机械气闸禁用金汞齐。",
      "screenshots": [
        {
          "file": "bristle-sleet-01.jpeg",
          "title": "全景 · 上下镜像布局",
          "desc": "彩色全景图（上下互为镜像）",
          "view": "全景视图 · 游戏内实际画面",
          "note": "上半与下半以中间走道为镜像，共用一套 8 人份浆果糕产线。每半各有毛刺花与冰霜小麦一排，整模块共 12 株毛刺花 + 10 株冰霜小麦；毛刺花需要光照并散发花香病菌，过敏小人不要进作物区。",
          "shows": ["建筑位置与尺寸", "液体管道", "气体管道", "电线", "自动化线", "液门 / 水封", "房间气体"]
        },
        {
          "file": "bristle-sleet-02.jpeg",
          "title": "温度视图 · 尺寸与蒸汽室",
          "desc": "温度视图 + 尺寸标注（21×11 / 231 格）",
          "view": "温度视图",
          "note": "标注确认模块为 21×11、共 231 格。左下与右上的液温调节器腔室就是蒸汽室，内部必须抽真空，否则温控失效。控热不控冷：灌溉水温不要低于 5°C；实测 99°C 热水、85°C 泥土仍可正常运行。",
          "shows": ["温度分布", "模块尺寸标注", "蒸汽室位置"]
        },
        {
          "file": "bristle-sleet-03.jpeg",
          "title": "管道 · 左右入水口二选一",
          "desc": "液体 + 气体管道走向",
          "view": "管道视图",
          "note": "彩色管线是液体与气体管道，底部主线分别接左右两个入水口。每个镜像半区只能选一侧通水灌溉，左右同时灌会破坏水封；气体管道沿作物区上方走，位置照图。",
          "shows": ["液体管道", "气体管道", "左右入水口只能选一侧灌溉"]
        },
        {
          "file": "bristle-sleet-04.jpeg",
          "title": "自动化 · 双温度传感器 + 过滤门",
          "desc": "自动化：温度传感器 + 过滤门",
          "view": "自动化视图",
          "note": "作物区温度传感器设为低于 12°C，蒸汽室一侧设为高于 -5°C，两路信号都经过滤门延时 5 秒再控制液温调节器。传感器与信号线位置按图，上下两半各一套。",
          "shows": ["温度传感器", "过滤门 5 秒", "温控阈值 高于 -5℃ / 低于 12℃"]
        },
        {
          "file": "bristle-sleet-05.jpeg",
          "title": "电力 · 主线与变压器",
          "desc": "电线布局与各建筑功率",
          "view": "电力视图",
          "note": "电线从底部主线接入后向上分支，每个负载前都串 1200W 变压器；图中绿色数字是设备端功率标注（如 4850W / 4000W），按图核对负载不要超过变压器额定。上下两半镜像走线。",
          "shows": ["电线走向", "建筑功率标注", "变压器位置"]
        },
        {
          "file": "bristle-sleet-06.jpeg",
          "title": "液体 · 铺油与水封",
          "desc": "液门 / 水封：铺油 50 kg/格 + 一滴油",
          "view": "液体视图",
          "note": "紫色区域是铺油 50 kg/格，每格还要留一滴油形成液体锁；蓝色是蒸汽室倒水 400 kg。油层把作物区与蒸汽室隔开，铺油不足或油滴被冲掉会漏气。",
          "shows": ["铺油 50 kg/格", "每格留一滴油", "水封位置"]
        },
        {
          "file": "bristle-sleet-07.jpeg",
          "title": "气体 · 作物区充气与蒸汽室真空",
          "desc": "房间气体：真空 / 氧气或二氧化碳 2 kg/格",
          "view": "气体视图",
          "note": "作物区充氧气或二氧化碳到 2 kg/格（黄框）；蒸汽室及相邻夹层必须抽真空（绿框），否则热量会漏进作物区、温控失效。两半分别充气，不要互相串气。",
          "shows": ["房间气体类型", "气体量 2 kg/格", "真空区域", "蒸汽室倒水 400 kg"]
        },
        {
          "file": "bristle-sleet-08.jpeg",
          "title": "运输 · 毛刺浆果与冰霜小麦送出",
          "desc": "固体运输管道：毛刺浆果 + 冰霜小麦送出",
          "view": "运输视图",
          "note": "作物区上方的装载器把毛刺浆果和冰霜小麦经固体运输管道送出，上下两半各一组，最后汇到顶部横向主管。装载器与管道位置照图，产物直接进厨房或储物区。",
          "shows": ["固体运输管道", "装载器位置", "产物送出路线"]
        },
        {
          "file": "bristle-sleet-09.jpeg",
          "title": "储物 · 泥土箱与机械气闸",
          "desc": "箱子设置、优先级、机械气闸操作",
          "view": "储物视图",
          "note": "左侧箱子装 1000 kg 泥土，优先级要比右侧箱子低；右侧箱子装 5 kg 泥土，优先级更高，保证持续补土。机械气闸造好后先手动关闭一次，排掉闸内残留气体再接入自动化。",
          "shows": ["箱子装 1000 kg 泥土", "箱子装 5 kg 泥土", "两侧优先级设置", "机械气闸先手动关闭一次"]
        },
        {
          "file": "bristle-sleet-10.jpeg",
          "title": "建筑 · 变温板贴满",
          "desc": "变温板位置（必须贴满，可用花岗岩）",
          "view": "建筑视图",
          "note": "黄框处的变温板必须贴满作物区顶部与蒸汽室墙面，用花岗岩造；漏贴一格就会形成局部热点或冷点。变温板只导热不挡气，仍要配合前面的真空与水封。",
          "shows": ["变温板位置", "花岗岩材料"]
        }
      ],
      "imageCredit": "示意图取自「大叔追云彩」的语雀文档《缺氧各种常用模块及数据大全》，版权归原作者所有，仅作个人学习记录使用。",
      "inputs_per_cycle": [
        { "resource": "水", "amount": "440 kg（毛刺花 12×20 + 冰霜小麦 10×20）" },
        { "resource": "泥土", "amount": "50 kg（冰霜小麦 10×5）" },
        { "resource": "电力", "amount": "液温调节器 + 微生物搅拌机（制浆果糕）" }
      ],
      "outputs_per_cycle": [
        { "resource": "浆果糕", "amount": "2 份 = 8000 kcal（8 人份，永不变质）" },
        { "resource": "净增热量", "amount": "每份净增 2400 kcal（4000 - 1600 浆果）" }
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
