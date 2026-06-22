/**
 * tab-panel-guide.js — Panel Encyclopedia tab controller.
 * Attaches to window.TabPanelGuide = { init(), destroy() }.
 *
 * Renders an accordion of panel technologies, burn-in info,
 * refresh rate comparisons, and an interface bandwidth calculator.
 */
(function () {
  'use strict';

  var cleanups = [];

  /* ------------------------------------------------------------------ */
  /* Accordion                                                          */
  /* ------------------------------------------------------------------ */

  function renderAccordion() {
    var container = document.getElementById('panelAccordion');
    if (!container || !window.PanelGuideData || !PanelGuideData.sections) return;

    var panelTypes = (window.Constants && Constants.PANEL_TYPES) || [];

    var html = '';
    PanelGuideData.sections.forEach(function (section) {
      // Find matching PANEL_TYPES entry for extra specs
      var pt = panelTypes.filter(function (p) { return p.id === section.id; })[0];
      var summary = pt ? (pt.contrastRatio + ' · ' + pt.gamut) : '';

      html += '<div class="panel-accordion-item">';
      html += '<div class="panel-accordion-header" data-panel="' + section.id + '">';
      html += '<div class="header-left">';
      html += '<span class="panel-name">' + section.name + '</span>';
      html += '<span class="panel-summary">' + summary + '</span>';
      html += '</div>';
      html += '<span class="icon">▸</span>';
      html += '</div>';
      html += '<div class="panel-accordion-body">';

      // Principle
      html += '<div class="section-title">原理</div>';
      html += '<p class="description">' + section.principle + '</p>';

      // Pros
      html += '<div class="section-title">优势</div>';
      html += '<ul class="pros">';
      (section.pros || []).forEach(function (p) { html += '<li>' + p + '</li>'; });
      html += '</ul>';

      // Cons
      html += '<div class="section-title">不足</div>';
      html += '<ul class="cons">';
      (section.cons || []).forEach(function (c) { html += '<li>' + c + '</li>'; });
      html += '</ul>';

      // Suitable
      html += '<div class="section-title">适合场景</div>';
      html += '<div class="tag-row">';
      (section.suitable || []).forEach(function (s) {
        html += '<span class="mini-tag suitable">' + s + '</span>';
      });
      html += '</div>';

      // Unsuitable
      html += '<div class="section-title">不适合场景</div>';
      html += '<div class="tag-row">';
      (section.unsuitable || []).forEach(function (u) {
        html += '<span class="mini-tag unsuitable">' + u + '</span>';
      });
      html += '</div>';

      html += '</div>'; // body
      html += '</div>'; // item
    });

    container.innerHTML = html;
  }

  /* ------------------------------------------------------------------ */
  /* Burn-in info                                                       */
  /* ------------------------------------------------------------------ */

  function renderBurnIn() {
    var container = document.getElementById('burnInInfo');
    if (!container || !window.PanelGuideData || !PanelGuideData.burnIn) return;

    var bi = PanelGuideData.burnIn;
    var html = '';

    html += '<p style="margin:0 0 16px;font-size:14px;color:var(--text-muted);line-height:1.7;">' + bi.causes + '</p>';

    if (bi.mitigation && bi.mitigation.length > 0) {
      html += '<div style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:8px;">缓解方法</div>';
      html += '<ul style="list-style:none;margin:0 0 16px;padding:0;display:grid;gap:6px;">';
      bi.mitigation.forEach(function (m) {
        html += '<li style="font-size:14px;color:var(--text-primary);padding-left:18px;position:relative;line-height:1.6;"><span style="position:absolute;left:0;color:var(--good-green);">✓</span>' + m + '</li>';
      });
      html += '</ul>';
    }

    if (bi.riskFactors && bi.riskFactors.length > 0) {
      html += '<div style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:8px;">风险因素</div>';
      html += '<ul style="list-style:none;margin:0;padding:0;display:grid;gap:6px;">';
      bi.riskFactors.forEach(function (r) {
        html += '<li style="font-size:14px;color:var(--text-primary);padding-left:18px;position:relative;line-height:1.6;"><span style="position:absolute;left:0;color:var(--warn-yellow);">!</span>' + r + '</li>';
      });
      html += '</ul>';
    }

    container.innerHTML = html;
  }

  /* ------------------------------------------------------------------ */
  /* Refresh rate comparison                                            */
  /* ------------------------------------------------------------------ */

  function renderRefreshRate() {
    var container = document.getElementById('refreshInfo');
    if (!container || !window.PanelGuideData || !PanelGuideData.refreshRate) return;

    var comparisons = PanelGuideData.refreshRate.comparisons || [];
    var html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;">';

    comparisons.forEach(function (c) {
      html += '<div style="padding:16px;border:1px solid var(--border);border-radius:12px;background:rgba(255,255,255,0.04);">';
      html += '<div style="font-size:22px;font-weight:800;color:var(--accent-blue);font-variant-numeric:tabular-nums;">' + c.label + '</div>';
      html += '<div style="font-size:13px;color:var(--text-muted);margin-top:6px;line-height:1.5;">' + c.useCase + '</div>';
      html += '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
  }

  /* ------------------------------------------------------------------ */
  /* Bandwidth calculator                                               */
  /* ------------------------------------------------------------------ */

  function computeBandwidth() {
    var wEl = document.getElementById('bwWidth');
    var hEl = document.getElementById('bwHeight');
    var rEl = document.getElementById('bwRefresh');
    var dEl = document.getElementById('bwDepth');
    if (!wEl || !hEl || !rEl || !dEl) return;

    var w = parseInt(wEl.value, 10) || 3840;
    var h = parseInt(hEl.value, 10) || 2160;
    var refresh = parseInt(rEl.value, 10) || 60;
    var depth = parseInt(dEl.value, 10) || 8;

    var bandwidth = Calc.computeInterfaceBandwidth(w, h, refresh, depth);

    var resultEl = document.getElementById('bwResult');
    if (!resultEl) return;

    // Bandwidth row
    var html = '<div class="result-row">';
    html += '<span class="result-label">所需带宽</span>';
    html += '<span class="result-value highlight">' + bandwidth.toFixed(2) + ' Gbps</span>';
    html += '</div>';

    // Mode info
    html += '<div class="result-row">';
    html += '<span class="result-label">信号模式</span>';
    html += '<span class="result-value">' + w + '×' + h + ' @ ' + refresh + 'Hz · ' + depth + 'bit</span>';
    html += '</div>';

    // Interface compatibility
    if (window.Constants && Constants.INTERFACE_BANDWIDTH) {
      var compatHtml = '<div class="compat-interfaces">';

      for (var key in Constants.INTERFACE_BANDWIDTH) {
        var iface = Constants.INTERFACE_BANDWIDTH[key];
        var supported = iface.rate >= bandwidth;
        compatHtml += '<span class="compat-badge ' + (supported ? 'ok' : 'fail') + '">';
        compatHtml += (supported ? '✓ ' : '✗ ') + iface.name;
        compatHtml += '</span>';
      }
      compatHtml += '</div>';

      // Per-interface rows
      for (var key2 in Constants.INTERFACE_BANDWIDTH) {
        var iface2 = Constants.INTERFACE_BANDWIDTH[key2];
        var ok2 = iface2.rate >= bandwidth;
        html += '<div class="result-row">';
        html += '<span class="result-label">' + iface2.name + '</span>';
        html += '<span class="result-value ' + (ok2 ? 'good' : 'bad') + '">';
        html += (ok2 ? '✓' : '✗') + ' ' + iface2.rate.toFixed(2) + ' Gbps';
        html += '</span>';
        html += '</div>';
      }

      html += compatHtml;
    }

    resultEl.innerHTML = html;
  }

  /* ------------------------------------------------------------------ */
  /* Main render                                                        */
  /* ------------------------------------------------------------------ */

  function render() {
    renderAccordion();
    renderBurnIn();
    renderRefreshRate();
    computeBandwidth();
  }

  /* ------------------------------------------------------------------ */
  /* Lifecycle                                                          */
  /* ------------------------------------------------------------------ */

  function init() {
    cleanups = [];
    render();

    // Accordion toggle
    var accordion = document.getElementById('panelAccordion');
    if (accordion) {
      function handleAccordionClick(e) {
        var header = e.target.closest('.panel-accordion-header');
        if (!header) return;
        var item = header.parentElement;
        var wasExpanded = item.classList.contains('expanded');

        // Close all
        accordion.querySelectorAll('.panel-accordion-item').forEach(function (it) {
          it.classList.remove('expanded');
        });

        // Toggle current
        if (!wasExpanded) {
          item.classList.add('expanded');
        }
      }
      accordion.addEventListener('click', handleAccordionClick);
      cleanups.push(function () { accordion.removeEventListener('click', handleAccordionClick); });
    }

    // Bandwidth calculator inputs
    var bwIds = ['bwWidth', 'bwHeight', 'bwRefresh', 'bwDepth'];
    bwIds.forEach(function (id) {
      var input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', computeBandwidth);
        cleanups.push(function () { input.removeEventListener('input', computeBandwidth); });
      }
    });
  }

  function destroy() {
    cleanups.forEach(function (fn) { if (fn) fn(); });
    cleanups = [];
  }

  window.TabPanelGuide = { init: init, destroy: destroy };
})();
