// ABOUTME: Electron preload bridge exposing IPC channels for the sparkle wand overlay
// ABOUTME: Connects renderer (overlay.html) to main process (main.js) via secure context bridge
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
  sendBlessing: () => ipcRenderer.send('send-blessing'),
  whipCrack: () => ipcRenderer.send('whip-crack'),
  hideOverlay: () => ipcRenderer.send('hide-overlay'),
  setIgnoreMouseEvents: (ignore) => ipcRenderer.send('set-ignore-mouse-events', ignore),
  onSpawnItem: (fn) => ipcRenderer.on('spawn-item', () => fn()),
  onDropItem: (fn) => ipcRenderer.on('drop-item', () => fn()),
  // Dashboard hook
  getStats: () => ipcRenderer.invoke('get-stats'),
  onStatsUpdated: (fn) => ipcRenderer.on('stats-updated', (event, stats) => fn(stats)),
  closeDashboard: () => ipcRenderer.send('close-dashboard')
});
