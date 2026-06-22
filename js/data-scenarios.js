/**
 * data-scenarios.js — Scenario reference data.
 * Attaches to window.Scenarios.
 */
(function () {
  'use strict';

  var Scenarios = [
    {
      id: 'text-office',
      category: ['work'],
      tag: '文字办公',
      title: '文字办公与编程',
      meta: [
        '推荐距离 50-80cm',
        '长时间阅读与编辑',
        '文字清晰度是第一优先'
      ],
      params: {
        recommendedSize: { min: 27, max: 32 },
        recommendedPPI: { min: 110, max: 220 },
        recommendedPPD: { min: 60 }
      },
      choice: '推荐 <b>27″-32″ 4K</b> 显示器，PPI ≥ 140，保证文字锐利。<span class="caution">避免 27″ 1080p（PPI 仅 82，长时间阅读容易疲劳）。</span>',
      relatedTabs: ['sharpness', 'sizeView']
    },
    {
      id: 'media-immersive',
      category: ['media'],
      tag: '沉浸影音',
      title: '沉浸式影音体验',
      meta: [
        '推荐距离 1.2-2.5m',
        '追求沉浸感与画面规模',
        '对比度和色彩比清晰度更重要'
      ],
      params: {
        recommendedSize: { min: 42, max: 65 },
        recommendedPPI: { min: 60, max: 120 },
        recommendedPPD: { min: 45 }
      },
      choice: '推荐 <b>42″-65″ 4K</b> OLED 或 Mini-LED，对比度越高越好。<span class="caution">观影距离较远时 PPI 可以更低，但视角和 HDR 表现是关键。</span>',
      relatedTabs: ['sizeView', 'colorLab']
    },
    {
      id: 'gaming',
      category: ['game'],
      tag: '游戏',
      title: '高刷新与 HDR 游戏',
      meta: [
        '推荐距离 70cm-2m',
        '刷新率 ≥ 120Hz',
        '低延迟与 HDR 并重'
      ],
      params: {
        recommendedSize: { min: 27, max: 42 },
        recommendedPPI: { min: 90, max: 180 },
        recommendedPPD: { min: 45 }
      },
      choice: '推荐 <b>27″-42″ 2K/4K</b> 高刷显示器，≥ 120Hz + HDR。<span class="caution">竞技游戏优先刷新率（144Hz+），3A 大作优先 HDR 和色域。</span>',
      relatedTabs: ['sharpness', 'panelGuide']
    },
    {
      id: 'laptop-external',
      category: ['work', 'mac'],
      tag: '笔记本外接',
      title: '笔记本外接主屏',
      meta: [
        '推荐距离 60-90cm',
        '需要笔记本 + 外接双屏',
        'macOS 需 2K 及以上分辨率'
      ],
      params: {
        recommendedSize: { min: 27, max: 32 },
        recommendedPPI: { min: 110, max: 220 },
        recommendedPPD: { min: 60 }
      },
      choice: '推荐 <b>27″-32″ 4K</b> 显示器，PPI ≥ 140。<span class="caution">macOS 对非 Retina 屏幕文字渲染效果较差，务必选择高 PPI 型号；带 USB-C 一线连的型号更方便。</span>',
      relatedTabs: ['sharpness', 'panelGuide']
    },
    {
      id: 'hybrid-space',
      category: ['media', 'work'],
      tag: '混合使用',
      title: '桌面办公 + 影音混合',
      meta: [
        '推荐距离 80-120cm',
        '白天办公，晚上影音',
        '需要平衡清晰度与沉浸感'
      ],
      params: {
        recommendedSize: { min: 32, max: 42 },
        recommendedPPI: { min: 90, max: 160 },
        recommendedPPD: { min: 50 }
      },
      choice: '推荐 <b>32″-42″ 4K</b> 显示器，兼顾文字清晰与影音沉浸。<span class="caution">32″ 4K 在 80cm 距离下 PPD 约 68，办公和影音都不错。</span>',
      relatedTabs: ['sizeView', 'sharpness']
    },
    {
      id: 'multitask',
      category: ['work', 'mac'],
      tag: '多窗口并排',
      title: '多窗口并行办公',
      meta: [
        '推荐距离 70-100cm',
        '需要并排多个窗口',
        '屏幕宽度比高度更重要'
      ],
      params: {
        recommendedSize: { min: 34, max: 49 },
        recommendedPPI: { min: 90, max: 160 },
        recommendedPPD: { min: 55 }
      },
      choice: '推荐 <b>34″ 带鱼屏</b>（3440×1440）或 <b>42″ 4K</b>。<span class="caution">34″ 带鱼屏适合两个全高窗口并排；49″ 超宽屏适合三个窗口但需要更深桌面。macOS 用户注意带鱼屏的分屏管理。</span>',
      relatedTabs: ['sizeView', 'sharpness']
    },
    {
      id: 'color-creative',
      category: ['media'],
      tag: '修图设计',
      title: '修图、视频与设计',
      meta: [
        '推荐距离 60-90cm',
        '色准 ΔE < 2',
        '色域覆盖 ≥ sRGB 99%'
      ],
      params: {
        recommendedSize: { min: 27, max: 32 },
        recommendedPPI: { min: 110, max: 220 },
        recommendedPPD: { min: 60 }
      },
      choice: '推荐 <b>27″-32″ 4K</b> IPS 显示器，sRGB 99%+ / DCI-P3 90%+，ΔE < 2。<span class="caution">打印输出需要 Adobe RGB 95%+ 覆盖；视频剪辑推荐 DCI-P3 色域。</span>',
      relatedTabs: ['colorLab', 'sharpness']
    },
    {
      id: 'livingroom',
      category: ['media', 'game'],
      tag: '客厅娱乐',
      title: '客厅影音与游戏',
      meta: [
        '推荐距离 1.8m+',
        '大尺寸优先',
        'HDR 与对比度是核心'
      ],
      params: {
        recommendedSize: { min: 55, max: 75 },
        recommendedPPI: { min: 50, max: 100 },
        recommendedPPD: { min: 45 }
      },
      choice: '推荐 <b>55″-75″ 4K</b> OLED 电视，HDR 表现优秀。<span class="caution">OLED 烧屏风险需注意，主机游戏时留意静态 UI 元素。</span>',
      relatedTabs: ['sizeView', 'panelGuide']
    },
    {
      id: 'eye-care',
      category: ['work'],
      tag: '护眼稳定',
      title: '护眼与长时间稳定使用',
      meta: [
        '推荐距离 50-90cm',
        'DC 调光 / 无频闪',
        '低蓝光 + 亮度自适应'
      ],
      params: {
        recommendedSize: { min: 27, max: 32 },
        recommendedPPI: { min: 100, max: 180 },
        recommendedPPD: { min: 55 }
      },
      choice: '推荐 <b>27″-32″</b> DC 调光显示器，支持低蓝光模式。<span class="caution">避免 PWM 调光型号；环境光传感器可自动调节亮度，减少眼疲劳。每小时休息 5-10 分钟比任何硬件都有效。</span>',
      relatedTabs: ['sharpness', 'panelGuide']
    }
  ];

  window.Scenarios = Scenarios;
})();
