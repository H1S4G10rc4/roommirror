const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

const MIRROR_ASPECT_RATIO = 4;
app.setName('Room mirror');

function createWindow() {
  const window = new BrowserWindow({
    width: 1000,
    height: 250,
    useContentSize: true,
    minWidth: 480,
    minHeight: 120,
    backgroundColor: '#000000',
    title: 'Room mirror',
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.setAspectRatio(MIRROR_ASPECT_RATIO);
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, url) => {
    if (url !== window.webContents.getURL()) event.preventDefault();
  });
  window.loadFile(path.join(__dirname, 'index.html'));
  return window;
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
    return permission === 'media' && webContents?.getURL().startsWith('file://');
  });

  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(permission === 'media' && webContents?.getURL().startsWith('file://'));
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('window:set-always-on-top', (event, enabled) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window) return false;
  window.setAlwaysOnTop(Boolean(enabled), 'floating');
  return window.isAlwaysOnTop();
});

ipcMain.on('window:close', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close();
});
