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

ipcMain.handle('compareWithCorrectData', async (event, { transcription, abstractiveSummary, extractiveSummary, filePath }) => {
    const correctDataPath = path.join(__dirname, 'correct_data.json');
    const pythonScriptPath = path.join(__dirname, 'calculate_rouge.py');

    if (!transcription || !abstractiveSummary || !extractiveSummary || !filePath) {
        return { error: 'Parâmetros inválidos fornecidos para comparação.' };
    }

    // Extract base filename without extension (e.g., "M_001" from "M_001.mp3")
    const baseFilename = path.basename(filePath, path.extname(filePath));

    try {
        const { stdout } = await execPromise(
            `python3 "${pythonScriptPath}" "${correctDataPath}" "${baseFilename}" "${transcription}" "${abstractiveSummary}" "${extractiveSummary}"`
        );
        const result = JSON.parse(stdout);

        if (result.error) {
            console.error('Erro ao calcular ROUGE:', result.error);
            return { error: result.error };
        }

        return result;
    } catch (error) {
        console.error('Erro ao calcular ROUGE:', error.message, error.stderr || '');
        return { error: 'Erro ao calcular ROUGE. Verifique o console para mais detalhes.' };
    }
});

// Handle file selection dialog
ipcMain.handle('dialog:openFile', async () => {
    try {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Áudio', extensions: ['mp3', 'mp4', 'flac', 'wav', 'ogg'] }],
        });
        return result.canceled ? null : result.filePaths[0];
    } catch (error) {
        console.error('Erro ao abrir arquivo:', error.message);
        return null;
    }
});

// Handle audio transcription
ipcMain.handle('transcreverAudio', async (event, filePath) => {
    const pythonScriptPath = path.join(__dirname, 'transcricao.py');

    if (!filePath) return { error: 'Erro: Caminho do arquivo não fornecido.' };

    try {
        const { stdout } = await execPromise(`python3 "${pythonScriptPath}" "${filePath}"`);
        return stdout.trim() || { error: 'Erro na transcrição.' };
    } catch (error) {
        console.error('Erro ao transcrever o áudio:', error.message);
        return { error: 'Erro ao transcrever o áudio.' };
    }
});

// Handle text summarization
ipcMain.handle('sumarizarTexto', async (event, { transcription, type }) => {
    if (!transcription) return { error: 'Erro: Transcrição vazia.' };
    if (!['abstractive', 'extractive'].includes(type)) {
        return { error: 'Erro: Tipo de sumarização inválido.' };
    }

    try {
        const summary = await summarizeText({ text: transcription, type });
        return summary;
    } catch (error) {
        console.error('Erro ao sumarizar o texto:', error.message);
        return { error: `Erro ao realizar sumarização ${type}.` };
    }
});

// Initialize app
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
