/**
 * tab-size-view.js — Size & Distance tab controller.
 * Attaches to window.TabSizeView = { init(), destroy() }.
 *
 * Renders screen dimensions, FOV, THX/SMPTE recommended distances,
 * desk constraint stats, and a side-view canvas overlay.
 */
(function () {
  'use strict';

  var cleanups = [];
  var resizeTimer = null;
  var selectedSizes = [];

  /* ------------------------------------------------------------------ */
  /* Helpers                                                            */
  /* ------------------------------------------------------------------ */

  function getAspectRatio(w, h) {
    if (!window.Constants || !Constants.RESOLUTIONS) return '16:9';
    for (var i = 0; i < Constants.RESOLUTIONS.length; i++) {
      var r = Constants.RESOLUTIONS[i];
      if (r.w === w && r.h === h) return r.ar;
    }
    return '16:9';
  }

  function initSelectedSizes(currentSize) {
    selectedSizes = [currentSize];
    var allSizes = [24, 27, 32, 38, 42, 48, 55, 65, 75];

    var smaller = allSizes.filter(function (s) { return s < currentSize; });
    var larger = allSizes.filter(function (s) { return s > currentSize; });

    if (larger.length > 0) {
      selectedSizes.push(larger[0]);
    }
    if (smaller.length > 0) {
      selectedSizes.push(smaller[smaller.length - 1]);
    }

    while (selectedSizes.length < 3) {
      var added = false;
      for (var i = 0; i < allSizes.length; i++) {
        if (selectedSizes.indexOf(allSizes[i]) === -1) {
          selectedSizes.push(allSizes[i]);
          added = true;
          break;
        }
      }
      if (!added) break;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Stats                                                              */
  /* ------------------------------------------------------------------ */

  function renderStats(state) {
    var size = state.size;
    var ar = getAspectRatio(state.resolution.w, state.resolution.h);
    var distance = state.distance;
    var deskDepth = state.deskDepth;

    var dims = Calc.resolveDimensions(size, ar);
    var fov = Calc.computeHorizontalFOV(size, ar, distance);
    var thx = Calc.computeTHXDistance(size);
    var smpte = Calc.computeSMPTERange(size);
    var desk = Calc.computeDeskConstraint(deskDepth);

    var el;
    el = document.getElementById('size-dimensions');
    if (el) el.textContent = dims.widthCm.toFixed(1) + ' × ' + dims.heightCm.toFixed(1) + ' cm';

    el = document.getElementById('size-fov');
    if (el) el.textContent = fov.toFixed(1) + '°';

    el = document.getElementById('size-thx');
    if (el) el.textContent = Math.round(thx) + ' cm';

    el = document.getElementById('size-smpte');
    if (el) el.textContent = Math.round(smpte.min) + '-' + Math.round(smpte.max) + ' cm';

    var deskEl = document.getElementById('size-desk');
    var deskStat = document.getElementById('size-desk-stat');
    if (deskEl) {
      deskEl.textContent = '可用 ' + Math.round(desk.usableDepthCm) + 'cm / 最大 ' + Math.round(desk.maxDiagonalInch) + '″';
    }
    if (deskStat) {
      deskStat.classList.remove('warn', 'bad');
      if (size > desk.maxDiagonalInch) {
        deskStat.classList.add('bad');
      } else if (size > desk.maxDiagonalInch * 0.85) {
        deskStat.classList.add('warn');
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Size selector                                                      */
  /* ------------------------------------------------------------------ */

  function renderSizeSelector(currentSize) {
    var container = document.getElementById('sizeSelector');
    if (!container) return;

    var availableSizes = [24, 27, 32, 38, 42, 48, 55, 65, 75];
    var html = '<span class="control-label">对比尺寸：</span>';
    availableSizes.forEach(function (s) {
      var cls = 'size-pill';
      if (selectedSizes.indexOf(s) !== -1) cls += ' active';
      if (s === currentSize) cls += ' current';
      html += '<button class="' + cls + '" data-size="' + s + '">' + s + '″</button>';
    });
    container.innerHTML = html;
  }

  /* ------------------------------------------------------------------ */
  /* Canvas — side view                                                 */
  /* ------------------------------------------------------------------ */

  function renderCanvas(state) {
    var canvas = document.getElementById('sizeCanvas');
    if (!canvas) return;

    var dpr = window.devicePixelRatio || 1;
    var cssW = canvas.clientWidth || 600;
    var cssH = canvas.clientHeight || 340;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#070b16';
    ctx.fillRect(0, 0, cssW, cssH);

    var size = state.size;
    var distance = state.distance;
    var deskDepth = state.deskDepth;
    var ar = getAspectRatio(state.resolution.w, state.resolution.h);

    // Build display sizes (selected + current, deduplicated)
    var displaySizes = selectedSizes.slice();
    if (displaySizes.indexOf(size) === -1) displaySizes.push(size);
    displaySizes.sort(function (a, b) { return a - b; });

    var screens = displaySizes.map(function (s) {
      var dims = Calc.resolveDimensions(s, ar);
      return {
        size: s,
        widthCm: dims.widthCm,
        heightCm: dims.heightCm,
        isCurrent: s === size
      };
    });

    var maxScreenH = Math.max.apply(null, screens.map(function (s) { return s.heightCm; }));
    var eyeHeight = 115; // typical seated eye height above desk surface (cm)

    // Scale to fit
    var padL = 55, padR = 30, padT = 25, padB = 55;
    var plotW = cssW - padL - padR;
    var plotH = cssH - padT - padB;

    var maxDepth = Math.max(distance, deskDepth) + 30;
    var maxHeight = Math.max(maxScreenH, eyeHeight) + 20;

    var scale = Math.min(plotW / maxDepth, plotH / maxHeight);

    var groundY = cssH - padB;
    var viewerX = padL + 10;
    var viewerY = groundY - eyeHeight * scale;
    var screenX = padL + distance * scale;

    // Current screen reference
    var currentScreen = screens.filter(function (s) { return s.isCurrent; })[0] || screens[0];

    // FOV cone (behind everything)
    if (currentScreen) {
      var screenTopY = groundY - currentScreen.heightCm * scale;
      ctx.fillStyle = 'rgba(100,200,100,0.06)';
      ctx.strokeStyle = 'rgba(100,200,100,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(viewerX, viewerY);
      ctx.lineTo(screenX, screenTopY);
      ctx.lineTo(screenX, groundY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      var fov = Calc.computeHorizontalFOV(size, ar, distance);
      ctx.fillStyle = 'rgba(100,200,100,0.6)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('视野角 ' + fov.toFixed(1) + '°', viewerX + 8, viewerY - 10);
    }

    // Desk surface
    var deskLeft = viewerX - 15;
    var deskRight = screenX + 30;
    ctx.fillStyle = 'rgba(180,140,80,0.12)';
    ctx.strokeStyle = 'rgba(200,160,100,0.4)';
    ctx.lineWidth = 2;
    ctx.fillRect(deskLeft, groundY - 2, deskRight - deskLeft, 5);
    ctx.strokeRect(deskLeft, groundY - 2, deskRight - deskLeft, 5);

    // Desk depth indicator
    ctx.strokeStyle = 'rgba(200,160,100,0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(viewerX, groundY + 10);
    ctx.lineTo(viewerX + deskDepth * scale, groundY + 10);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(200,160,100,0.6)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('桌深 ' + deskDepth + 'cm', viewerX + (deskDepth * scale) / 2, groundY + 24);

    // Draw screens (side view — thin rectangles)
    screens.forEach(function (s) {
      var screenH = s.heightCm * scale;
      var screenW = Math.max(4, s.widthCm * scale * 0.06);
      var sx = screenX - screenW / 2;
      var sy = groundY - screenH;

      ctx.fillStyle = s.isCurrent ? 'rgba(139,211,255,0.12)' : 'rgba(255,255,255,0.04)';
      ctx.strokeStyle = s.isCurrent ? '#8bd3ff' : 'rgba(200,200,200,0.35)';
      ctx.lineWidth = s.isCurrent ? 2 : 1;
      ctx.fillRect(sx, sy, screenW, screenH);
      ctx.strokeRect(sx, sy, screenW, screenH);

      // Stand
      ctx.fillStyle = s.isCurrent ? 'rgba(139,211,255,0.3)' : 'rgba(200,200,200,0.2)';
      ctx.fillRect(screenX - 8, groundY - 2, 16, 2);

      // Label
      ctx.fillStyle = s.isCurrent ? '#8bd3ff' : '#888';
      ctx.font = (s.isCurrent ? 'bold ' : '') + '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.size + '″', screenX, sy - 6);

      if (s.isCurrent) {
        ctx.fillStyle = 'rgba(139,211,255,0.5)';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(s.heightCm.toFixed(0) + 'cm', screenX + screenW / 2 + 4, sy + screenH / 2);
      }
    });

    // Distance line (eye to screen center)
    if (currentScreen) {
      var screenCenterY = groundY - currentScreen.heightCm * scale / 2;
      ctx.strokeStyle = '#ff9a3c';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(viewerX, viewerY);
      ctx.lineTo(screenX, screenCenterY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ff9a3c';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(distance + 'cm', (viewerX + screenX) / 2, (viewerY + screenCenterY) / 2 - 6);
    }

    // Viewer (eye)
    ctx.fillStyle = '#ff9a3c';
    ctx.beginPath();
    ctx.arc(viewerX, viewerY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('眼睛', viewerX - 8, viewerY + 4);

    // Ground line
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, groundY + 3);
    ctx.lineTo(cssW - padR, groundY + 3);
    ctx.stroke();

    ctx.textAlign = 'left';
  }

  /* ------------------------------------------------------------------ */
  /* Main render                                                        */
  /* ------------------------------------------------------------------ */

  function render() {
    var distance = AppState.get('distance');
    var size = AppState.get('size');
    var resolution = AppState.get('resolution');
    var deskDepth = AppState.get('deskDepth');
    if (!resolution) return;

    var state = { distance: distance, size: size, resolution: resolution, deskDepth: deskDepth };

    if (selectedSizes.length === 0 || selectedSizes.indexOf(size) === -1) {
      initSelectedSizes(size);
    }

    renderStats(state);
    renderSizeSelector(size);
    renderCanvas(state);
  }

  /* ------------------------------------------------------------------ */
  /* Lifecycle                                                          */
  /* ------------------------------------------------------------------ */

  function init() {
    cleanups = [];

    var size = AppState.get('size');
    initSelectedSizes(size);
    render();

    ['distance', 'size', 'resolution', 'deskDepth'].forEach(function (key) {
      var unsub = AppState.onChange(key, render);
      cleanups.push(unsub);
    });

    // Size selector clicks
    var container = document.getElementById('sizeSelector');
    if (container) {
      function handleClick(e) {
        var btn = e.target.closest('.size-pill');
        if (!btn) return;
        var s = parseInt(btn.getAttribute('data-size'), 10);
        if (s === AppState.get('size')) return; // can't toggle current
        var idx = selectedSizes.indexOf(s);
        if (idx === -1) {
          if (selectedSizes.length < 5) selectedSizes.push(s);
        } else {
          if (selectedSizes.length > 1) selectedSizes.splice(idx, 1);
        }
        render();
      }
      container.addEventListener('click', handleClick);
      cleanups.push(function () { container.removeEventListener('click', handleClick); });
    }

    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(render, 150);
    }
    window.addEventListener('resize', onResize);
    cleanups.push(function () {
      window.removeEventListener('resize', onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    });
  }

  function destroy() {
    cleanups.forEach(function (fn) { if (fn) fn(); });
    cleanups = [];
  }

  window.TabSizeView = { init: init, destroy: destroy };
})();
