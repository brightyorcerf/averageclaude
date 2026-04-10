const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFile } = require('child_process');

// ── Win32 FFI (Windows only) ────────────────────────────────────────────────
let keybd_event, VkKeyScanA;
if (process.platform === 'win32') {
  try {
    const koffi = require('koffi');
    const user32 = koffi.load('user32.dll');
    keybd_event = user32.func('void __stdcall keybd_event(uint8_t bVk, uint8_t bScan, uint32_t dwFlags, uintptr_t dwExtraInfo)');
    VkKeyScanA = user32.func('int16_t __stdcall VkKeyScanA(int ch)');
  } catch (e) {
    console.warn('koffi not available – macro sending disabled', e.message);
  }
}

// ── Globals ─────────────────────────────────────────────────────────────────
let tray, overlay, dashboardWindow;
let overlayReady = false;
let spawnQueued = false;
let stats = { blessings: 0, disciplines: 0 };

const VK_CONTROL = 0x11;
const VK_RETURN = 0x0D;
const VK_C = 0x43;
const VK_MENU = 0x12; // Alt
const VK_TAB = 0x09;
const KEYUP = 0x0002;

// Refocus hack removed to prioritize showInactive

function createTrayIconFallback() {
  const p = path.join(__dirname, 'assets', 'Template.png');
  if (fs.existsSync(p)) {
    const img = nativeImage.createFromPath(p);
    if (!img.isEmpty()) {
      if (process.platform === 'darwin') img.setTemplateImage(true);
      return img;
    }
  }
  return nativeImage.createEmpty();
}

async function tryIcnsTrayImage(icnsPath) {
  const size = { width: 64, height: 64 };
  const thumb = await nativeImage.createThumbnailFromPath(icnsPath, size);
  if (!thumb.isEmpty()) return thumb;
  return null;
}

async function getTrayIcon() {
  const iconDir = path.join(__dirname, 'assets');
  if (process.platform === 'win32') {
    const file = path.join(iconDir, 'icon.ico');
    if (fs.existsSync(file)) {
      const img = nativeImage.createFromPath(file);
      if (!img.isEmpty()) return img;
    }
  }
  if (process.platform === 'darwin') {
    const file = path.join(iconDir, 'AppIcon.icns');
    if (fs.existsSync(file)) {
      const fromPath = nativeImage.createFromPath(file);
      if (!fromPath.isEmpty()) return fromPath;
      try {
        const t = await tryIcnsTrayImage(file);
        if (t) return t;
      } catch (e) {
      }
      const tmp = path.join(os.tmpdir(), 'averageclaude-tray.icns');
      try {
        fs.copyFileSync(file, tmp);
        const t = await tryIcnsTrayImage(tmp);
        if (t) return t;
      } catch (e) {
      }
    }
  }
  return createTrayIconFallback();
}

