const { app, clipboard, ipcMain, BrowserWindow, Menu, MenuItem, Notification, Tray, nativeImage } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const settings = require('electron-settings')

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

let win = null
function createWindow() {
  win = new BrowserWindow({
    minWidth: 1000,
    minHeight: 590,
    resizable: true,
    autoHideMenuBar: true,
    opacity: 1,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: true
    },
  });
  win.loadFile("entry/index.html");
  win.setAlwaysOnTop(true, "normal")
}

if (process.platform === 'win32') {
  app.setAppUserModelId("com.skysway.dyassistant")
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
const icon = nativeImage.createFromPath(path.join(__dirname, "public/icon.ico"));
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
      label: '打开日志文件夹',
      click: () => {
        dir = app.getPath('documents') + '\\520-Logs'
        require('child_process').exec('start "" "' + dir + '"')
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

app.whenReady().then(async () => {
  tray = new Tray(icon);
  tray.setToolTip("520弹幕助手");
  tray.setContextMenu(contextMenu);

  createWindow();
  registerSettingEvents()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      tray = new Tray(icon);
      tray.setToolTip("520弹幕助手");
      tray.setContextMenu(contextMenu);

      createWindow();
      registerSettingEvents()
    }
  }
  );
})

async function registerSettingEvents() {
  if (await settings.has('size')) {
    let res = await settings.get('size')
    win.setSize(res.width, res.height)
  }

  if (await settings.has('position')) {
    let res = await settings.get('position')
    win.setPosition(res.x, res.y)
  }

  win.on('resized', () => {
    let size = win.getSize()
    settings.set('size', {
      width: size[0],
      height: size[1]
    })
  })

  win.on('moved', () => {
    let position = win.getPosition()
    settings.set('position', {
      x: position[0],
      y: position[1]
    })
  })
}

ipcMain.handle('get-doc-path', () => {
  return app.getPath("documents")
})

autoUpdater.on('update-not-available', info => {
  //win.webContents.send("no-update", "0")
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