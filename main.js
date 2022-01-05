const { app, clipboard, BrowserWindow, Menu, MenuItem, Notification, Tray, nativeImage } = require("electron");
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

if (process.platform === 'win32') {
  app.setAppUserModelId("520弹幕助手")
}

const menu = new Menu()
menu.append(new MenuItem({
  label: 'Functions',
  submenu: [
    {
      label: 'DevTools',
      accelerator: 'Ctrl+Shift+I',
      click: function (item, focusedWindow) {
        if (focusedWindow)
          focusedWindow.toggleDevTools();
      }
    }
  ]
}))

Menu.setApplicationMenu(menu)

let tray = null;
const icon = nativeImage.createFromPath(path.join(__dirname, "public/favicon.ico"));
const contextMenu = Menu.buildFromTemplate(
  [
    {
      label: '检查更新',
      click: () => {
        autoUpdater.checkForUpdates();
      }
    },
    { type: 'separator' },
    {
      label: "退出",
      click: () => {
        app.quit();
      }
    }
  ]
);

app.whenReady().then(() => {
  tray = new Tray(icon);
  tray.setToolTip("520弹幕助手");
  tray.setContextMenu(contextMenu);

  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      tray = new Tray(icon);
      tray.setToolTip("520弹幕助手");
      tray.setContextMenu(contextMenu);

      createWindow();
    }
  });
});

autoUpdater.on('update-not-available', info => {
  new Notification({
    title: "更新检查",
    body: "当前版本 V" + info.version + " 已是最新版本",
  }).show();
});

autoUpdater.on('update-available', info => {
  new Notification({
    title: "发现新版本",
    body: "应用将会自动重启以更新至 V" + info.version,
  }).show();
});

autoUpdater.on('error', err => {
  clipboard.writeText(String(err));
  new Notification({
    title: "无法获取更新",
    body: "错误信息已复制到剪贴板, 请反馈开发者",
  }).show();
});

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall(true, true);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});