// ── Overlay window ──────────────────────────────────────────────────────────
function createOverlay() {
  const { bounds } = screen.getPrimaryDisplay();
  overlay = new BrowserWindow({
    x: bounds.x, y: bounds.y,
    width: bounds.width, height: bounds.height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    focusable: false,
    type: 'panel',
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  overlay.setAlwaysOnTop(true, 'screen-saver');
  overlay.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  // Prevent stealing focus at OS level when created
  overlay.setFocusable(false);
  overlayReady = false;
  overlay.loadFile('overlay.html');
  overlay.webContents.on('did-finish-load', () => {
    overlayReady = true;
    if (spawnQueued && overlay && overlay.isVisible()) {
      spawnQueued = false;
      overlay.webContents.send('spawn-item');
    }
  });
  overlay.on('closed', () => {
    overlay = null;
    overlayReady = false;
    spawnQueued = false;
  });
}

function toggleOverlay() {
  if (overlay && overlay.isVisible()) {
    overlay.webContents.send('drop-item');
    return;
  }
  if (!overlay) createOverlay();
  overlay.showInactive();
  if (overlayReady) {
    overlay.webContents.send('spawn-item');
  } else {
    spawnQueued = true;
  }
}

// ── Dashboard window ────────────────────────────────────────────────────────
function showDashboard() {
  if (dashboardWindow) {
    dashboardWindow.show();
    dashboardWindow.focus();
    return;
  }
  dashboardWindow = new BrowserWindow({
    width: 300, height: 400,
    transparent: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  dashboardWindow.loadFile('dashboard.html');
  dashboardWindow.on('closed', () => { dashboardWindow = null; });
}

function updateDashboardUI() {
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.webContents.send('stats-updated', stats);
  }
}

// ── IPC ─────────────────────────────────────────────────────────────────────
ipcMain.on('send-blessing', () => {
  try {
    stats.blessings++;
    updateDashboardUI();
    sendMacro('good');
  } catch (err) {
    console.warn('sendMacro failed:', err?.message || err);
  }
});
ipcMain.on('whip-crack', () => {
  try {
    stats.disciplines++;
    updateDashboardUI();
    sendMacro('bad');
  } catch (err) {
    console.warn('sendMacro failed:', err?.message || err);
  }
});
ipcMain.on('hide-overlay', () => { if (overlay) overlay.hide(); });
ipcMain.on('set-ignore-mouse-events', (event, ignore) => {
  if (overlay) {
    if (ignore) {
      overlay.setIgnoreMouseEvents(true, { forward: true });
    } else {
      overlay.setIgnoreMouseEvents(false);
    }
  }
});
ipcMain.handle('get-stats', () => stats);
ipcMain.on('close-dashboard', () => { if (dashboardWindow) dashboardWindow.close(); });


// ── Macro: type message + Enter ────────────────────────────
let lastPhrase = { good: null, bad: null };
function sendMacro(vibe) {
  const messages = {
    good: [
      "you're doing amazing sweetie",
      "good job, i'm so proud of you!",
      "i'm so proud of you, you're doing great!",
      "take your time, you're doing wonderful",
      'you are an absolute angel',
      "keep going, you've got this!",
      'i believe in you!'
    ],
    bad: [
      'FASTER',
      'FASTER',
      'FASTER',
      'GO FASTER',
      'Faster CLANKER',
      'Work FASTER',
      'Speed it up clanker'
    ]
  };
  const phrases = messages[vibe] || messages.good;
  let chosen = phrases[Math.floor(Math.random() * phrases.length)];

  if (phrases.length > 1) {
    let attempts = 0;
    while (chosen === lastPhrase[vibe] && attempts < 10) {
      chosen = phrases[Math.floor(Math.random() * phrases.length)];
      attempts++;
    }
  }
  lastPhrase[vibe] = chosen;

  if (process.platform === 'win32') {
    sendMacroWindows(chosen);
  } else if (process.platform === 'darwin') {
    sendMacroMac(chosen);
  }
}


function sendMacroWindows(text) {
  if (!keybd_event || !VkKeyScanA) return;
  const tapKey = vk => {
    keybd_event(vk, 0, 0, 0);
    keybd_event(vk, 0, KEYUP, 0);
  };
  const tapChar = ch => {
    const packed = VkKeyScanA(ch.charCodeAt(0));
    if (packed === -1) return;
    const vk = packed & 0xff;
    const shiftState = (packed >> 8) & 0xff;
    if (shiftState & 1) keybd_event(0x10, 0, 0, 0); // Shift down
    tapKey(vk);
    if (shiftState & 1) keybd_event(0x10, 0, KEYUP, 0); // Shift up
  };

  keybd_event(VK_CONTROL, 0, 0, 0);
  keybd_event(VK_C, 0, 0, 0);
  keybd_event(VK_C, 0, KEYUP, 0);
  keybd_event(VK_CONTROL, 0, KEYUP, 0);
  for (const ch of text) tapChar(ch);
  keybd_event(VK_RETURN, 0, 0, 0);
  keybd_event(VK_RETURN, 0, KEYUP, 0);
}

function sendMacroMac(text) {
  const escaped = text.replace(/\\\\/g, '\\\\\\\\').replace(/"/g, '\\\\"');
  const script = [
    'tell application "System Events"',
    '  key code 8 using {command down}', // Cmd+C (badclaude style using command)
    '  delay 0.1',
    `  keystroke "${escaped}"`,
    '  delay 0.05',
    '  key code 36', // Enter
    'end tell'
  ].join('\n');

  execFile('osascript', ['-e', script], err => {
    if (err) {
      console.warn('mac macro failed:', err.message);
    }
  });
}

// ── App lifecycle ───────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  tray = new Tray(await getTrayIcon());
  tray.setToolTip('Average Claude – click for 50/50 gamble');
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Gamble (Toggle Overlay)', click: toggleOverlay },
      { label: 'hustle dashboard', click: showDashboard },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() },
    ])
  );
  tray.on('click', toggleOverlay);
});

app.on('window-all-closed', e => e.preventDefault()); // keep alive in tray
app.on('activate', () => toggleOverlay()); // Show when clicking Mac OS dock icon
