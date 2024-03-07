const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');

let mainWindow;
let newWindow;

// Open the app window
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    frame: false,
  });

  mainWindow.loadFile('index.html');
  console.log('Main window is charged')
});

// Open a new window to display the website content
ipcMain.on('open-website-new-window', (event, url) => {
  newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    fullscreen: true
  });

  // Print the URL of website opened
  console.log('URL du site ouvert :', url)
  newWindow.loadURL(url)

  // Register local shortcut
  const ret = globalShortcut.register('Alt+Left', () => {
    if (newWindow.webContents.canGoBack()) {
      newWindow.webContents.goBack();
    }
  });

  if (!ret) {
    console.warn('Failed to save shortcut.');
  }

  // Handle website window closing
  newWindow.on('closed', () => {

    // Deregistration of shortcut when close the window
    globalShortcut.unregister('Alt+Left');
    newWindow = null;
  });
});
