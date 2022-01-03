const { app, BrowserWindow, Menu, MenuItem } = require("electron");
const path = require("path");

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
  win.loadFile("dist/index.html");
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
