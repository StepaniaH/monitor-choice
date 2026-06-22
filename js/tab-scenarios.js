/**
 * tab-scenarios.js — Scenarios reference tab controller.
 * Attaches to window.TabScenarios = { init(), destroy() }.
 *
 * Renders filter buttons and scenario cards from window.Scenarios.
 * Apply button sets AppState to recommended values and switches tab.
 */
(function () {
  'use strict';

  var cleanups = [];
  var currentFilter = 'all';

  var FILTERS = [
    { key: 'all',   label: '全部' },
    { key: 'work',  label: '开发办公' },
    { key: 'media', label: '影音' },
    { key: 'game',  label: '游戏' },
    { key: 'mac',   label: 'Mac 适配' }
  ];

  var TAB_LABELS = {
    sharpness: '清晰度实验室',
    sizeView: '尺寸与距离',
    colorLab: '色彩空间',
    scenarios: '场景参考',
    panelGuide: '面板百科'
  };

  /* ------------------------------------------------------------------ */
  /* Filters                                                            */
  /* ------------------------------------------------------------------ */

  function renderFilters() {
    var container = document.getElementById('scenarioFilters');
    if (!container) return;

    var html = '<span class="filter-label">筛选：</span>';
    FILTERS.forEach(function (f) {
      var cls = 'filter-pill';
      if (f.key === currentFilter) cls += ' active';
      html += '<button class="' + cls + '" data-filter="' + f.key + '">' + f.label + '</button>';
    });
    container.innerHTML = html;
  }

  /* ------------------------------------------------------------------ */
  /* Scenario grid                                                      */
  /* ------------------------------------------------------------------ */

  function renderGrid() {
    var container = document.getElementById('scenarioGrid');
    if (!container || !window.Scenarios) return;

    var filtered = Scenarios.filter(function (s) {
      if (currentFilter === 'all') return true;
      return s.category && s.category.indexOf(currentFilter) !== -1;
    });

    var html = '';
    filtered.forEach(function (s) {
      var metaHtml = (s.meta || []).map(function (m) {
        return '<div class="meta-row"><span class="meta-icon">›</span>' + m + '</div>';
      }).join('');

      var relatedHtml = '';
      if (s.relatedTabs && s.relatedTabs.length > 0) {
        var links = s.relatedTabs.map(function (tab) {
          var label = TAB_LABELS[tab] || tab;
          return '<a href="#" data-tab="' + tab + '" class="related-tab-link">' + label + '</a>';
        }).join(' · ');
        relatedHtml = '<div class="related-link">相关：' + links + '</div>';
      }

      html +=
        '<div class="scenario-card">' +
        '<span class="tag">' + s.tag + '</span>' +
        '<h3>' + s.title + '</h3>' +
        '<div class="meta">' + metaHtml + '</div>' +
        '<div class="choice">' + s.choice + '</div>' +
        '<button class="apply-btn" data-scenario="' + s.id + '">应用此场景</button>' +
        relatedHtml +
        '</div>';
    });

    container.innerHTML = html;
  }

  /* ------------------------------------------------------------------ */
  /* Apply scenario                                                     */
  /* ------------------------------------------------------------------ */

  function applyScenario(scenarioId) {
    var scenario = Scenarios.filter(function (s) { return s.id === scenarioId; })[0];
    if (!scenario || !scenario.params) return;

    var p = scenario.params;
    var size = Math.round((p.recommendedSize.min + p.recommendedSize.max) / 2);
    var targetPpi = (p.recommendedPPI.min + p.recommendedPPI.max) / 2;

    // Find resolution that gives closest PPI at the selected size
    var bestRes = null;
    var bestDiff = Infinity;
    if (window.Constants && Constants.RESOLUTIONS) {
      Constants.RESOLUTIONS.forEach(function (r) {
        var calcPpi = Calc.computePPI(r.w, r.h, size);
        var diff = Math.abs(calcPpi - targetPpi);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestRes = r;
        }
      });
    }

    var updates = { size: size };
    if (bestRes) {
      updates.resolution = { w: bestRes.w, h: bestRes.h };
    }
    AppState.batch(updates);

    // Switch to related tab
    if (scenario.relatedTabs && scenario.relatedTabs.length > 0) {
      if (window.switchTab) {
        window.switchTab(scenario.relatedTabs[0]);
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Main render                                                        */
  /* ------------------------------------------------------------------ */

  function render() {
    renderFilters();
    renderGrid();
  }

  /* ------------------------------------------------------------------ */
  /* Lifecycle                                                          */
  /* ------------------------------------------------------------------ */

  function init() {
    cleanups = [];
    render();

    // Filter buttons
    var filterContainer = document.getElementById('scenarioFilters');
    if (filterContainer) {
      function handleFilterClick(e) {
        var btn = e.target.closest('.filter-pill');
        if (!btn) return;
        currentFilter = btn.getAttribute('data-filter');
        render();
      }
      filterContainer.addEventListener('click', handleFilterClick);
      cleanups.push(function () { filterContainer.removeEventListener('click', handleFilterClick); });
    }

    // Grid clicks (apply + related links)
    var gridContainer = document.getElementById('scenarioGrid');
    if (gridContainer) {
      function handleGridClick(e) {
        var applyBtn = e.target.closest('.apply-btn');
        if (applyBtn) {
          e.preventDefault();
          applyScenario(applyBtn.getAttribute('data-scenario'));
          return;
        }
        var tabLink = e.target.closest('.related-tab-link');
        if (tabLink) {
          e.preventDefault();
          var tab = tabLink.getAttribute('data-tab');
          if (tab && window.switchTab) window.switchTab(tab);
        }
      }
      gridContainer.addEventListener('click', handleGridClick);
      cleanups.push(function () { gridContainer.removeEventListener('click', handleGridClick); });
    }
  }

  function destroy() {
    cleanups.forEach(function (fn) { if (fn) fn(); });
    cleanups = [];
  }

  window.TabScenarios = { init: init, destroy: destroy };
})();
