const { app, BrowserWindow, Menu, MenuItem } = require("electron");
const path = require("path");

let win = null;
function createWindow() {
    win = new BrowserWindow({
    width: 1000,
    height: 630,
    resizable: false,
    autoHideMenuBar: true,
    opacity: 1,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("dist/index.html");
  win.setAlwaysOnTop(true, "normal")
}

const menu = new Menu()
menu.append(new MenuItem({
  label: 'Opacity',
  submenu: [{
    role: 'Bump',
    accelerator: '=',
    click: () => {
      let current = win.getOpacity();
      if (current < 1) {
        win.setOpacity(current + 0.05)
      }
    }
  }, {
    role: 'Drop',
    accelerator: '-',
    click: () => {
      let current = win.getOpacity();
      if (current > 0) {
        win.setOpacity(current - 0.05)
      }
    }
  }]
}))

Menu.setApplicationMenu(menu)


app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
