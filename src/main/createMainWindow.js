import { BrowserWindow } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { close } from './helpers';

const config = {
    width: 300,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    title: process.env.ELECTRON_WEBPACK_APP_APP_NAME,
    webPreferences: {
        // Prevents renderer process code from not running when window is
        // hidden
        backgroundThrottling: false,
        webSecurity: false,
    }
};

const createMainWindow = () => {
    const window = new BrowserWindow(config);

    if (global.isDev) {
        window.webContents.openDevTools();
        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
    }
    else {
        window.loadURL(formatUrl({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true
        }));
    }

    window.webContents.on('devtools-opened', () => {
        window.focus();
        setImmediate(() => {
            window.focus();
        })
    })

    window.on('blur', () => {
        if (!window.webContents.isDevToolsOpened()) {
            close(window);
        }
    })

    return window;
}

export default createMainWindow;