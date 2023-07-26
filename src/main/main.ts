/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import connection from './sql';
import { FlashcardDTO } from 'renderer/features/flashcards/types';
import crudRepository from './crudRepository';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  event.reply('ipc-example', `event reply ${arg}`);
});

ipcMain.on('get-decks', async (event, tableName) => {
  try {
    const rows = await crudRepository.selectAll('decks');
    console.log(rows);
    event.reply('get-decks-response', { data: rows });
  } catch (error) {
    console.log(error);
  }
});

ipcMain.on('create-deck', async (event, data, refetchQuery: string) => {
  console.log('create-deck', data);
  console.log('refetchQuery', refetchQuery);
  try {
    await crudRepository.createOne('decks', data);
    const [rows] = await connection.execute(refetchQuery);
    event.reply('create-deck-response', { data: rows });
  } catch (error) {
    console.log(error);
  }
});

ipcMain.on('delete-deck', async (event, id, refetchQuery: string) => {
  console.log('delete-deck', id);
  console.log('refetchQuery', refetchQuery);
  try {
    await crudRepository.deleteOne('decks', id);
    await crudRepository.deleteMany('flashcards', { deck_id: id });
    const [rows] = await connection.execute(refetchQuery);
    event.reply('delete-deck-response', { data: rows });
  } catch (error) {
    console.log(error);
  }
});

ipcMain.on('update-deck', async (event, id, data, refetchQuery: string) => {
  console.log('update-deck', data);
  try {
    await crudRepository.updateOne('decks', id, data);
    const [rows] = await connection.execute(refetchQuery);
    event.reply('update-deck-response', { data: rows });
  } catch (error) {
    console.log(error);
  }
});

ipcMain.on('get-flashcards-by-deckId', async (event, tableName, deckId) => {
  console.log('get-flashcards-by-deckId', tableName, deckId);
  try {
    const rows = await crudRepository.select('flashcards', ['*'], {
      deck_id: deckId,
    });
    console.log(rows);
    event.reply('get-flashcards-by-deckId-response', { data: rows });
  } catch (error) {
    console.log(error);
  }
});

ipcMain.on(
  'create-flashcard',
  async (event, flashcard: FlashcardDTO, refetchQuery: string) => {
    console.log('create-flashcard', flashcard);
    try {
      await crudRepository.createOne('flashcards', flashcard);
      const [rows] = await connection.execute(refetchQuery);
      event.reply('create-flashcard-response', { data: rows });
    } catch (error) {
      console.log(error);
    }
  }
);

ipcMain.on(
  'delete-flashcard',
  async (event, flashcardId, refetchQuery: string) => {
    console.log('delete-flashcard', flashcardId);
    try {
      await crudRepository.deleteOne('flashcards', flashcardId);
      const [rows] = await connection.execute(refetchQuery);
      event.reply('delete-flashcard-response', { data: rows });
    } catch (error) {
      console.log(error);
    }
  }
);

ipcMain.on(
  'update-flashcard',
  async (event, id, data, refetchQuery: string) => {
    console.log('update-flashcard', data);
    try {
      await crudRepository.updateOne('flashcards', id, data);
      const [rows] = await connection.execute(refetchQuery);
      event.reply('update-flashcard-response', { data: rows });
    } catch (error) {
      console.log(error);
    }
  }
);

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
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

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
