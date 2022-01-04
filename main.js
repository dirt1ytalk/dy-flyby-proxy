const { app, BrowserWindow, Menu, MenuItem, Notification } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';


function createWindow() {
    const win = new BrowserWindow({
    width: 1000,
    height: 590,
    resizable: false,
    autoHideMenuBar: true,
    opacity: 1,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("entry/index.html");
  win.setAlwaysOnTop(true, "normal")
}

const menu = new Menu()
menu.append(new MenuItem({
  label: 'Functions',
  submenu: [
  {
    label: 'DevTools',
    accelerator: 'Ctrl+Shift+I',
    click: function(item, focusedWindow) {
      if (focusedWindow)
        focusedWindow.toggleDevTools();
    }
  }
]}))

Menu.setApplicationMenu(menu)

app.whenReady().then(() => {
  createWindow();
  log.info('Window created, checking for update...')
  autoUpdater.checkForUpdates()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      log.info('Window created, checking for update...')
      autoUpdater.checkForUpdates()
    }
  });
});

autoUpdater.on('update-available', info => {
  new Notification({
    title: "发现新版本",
    body: "正在下载新版本"
  }).show();
});

autoUpdater.on('update-downloaded', () => {
  new Notification({
    title: "正在安装更新",
    body: "应用将会自动重启以安装更新"
  }).show();
  autoUpdater.quitAndInstall(true, true);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

