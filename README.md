# Monitor Choice

A privacy-first, zero-dependency interactive tool for understanding display parameters — PPI, viewing distance, color gamut, panel technologies — to help you make informed monitor and TV choices.

**[中文文档](README.zh-CN.md)**

## Features

- **Sharpness Lab** — Real-time PPI/PPD calculation with pixel-level text rendering comparison (Retina vs non-Retina at your actual viewing distance)
- **Size & Distance** — Interactive 3D room scene with drag-to-rotate perspective projection; real-world screen size overlay and FOV/THX/SMPTE distance recommendations
- **Color Space** — CIE 1931 chromaticity diagram with interactive gamut overlay (sRGB / DCI-P3 / Rec.2020) and panel color characteristics
- **Scenario Guide** — 9 practical usage scenarios (office work, gaming, creative work, living room, etc.) with tailored parameter recommendations
- **Panel Encyclopedia** — Deep-dive into IPS / VA / OLED / Mini-LED technologies, including interface bandwidth calculator (HDMI 2.1 / DP 2.1 / USB-C)

## Quick Start

No build step. No dependencies. Just open it:

```bash
# Option 1: Open directly
open index.html

# Option 2: Local server
python3 -m http.server 8080
# → http://localhost:8080
```

## Deployment

This is a **pure static site** — no npm, no bundler, no build step. Deploy with any static file server:

```bash
# rsync to your web root
rsync -avz --delete ./ user@server:/var/www/monitor-choice/

# or use Caddy / nginx file_server
```

See [Deployment Guide](#deployment-guide) below for a concrete VPS example.

## Privacy

| Item | Status |
|------|--------|
| External requests | **Zero** |
| Tracking / Analytics | **Zero** |
| Cookies | **Zero** |
| Third-party scripts / CDNs | **Zero** |
| Data collection | **None** |

All calculations run entirely in your browser. Settings are stored in `localStorage` only if explicitly enabled by the user, and can be cleared at any time.

## Tech Stack

- HTML + CSS + Vanilla JavaScript (Canvas 2D)
- Zero npm dependencies
- Zero build tools
- ~5,400 lines total across 19 files

## Project Structure

```
monitor-choice/
├── index.html              # Page skeleton, 5 tabs, input panel
├── script.js               # Tab router, input bindings, settings
├── styles.css              # Global styles, CSS variables, glassmorphism
├── css/
│   ├── sharpness.css       # Tab 1: PPI/PPD meter, pixel comparison
│   ├── size-view.css       # Tab 2: 3D scene, proportion comparison
│   ├── color-lab.css       # Tab 3: CIE diagram
│   ├── scenarios.css       # Tab 4: Scenario cards
│   └── panel-guide.css     # Tab 5: Accordion, bandwidth calc
├── js/
│   ├── calc.js             # Optical calculations (PPI, PPD, FOV, etc.)
│   ├── constants.js        # Resolutions, gamuts, panel data, CIE locus
│   ├── state.js            # State management (localStorage)
│   ├── data-scenarios.js   # 9 scenario definitions
│   ├── data-panels.js      # Panel encyclopedia data
│   ├── tab-sharpness.js    # Tab 1 controller
│   ├── tab-size-view.js    # Tab 2 controller (3D engine)
│   ├── tab-color-lab.js    # Tab 3 controller
│   ├── tab-scenarios.js    # Tab 4 controller
│   └── tab-panel-guide.js  # Tab 5 controller
├── LICENSE                 # MIT
├── README.md               # You are here (English)
└── README.zh-CN.md         # Chinese README
```

## Deployment Guide

Since this project has **no build step**, deployment is much simpler than a typical frontend project — skip the `npm install && npm build` cycle entirely.

### On your VPS (example: 1C/1G VPS with Caddy)

```bash
# 1. Clone the repo
cd ~/src
git clone https://github.com/StepaniaH/monitor-choice.git

# 2. rsync directly to your web root — no build needed!
rsync -avz --delete \
  --exclude '.git' \
  --exclude 'docs' \
  ~/src/monitor-choice/ \
  ~/www/monitor-choice/

# 3. Configure Caddy (if not already)
# In your Caddyfile:
#   monitor-choice.yourdomain.com {
#       root * /home/user/www/monitor-choice
#       file_server
#   }

# 4. Reload Caddy
sudo systemctl reload caddy
```

### Updating

```bash
cd ~/src/monitor-choice
git pull
rsync -avz --delete --exclude '.git' --exclude 'docs' ./ ~/www/monitor-choice/
```

That's it. No `node_modules`, no `dist/`, no build artifacts — just static files.

## License

[MIT](LICENSE) © 2026 Stepania H
