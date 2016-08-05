'use strict'
const { app, BrowserWindow, ipcMain} = require('electron');
require('./app/utils/ipc-snmp');

let win;

function createWindow() {

    win = new BrowserWindow({
        height: 600,
        minHeight: 600,
        minWidth: 960,
        maxHeight: 600,
        maxWidth: 960,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        darkTheme: true
    });

    win.loadURL(`file://${__dirname}/app/view.html`)

    win.webContents.closeDevTools();

    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {

    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {

    if (win === null) {
        createWindow();
    }
});

process.setMaxListeners(5);