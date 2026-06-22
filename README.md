# Monitor Choice

显示器参数理解与选择参考工具。

## 功能

- **清晰度实验室**：PPI/PPD 计算 + 像素级文字渲染对比
- **尺寸与距离**：真实比例桌面叠加 + FOV 可视化
- **色彩空间**：CIE 1931 交互式色域图 + 面板色彩特性
- **场景参考**：9 个使用场景的选购指导
- **面板百科**：IPS/VA/OLED/Mini-LED 技术深度解析

## 运行

直接用浏览器打开 `index.html`，或部署到任意静态文件服务器。

```bash
cd monitor-choice
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

## 隐私

零外部请求、零追踪、零 Cookie。所有计算在本地浏览器完成。
设置仅在本地存储（需主动启用），可随时清除。

## 技术

HTML + CSS + Vanilla JavaScript (Canvas 2D)，零依赖。
