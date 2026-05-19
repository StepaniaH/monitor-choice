const scenarios = [
  {
    category: 'work',
    tag: '文字 / 办公',
    title: '长时间文字办公、网页、文档',
    meta: ['推荐距离：50-80cm', '关键指标：PPI、缩放、抗眩光、亮度稳定', '更看重清晰度和眼睛负担，而不是单纯尺寸'],
    choice: '<b>优先显示器：</b>27 寸 4K、27 寸 5K、32 寸 4K。<br><span class="caution">电视只适合 42 寸并拉远距离。</span>'
  },
  {
    category: 'media',
    tag: '电影 / 剧集',
    title: '沉浸式影音观看',
    meta: ['推荐距离：1.2-2.5m', '关键指标：黑位、HDR 峰值亮度、局部控光、音响', '越偏沙发场景，电视优势越明显'],
    choice: '<b>优先电视：</b>OLED 或 Mini LED，42-65 寸按距离选。<br><span class="caution">显示器适合近距离小空间。</span>'
  },
  {
    category: 'game',
    tag: '主机 / PC 游戏',
    title: '高刷新与 HDR 游戏',
    meta: ['推荐距离：70cm-2m', '关键指标：120Hz/144Hz、VRR、输入延迟、HDR', '主机更偏电视，桌面 FPS 更偏显示器'],
    choice: '<b>看游戏类型：</b>竞技选高刷显示器；3A / 主机选大尺寸电视。'
  },
  {
    category: 'work',
    tag: '外接主屏',
    title: '笔记本外接主屏',
    meta: ['推荐距离：60-90cm', '关键指标：系统缩放、色彩、USB-C、唤醒稳定性', '4K 27/32 是性价比路线，5K 27 是清晰度甜点'],
    choice: '<b>优先显示器：</b>27 寸 4K、27 寸 5K、32 寸 4K 都是常见稳妥选择。'
  },
  {
    category: 'media work',
    tag: '一屏多用',
    title: '桌面 + 影音混合空间',
    meta: ['推荐距离：80-120cm 起', '关键指标：尺寸、桌深、自动调光、像素结构', '42 寸电视可以很爽，但桌面要配合'],
    choice: '<b>可选 42 寸 OLED：</b>适合想要大画布和影音感的人。<br><span class="caution">长时间静态 UI 较多时要注意烧屏和亮度限制。</span>'
  },
  {
    category: 'work',
    tag: '多任务',
    title: '多窗口并排生产力',
    meta: ['推荐距离：70-100cm', '关键指标：横向空间、分屏效率、曲面接受度', '超宽屏适合时间线、IDE + 浏览器'],
    choice: '<b>优先 32 寸 4K 或 34 寸带鱼屏：</b>比电视更适合桌面窗口管理。'
  },
  {
    category: 'media',
    tag: '色彩 / 创作',
    title: '修图、视频、设计预览',
    meta: ['推荐距离：60-90cm', '关键指标：色准、P3、均匀性、校色能力', '电视色彩讨喜，但不一定适合严肃校色'],
    choice: '<b>优先专业显示器：</b>需要准确就别只看 OLED 观感。<br><span class="avoid">避免把电视当唯一校色屏。</span>'
  },
  {
    category: 'media game',
    tag: '客厅',
    title: '沙发、手柄、家庭娱乐',
    meta: ['推荐距离：1.8m+', '关键指标：尺寸、HDR、系统、遥控体验、音响', '这类场景显示器基本没必要硬上'],
    choice: '<b>优先电视：</b>55 寸起步更合理，空间允许越大越爽。'
  },
  {
    category: 'work',
    tag: '护眼 / 稳定',
    title: '长时间静态界面',
    meta: ['推荐距离：50-90cm', '关键指标：DC 调光/频闪、哑光、亮度一致性', '长期 IDE、终端、浏览器标签栏都属于静态风险'],
    choice: '<b>优先 LCD 显示器：</b>省心、稳定、无烧屏焦虑。'
  }
];

const grid = document.querySelector('#scenarioGrid');
const filters = document.querySelectorAll('.filter');

function renderCards() {
  grid.innerHTML = scenarios.map(item => `
    <article class="scenario" data-category="${item.category}">
      <span class="tag">${item.tag}</span>
      <h3>${item.title}</h3>
      <div class="meta">
        ${item.meta.map(line => `<div>· ${line}</div>`).join('')}
      </div>
      <div class="choice">${item.choice}</div>
    </article>
  `).join('');
}

function applyFilter(filter) {
  document.querySelectorAll('.scenario').forEach(card => {
    const matched = filter === 'all' || card.dataset.category.includes(filter);
    card.classList.toggle('hidden', !matched);
  });
}

filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    applyFilter(button.dataset.filter);
  });
});

renderCards();

