"use strict";
const { exec } = require("child_process");
const { GoogleASR } = require("./googleASR");
const { summarizeText } = require("./sumarize"); // Corrija o caminho se necessário
const path = require("path");

// Defina os caminhos dos arquivos de entrada e saída
const inputFile = path.join(__dirname, '..', 'audios', 'audio.m4a');
const outputFile = path.join(__dirname, '..', 'audios', 'audio.flac');

function audioParser(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
        const ffmpegProcess = exec(`ffmpeg -i ${inputFile} -acodec flac -ar 16000 -ac 1 ${outputFile}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro: ${stderr}`);
                reject(`O processo ffmpeg falhou com o código de saída: ${error.code}`);
                return;
            }

            console.log('Arquivo convertido com sucesso:', outputFile);
            resolve(outputFile);
        });
    });
}

async function getTextFromAudio(audioPath) {
    if (typeof audioPath !== 'string') return;
    const response = await GoogleASR({
        audioFilepath: audioPath,
    });
    if (response !== null && response.type === 'success') {
        return response.alternative[0].transcript;
    }
}

async function start() {
    try {
        console.log('Caminho do arquivo de entrada:', inputFile);
        console.log('Convertendo o audio');
        const parsedFile = await audioParser(inputFile, outputFile);
        console.log('Transcrevendo o audio');
        const text = await getTextFromAudio(parsedFile);

        console.log("TEXTO ANTES DE SUMARIZAR:", text);

        if (text) {
            const summary = await summarizeText(text);
            console.log("TEXTO SUMARIZADO:", summary);
        } else {
            console.log("Texto não foi obtido do áudio.");
        }
    } catch (error) {
        console.error('Erro no processo:', error);
    }
}

start();
