import { is } from '@electron-toolkit/utils';
import { BrowserWindow, app, ipcMain } from 'electron';
import { getPort } from 'get-port-please';
import { startServer } from 'next/dist/server/lib/start-server';
import { join } from 'node:path';

const startNextJSServer = async () => {
  try {
    const nextJSPort = await getPort({ portRange: [30_011, 50_000] });
    // const webDir = join(app.getAppPath(), "app");
    const webDir = app.getAppPath();

    await startServer({
      allowRetry: false,
      customServer: true,
      dir: webDir,
      hostname: 'localhost',
      isDev: false,
      keepAliveTimeout: 5000,
      minimalMode: true,
      port: nextJSPort,
    });

    return nextJSPort;
  } catch (error) {
    console.error('Error starting Next.js server:', error);
    throw error;
  }
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    height: 670,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, 'preload.js'),
    },
    width: 900,
  });

  mainWindow.on('ready-to-show', () => mainWindow.show());

  const loadURL = async () => {
    if (is.dev) {
      mainWindow.loadURL('http://localhost:3000');
    } else {
      try {
        const port = await startNextJSServer();
        console.log('Next.js server started on port:', port);
        mainWindow.loadURL(`http://localhost:${port}`);
      } catch (error) {
        console.error('Error starting Next.js server:', error);
      }
    }
  };

  loadURL();
  return mainWindow;
};

const initializeApp = async () => {
  await app.whenReady();
  createWindow();

  ipcMain.on('ping', () => console.log('pong'));
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
};

initializeApp();
