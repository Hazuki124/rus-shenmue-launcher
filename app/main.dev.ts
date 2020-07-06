/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { download } from 'electron-dl';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';

export default class AppUpdater {
  constructor(mainWindow: BrowserWindow) {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.on('update-available', () => {
      mainWindow.webContents.send('update-available');
    });
    autoUpdater.on('error', (err) => {
      mainWindow.webContents.send('update-error', err);
    });
    autoUpdater.on('update-downloaded', (_event, releaseNotes, _releaseName) => {
      mainWindow.webContents.send('update-downloaded');
    });
    autoUpdater.on('checking-for-update', () => {
      mainWindow.webContents.send('checking-for-update');
    });
    autoUpdater.on('update-not-available', () => {
      mainWindow.webContents.send('update-not-available');
    });

    autoUpdater.checkForUpdates();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1224,
    minWidth: 1224,
    height: 710,
    minHeight: 710,
    maxHeight: 710,
    frame: false, // set false in prod
    // transparent: true,
    fullscreen: false,
    fullscreenable: false,
    resizable: false,
    backgroundColor: '#161616',
    darkTheme: true,
    icon: `${__dirname}/../resources/icons.icns`,
    webPreferences:
      process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
        ? {
            nodeIntegration: true
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js')
          }
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      if (process.env.START_MINIMIZED) {
        mainWindow.minimize();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }, 350);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on('download', (_event, info) => {
    console.log(info.url)
    info.properties.onProgress = (status: any) =>
      mainWindow.webContents.send('download progress', status, info.game, info.availableVersion);
    download(BrowserWindow.getFocusedWindow(), info.url, {
      ...info.properties,
      saveAs: false,
      errorTitle: 'Ошибка при загрузке обновления',
      errorMessage: 'Файл {filename} не обнаружен',
      openFolderWhenDone: false
    }).then((dl: { getSavePath: () => any }) => {
      mainWindow.webContents.send('download complete', {
        file: dl.getSavePath(),
        game: info.game,
        availableVersion: info.availableVersion
      });
    }).catch(() => {
      mainWindow.webContents.send('download interrupted', {
        game: info.game,
        availableVersion: info.availableVersion
      });
    });
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater(mainWindow);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.commandLine.appendSwitch('lang', 'ru');
app.on('ready', createWindow);

app.on('ready', async () => {
  console.log(app.getPath('userData'));
  console.log(app.getPath('appData'));
  console.log(app.getPath('home'));
  console.log(app.getPath('temp'));
  console.log(app.getPath('exe'));
  console.log(process.env.INI_DOWNLOAD_URL);
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
