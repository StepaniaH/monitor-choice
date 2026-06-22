/**
 * data-panels.js — Panel technology encyclopedia data.
 * Attaches to window.PanelGuideData.
 */
(function () {
  'use strict';

  var PanelGuideData = {
    sections: [
      {
        id: 'ips',
        name: 'IPS',
        principle: '液晶分子在通电时沿屏幕平面方向旋转排列，通过控制光线的透过方向来显示不同颜色。是目前最主流的桌面显示器面板技术。',
        pros: [
          '色彩还原准确，ΔE < 2',
          '可视角度大（178°）',
          '适合专业修图和设计',
          '响应速度适中'
        ],
        cons: [
          '原生对比度一般（1000:1）',
          '存在 IPS Glow 暗角现象',
          '黑色表现不如 VA/OLED',
          '高端型号价格较高'
        ],
        suitable: ['修图与设计', '日常办公', '编程开发', '轻度影音'],
        unsuitable: ['HDR 影音体验', '暗室环境使用', '专业电竞']
      },
      {
        id: 'va',
        name: 'VA',
        principle: '液晶分子在未通电时垂直排列阻挡光线，通电时倾斜排列允许光线通过，实现更高的原生对比度。',
        pros: [
          '原生对比度高（3000:1~6000:1）',
          '黑色表现深邃',
          '无 IPS Glow',
          '性价比高'
        ],
        cons: [
          '可视角度不如 IPS',
          '响应时间可能偏慢',
          '暗部细节过渡可能不均匀',
          '曲面型号可能变形'
        ],
        suitable: ['影音娱乐', 'HDR 内容', '日常办公', '预算有限场景'],
        unsuitable: ['专业色彩工作', '高速竞技游戏', '多角度观看']
      },
      {
        id: 'tn',
        name: 'TN',
        principle: '液晶分子在通电时扭曲排列控制光线通过，是最早的 LCD 技术结构简单、响应极快。',
        pros: [
          '响应时间极快（1ms）',
          '刷新率可达 360Hz+',
          '成本低',
          '功耗低'
        ],
        cons: [
          '色彩表现差',
          '可视角度小',
          '对比度低',
          '色彩失真明显'
        ],
        suitable: ['专业电竞', '预算极度有限', '需要极高刷新率'],
        unsuitable: ['修图设计', '影音娱乐', '日常使用', '多角度展示']
      },
      {
        id: 'oled',
        name: 'OLED',
        principle: '每个像素自发光，无需背光层。通过控制每个有机发光二极管的亮度实现像素级控光。',
        pros: [
          '无限对比度',
          '像素级控光，完美黑色',
          '响应时间极快（0.1ms）',
          '色彩鲜艳，色域广'
        ],
        cons: [
          '烧屏/残影风险',
          '亮度不如 Mini-LED',
          '全屏白场亮度有限',
          '价格昂贵'
        ],
        suitable: ['HDR 影音', '单机游戏', '专业设计', '暗室使用'],
        unsuitable: ['固定 UI 长时间显示', '超亮环境', '预算有限']
      },
      {
        id: 'mini-led',
        name: 'Mini-LED',
        principle: '使用数千个微型 LED 作为背光，配合局部调光技术（Local Dimming），在 LCD 面板上实现接近 OLED 的控光效果。',
        pros: [
          '亮度高（1000~2000+ nits）',
          '局部调光分区多',
          'HDR 表现优秀',
          '无烧屏风险'
        ],
        cons: [
          '光晕效应（blooming）',
          '对比度不及 OLED',
          '成本较高',
          '分区不够精细时仍有漏光'
        ],
        suitable: ['HDR 影音', '明亮环境使用', '游戏娱乐', '多用途场景'],
        unsuitable: ['极度暗室环境', '预算有限', '需要极致色彩准确']
      }
    ],

    burnIn: {
      what: '残影与烧屏',
      causes: '长时间显示同一静态画面（如任务栏、图标、台标），导致 OLED 像素老化不均匀，在屏幕上留下永久性残影。',
      mitigation: [
        '使用屏幕保护程序，闲置 5 分钟后自动开启',
        '定期运行像素刷新（Pixel Refresh）功能',
        '避免长时间最大亮度使用',
        '使用深色主题，减少高亮度静态元素',
        '定期变换桌面壁纸',
        '开启自动隐藏任务栏',
        '每使用 4 小时关机休息 15 分钟'
      ],
      riskFactors: [
        'OLED 面板风险最高，尤其是早期型号',
        '长时间 100% 亮度使用显著增加风险',
        '固定 UI 元素（任务栏、频道台标）是主要诱因',
        '使用时间超过 3 年后风险显著增加',
        'Mini-LED 和 IPS/VA 面板几乎无此问题'
      ]
    },

    refreshRate: {
      comparisons: [
        { rate: 60, label: '60Hz', useCase: '办公、网页浏览、标准视频。日常使用足够，但滚动和动画不够顺滑。' },
        { rate: 120, label: '120Hz', useCase: '流畅滚动、轻度游戏。日常体验明显优于 60Hz，macOS 推荐。' },
        { rate: 144, label: '144Hz', useCase: '竞技游戏入门。射击和赛车类游戏体验显著提升。' },
        { rate: 240, label: '240Hz+', useCase: '专业电竞。极致流畅，需要高端 GPU 支持才能发挥全部实力。' }
      ]
    },

    interfaces: {
      note: '接口带宽详细数据请参考 Constants.INTERFACE_BANDWIDTH。常见接口包括 DP 1.4、DP 2.0、HDMI 2.0、HDMI 2.1 和 USB-C DP Alt Mode。选择接口时需确保其最大带宽大于所需信号带宽。'
    }
  };

  window.PanelGuideData = PanelGuideData;
})();
