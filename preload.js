// ABOUTME: Electron preload bridge exposing IPC channels for the sparkle wand overlay
// ABOUTME: Connects renderer (overlay.html) to main process (main.js) via secure context bridge
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
  sendBlessing: () => ipcRenderer.send('send-blessing'),
  whipCrack: () => ipcRenderer.send('whip-crack'),
  hideOverlay: () => ipcRenderer.send('hide-overlay'),
  onSpawnItem: (fn) => ipcRenderer.on('spawn-item', () => fn()),
  onDropItem: (fn) => ipcRenderer.on('drop-item', () => fn()),
});
