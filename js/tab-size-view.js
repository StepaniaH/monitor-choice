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
  /* Canvas — front view (true relative scale comparison)               */
  /* ------------------------------------------------------------------ */

  function renderCanvas(state) {
    var canvas = document.getElementById('sizeCanvas');
    if (!canvas) return;

    var dpr = window.devicePixelRatio || 1;
    var cssW = canvas.clientWidth || 600;
    var cssH = canvas.clientHeight || 380;
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

    // Compute scale: fit widest screen to canvas width with padding
    var padX = 40, padTop = 50, padBottom = 80;
    var maxW = Math.max.apply(null, screens.map(function (s) { return s.widthCm; }));
    var totalGap = (screens.length - 1) * 30;
    var availW = cssW - padX * 2 - totalGap;
    var availH = cssH - padTop - padBottom;
    var scaleX = availW / (maxW * screens.length);
    var scaleY = availH / maxW * (9 / 16); // height limited by 16:9 aspect
    var scale = Math.min(scaleX, scaleY);

    // Clamp scale so screens aren't too small
    scale = Math.max(scale, 0.3);

    // Baseline (floor where all screens stand)
    var baselineY = cssH - padBottom;

    // Draw baseline
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, baselineY + 2);
    ctx.lineTo(cssW - padX, baselineY + 2);
    ctx.stroke();

    // Draw screens side by side at true relative scale
    var cursorX = padX;
    screens.forEach(function (s) {
      var w = s.widthCm * scale;
      var h = s.heightCm * scale;
      var x = cursorX + (availW / screens.length - w) / 2;
      x = Math.max(cursorX, x);
      var y = baselineY - h;

      // Screen body
      if (s.isCurrent) {
        ctx.fillStyle = 'rgba(139,211,255,0.10)';
        ctx.strokeStyle = '#8bd3ff';
        ctx.lineWidth = 2.5;
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.strokeStyle = 'rgba(200,200,200,0.35)';
        ctx.lineWidth = 1.5;
      }

      // Screen content area
      var bezel = 3;
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);

      // Inner screen (bezel effect)
      ctx.fillStyle = s.isCurrent ? 'rgba(139,211,255,0.04)' : 'rgba(255,255,255,0.02)';
      ctx.fillRect(x + bezel, y + bezel, w - bezel * 2, h - bezel * 2);

      // Stand
      var standW = Math.max(8, w * 0.15);
      var standH = 12;
      ctx.fillStyle = s.isCurrent ? 'rgba(139,211,255,0.4)' : 'rgba(200,200,200,0.2)';
      ctx.fillRect(x + w / 2 - 1, baselineY - standH + 2, 2, standH);
      ctx.fillRect(x + w / 2 - standW / 2, baselineY - 3, standW, 3);

      // Size label
      ctx.fillStyle = s.isCurrent ? '#8bd3ff' : '#8899aa';
      ctx.font = (s.isCurrent ? 'bold 16px ' : '14px ') + 'system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.size + '″', x + w / 2, y - 12);

      // Dimensions
      ctx.fillStyle = s.isCurrent ? 'rgba(139,211,255,0.6)' : 'rgba(150,160,170,0.5)';
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillText(s.widthCm.toFixed(0) + '×' + s.heightCm.toFixed(0) + 'cm',
                   x + w / 2, baselineY + 18);

      // "当前" badge
      if (s.isCurrent) {
        ctx.fillStyle = '#8bd3ff';
        ctx.font = 'bold 9px system-ui, sans-serif';
        ctx.fillText('当前', x + w / 2, baselineY + 32);
      }

      cursorX += availW / screens.length;
    });

    // Viewing distance bar (bottom)
    var barY = cssH - 30;
    var barStartX = padX;
    var barEndX = padX + Math.min(distance * scale * 1.5, cssW - padX * 2);

    ctx.strokeStyle = '#ff9a3c';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(barStartX, barY);
    ctx.lineTo(barEndX, barY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrow heads
    [barStartX, barEndX].forEach(function (px) {
      ctx.fillStyle = '#ff9a3c';
      ctx.beginPath();
      ctx.moveTo(px, barY);
      ctx.lineTo(px + (px === barStartX ? 6 : -6), barY - 4);
      ctx.lineTo(px + (px === barStartX ? 6 : -6), barY + 4);
      ctx.fill();
    });

    ctx.fillStyle = '#ff9a3c';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('观看距离 ' + distance + 'cm', (barStartX + barEndX) / 2, barY - 8);

    // FOV indicator (top right)
    var fov = Calc.computeHorizontalFOV(size, ar, distance);
    ctx.fillStyle = 'rgba(100,200,100,0.7)';
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('水平视野角 ' + fov.toFixed(1) + '°', cssW - padX, 25);

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
