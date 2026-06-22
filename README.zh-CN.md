# Monitor Choice

显示器参数理解与选择参考工具。

**[English](README.md)**

## 功能

- **清晰度实验室**：实时 PPI/PPD 计算 + 像素级文字渲染对比（Retina vs 非 Retina，按你的实际观看距离渲染）
- **尺寸与距离**：交互式 3D 房间场景，可拖拽旋转透视投影；真实屏幕尺寸叠加 + FOV/THX/SMPTE 观看距离建议
- **色彩空间**：CIE 1931 色度图，交互式色域叠加（sRGB / DCI-P3 / Rec.2020）+ 面板色彩特性
- **场景参考**：9 个实际使用场景（办公、游戏、创作、客厅等）的参数选购指导
- **面板百科**：IPS / VA / OLED / Mini-LED 技术深度解析，含接口带宽计算器（HDMI 2.1 / DP 2.1 / USB-C）

## 运行

无需构建，无需依赖，直接打开：

```bash
# 方式一：直接打开
open index.html

# 方式二：本地服务器
python3 -m http.server 8080
# → http://localhost:8080
```

## 部署

本项目是**纯静态站点**——不需要 npm、不需要打包、不需要构建步骤。用任意静态文件服务器部署即可：

```bash
# rsync 到你的 web 根目录
rsync -avz --delete ./ user@server:/var/www/monitor-choice/

# 或使用 Caddy / nginx 的 file_server
```

详细部署示例见[英文 README](README.md#deployment-guide)。

## 隐私

| 项目 | 状态 |
|------|------|
| 外部请求 | **零** |
| 追踪 / 分析 | **零** |
| Cookie | **零** |
| 第三方脚本 / CDN | **零** |
| 数据收集 | **无** |

所有计算均在本地浏览器完成。设置仅在用户主动启用时存储于 `localStorage`，可随时清除。

## 技术栈

- HTML + CSS + Vanilla JavaScript (Canvas 2D)
- 零 npm 依赖
- 零构建工具
- 共 19 个文件，约 5,400 行

## 项目结构

```
monitor-choice/
├── index.html              # 页面骨架，5 个标签页，输入面板
├── script.js               # 标签路由，输入绑定，设置
├── styles.css              # 全局样式，CSS 变量，玻璃拟态
├── css/
│   ├── sharpness.css       # 标签 1：PPI/PPD 仪表，像素对比
│   ├── size-view.css       # 标签 2：3D 场景，比例对比
│   ├── color-lab.css       # 标签 3：CIE 色度图
│   ├── scenarios.css       # 标签 4：场景卡片
│   └── panel-guide.css     # 标签 5：手风琴，带宽计算
├── js/
│   ├── calc.js             # 光学计算（PPI, PPD, FOV 等）
│   ├── constants.js        # 分辨率、色域、面板数据、CIE 轨迹
│   ├── state.js            # 状态管理（localStorage）
│   ├── data-scenarios.js   # 9 个场景定义
│   ├── data-panels.js      # 面板百科数据
│   ├── tab-sharpness.js    # 标签 1 控制器
│   ├── tab-size-view.js    # 标签 2 控制器（3D 引擎）
│   ├── tab-color-lab.js    # 标签 3 控制器
│   ├── tab-scenarios.js    # 标签 4 控制器
│   └── tab-panel-guide.js  # 标签 5 控制器
├── LICENSE                 # MIT
├── README.md               # 英文文档
└── README.zh-CN.md         # 中文文档（当前页面）
```

## 许可证

[MIT](LICENSE) © 2026 Stepania H
