import { is } from '@electron-toolkit/utils';
import { BrowserWindow, app, ipcMain } from 'electron';
import log from 'electron-log';
import { getPort } from 'get-port-please';
import { startServer } from 'next/dist/server/lib/start-server';
import { join } from 'node:path';

let isQuitting = false;

const startNextJSServer = async () => {
  try {
    const nextJSPort = await getPort({ portRange: [30_011, 50_000] });
    const webDir = app.getAppPath();

    await startServer({
      allowRetry: false,
      customServer: true,
      dir: webDir,
      hostname: 'localhost',
      isDev: false,
      keepAliveTimeout: 5000,
      // minimalMode: true,        // 最小化模式会导致路由失效
      port: nextJSPort,
    });

    return nextJSPort;
  } catch (error) {
    log.error('Error starting Next.js server:', error);
    throw error;
  }
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, 'preload.js'),
    },
    width: 1000,
  });

  mainWindow.on('ready-to-show', () => mainWindow.show());
  mainWindow.on('close', (event) => {
    if (process.platform === 'darwin' && !isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  const loadURL = async () => {
    if (is.dev) {
      mainWindow.loadURL('http://localhost:3010');
    } else {
      try {
        const port = await startNextJSServer();
        log.info('Next.js server started on port:', port);
        mainWindow.loadURL(`http://localhost:${port}`);
      } catch (error) {
        log.error('Error starting Next.js server:', error);
      }
    }
  };

  loadURL();
  return mainWindow;
};

const startApp = async () => {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
    return;
  }
  await app.whenReady();
  createWindow();

  ipcMain.on('ping', () => log.info('pong'));

  app.on('second-instance', () => {
    const allWindows = BrowserWindow.getAllWindows();
    const mainWindow = allWindows.length > 0 ? allWindows[0] : null;
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows();
    const mainWindow = allWindows.length > 0 ? allWindows[0] : null;
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    } else {
      createWindow();
    }
  });
  app.on('before-quit', () => {
    isQuitting = true; // 标记应用程序正在退出
  });
  app.on('window-all-closed', () => {
    log.info(`App window all closed ${isQuitting ? 'is quitting' : ''}`);
    if (process.platform !== 'darwin') app.quit();
    else if (isQuitting) app.quit();
  });
};

startApp();
