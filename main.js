const { app, BrowserWindow } = require('electron')

let comPort;

const { ipcMain  } = require('electron')

ipcMain.on('store-com-port', function (event, arg) {
  comPort = arg;
});


ipcMain.on('get-com-port', function (event, arg) {
  event.returnValue = comPort;
});


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
}

app.allowRendererProcessReuse = false;

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})