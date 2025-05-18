const { contextBridge, ipcRenderer } = require('electron');

let desktopCapturer;
try {
  const electron = require('electron');
  desktopCapturer = electron.desktopCapturer;
  console.log('Preload: DesktopCapturer module available:', !!desktopCapturer);
  console.log('Preload: Electron modules loaded:', Object.keys(electron));
} catch (error) {
  console.error('Preload: Failed to load desktopCapturer:', error.message);
}

contextBridge.exposeInMainWorld('electron', {
  desktopCapturer,
  ipcRenderer
});

console.log('Preload: Script loaded successfully');