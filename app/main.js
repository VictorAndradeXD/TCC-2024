import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { summarizeText } from './sumarize.js';

const execPromise = promisify(exec);

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile(path.join(__dirname, 'index.html'));
}

ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Áudio', extensions: ['mp3', 'mp4', 'flac', 'wav', 'ogg'] }],
    });
    return result;
});

ipcMain.handle('transcreverAudio', async (event, filePath) => {
    try {
        const { stdout } = await execPromise(`python3 /home/victor/UFPI/TCC-2024/app/transcricao.py "${filePath}"`);
        return stdout.trim() || 'Erro na transcrição.';
    } catch (error) {
        console.error('Erro ao transcrever o áudio:', error);
        return null;
    }
});

ipcMain.handle('sumarizarTexto', async (event, { transcription, type }) => {
    if (!transcription) return null;
    try {
        const summary = await summarizeText({ text: transcription, type });
        return summary;
    } catch (error) {
        console.error('Erro ao sumarizar o texto:', error);
        return null;
    }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