const model = {
  distance: document.querySelector('#distanceRange'),
  size: document.querySelector('#sizeRange'),
  work: document.querySelector('#workRange'),
  media: document.querySelector('#mediaRange'),
  distanceValue: document.querySelector('#distanceValue'),
  sizeValue: document.querySelector('#sizeValue'),
  workValue: document.querySelector('#workValue'),
  mediaValue: document.querySelector('#mediaValue'),
  screenWrap: document.querySelector('#screenWrap'),
  screenSizeBadge: document.querySelector('#screenSizeBadge'),
  distanceBadge: document.querySelector('#distanceBadge'),
  sightCone: document.querySelector('#sightCone'),
  screen: document.querySelector('#liveScreen'),
  viewer: document.querySelector('#viewer'),
  distanceLine: document.querySelector('#distanceLine'),
  recommendType: document.querySelector('#recommendType'),
  textScore: document.querySelector('#textScore'),
  immersionScore: document.querySelector('#immersionScore'),
  riskScore: document.querySelector('#riskScore'),
  advice: document.querySelector('#liveAdvice')
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updateModel() {
  const distance = Number(model.distance.value);
  const size = Number(model.size.value);
  const work = Number(model.work.value);
  const media = Number(model.media.value);
  const distanceRatio = distance / size;

  model.distanceValue.textContent = `${distance}cm`;
  model.sizeValue.textContent = `${size}寸`;
  model.workValue.textContent = `${work}%`;
  model.mediaValue.textContent = `${media}%`;

  const screenWidth = clamp(138 + size * 3.9, 228, 440);
  const distanceProgress = (distance - 40) / 220;
  const viewerScale = clamp(1.12 - distanceProgress * .46, .64, 1.12);
  const screenTop = clamp(76 - Math.max(0, size - 32) * .92, 38, 78);
  const lineHeight = clamp(118 + distanceProgress * 150, 118, 268);
  const coneWidth = clamp(screenWidth * 1.08 + distanceProgress * 62, 250, 560);
  const coneHeight = clamp(210 + distanceProgress * 108, 210, 330);
  const tvMode = size >= 42;

  model.screen.style.width = `${screenWidth}px`;
  model.screenWrap.style.top = `${screenTop}px`;
  model.screenWrap.style.transform = `translateX(-50%) scale(${tvMode ? 1.02 : 1})`;
  model.viewer.style.transform = `translateX(-50%) scale(${viewerScale})`;
  model.viewer.style.opacity = clamp(1.08 - distanceProgress * .28, .72, 1);
  model.distanceLine.style.height = `${lineHeight}px`;
  model.sightCone.style.width = `${coneWidth}px`;
  model.sightCone.style.height = `${coneHeight}px`;
  model.sightCone.style.opacity = clamp(.72 - distanceProgress * .22, .42, .72);
  model.screen.classList.toggle('tv-mode', tvMode);
  model.screenSizeBadge.textContent = `${size}寸`;
  model.distanceBadge.textContent = `${distance}cm`;

  const idealTextRatio = 2.3;
  const textComfort = clamp(100 - Math.abs(distanceRatio - idealTextRatio) * 35 - Math.max(0, size - 38) * 1.2 + work * .18, 8, 100);
  const immersion = clamp(size * 1.12 + Math.max(0, 170 - distance) * .28 + media * .35, 8, 100);
  const staticRisk = clamp((size >= 42 ? 22 : 6) + work * .42 + Math.max(0, size - 42) * .7 - media * .12, 0, 100);
  const tvScore = immersion + media * .45 + Math.max(0, size - 40) * 1.2 - work * .22 - Math.max(0, 90 - distance) * .45;
  const monitorScore = textComfort + work * .42 + Math.max(0, 42 - size) * .7 - media * .14;

  model.textScore.value = Math.round(textComfort);
  model.immersionScore.value = Math.round(immersion);
  model.riskScore.value = Math.round(staticRisk);

  if (tvScore > monitorScore + 12) {
    model.recommendType.textContent = '电视 / 大屏更合适';
    model.advice.textContent = size < 42
      ? '影音游戏权重较高时，可以考虑把尺寸推到 42 寸以上，沉浸感会明显提升。'
      : '当前偏客厅或影音娱乐模型，大屏电视的沉浸感优势更明显。注意桌深和静态内容风险。';
  } else if (monitorScore > tvScore + 12) {
    model.recommendType.textContent = '显示器更合适';
    model.advice.textContent = size > 42
      ? '虽然当前选择了大尺寸，但文字工作占比较高，建议谨慎：32 寸 4K / 27 寸 5K 会更稳。'
      : '当前更像桌面生产力场景，显示器在文字清晰度、缩放和长期稳定性上更舒服。';
  } else {
    model.recommendType.textContent = '混合方案，看桌深';
    model.advice.textContent = '两边分数接近：如果桌面够深、影音更多，可以选 42 寸级电视；如果长时间文字办公，还是显示器更省心。';
  }
}

['distance', 'size', 'work', 'media'].forEach(key => {
  model[key].addEventListener('input', updateModel);
});

updateModel();
