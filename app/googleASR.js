"use strict";
const querystring = require('querystring');
const fs = require('fs');
const axios = require('axios');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

const GOOGLE_ASR_URL = 'http://www.google.com/speech-api/v2/recognize?';
const DEFAULT_CLIENT = 'chromium';
const DEFAULT_CONTENT_TYPE = 'audio/x-flac; rate=16000;';
const DEFAULT_DEVELOPER_KEY = 'AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw';
const DEFAULT_LANGUAGE = 'pt-br';
const DEFAULT_PROFANITY_FILTER = 0;
const DEFAULT_OUTPUT = 'json';

async function GoogleASR(options) {
    if (options?.audioFilepath === '') {
        throw new Error('audioFilepath is required');
    }
    const file = {
        path: options.audioFilepath,
        contentType: options.contentType ?? DEFAULT_CONTENT_TYPE,
    };
    const params = {
        client: options.client ?? DEFAULT_CLIENT,
        key: options.key ?? DEFAULT_DEVELOPER_KEY,
        lang: options.language ?? DEFAULT_LANGUAGE,
        pFilter: options.profanityFilter ?? DEFAULT_PROFANITY_FILTER,
        output: options.output ?? DEFAULT_OUTPUT,
    };
    const fullUrl = GOOGLE_ASR_URL + querystring.encode(params);
    const data = await readFileAsync(file.path);
    const response = await axios.post(fullUrl, data, {
        headers: {
            'Content-Type': file.contentType,
        },
    });
    const responseString = response.data;
    if (typeof responseString !== 'string')
        return responseString;
    if (options?.raw ?? false) {
        return { type: 'raw', result: responseString };
    }
    let actualResult = null;
    const lines = responseString.split('\n');
    for (const line of lines) {
        if (line.length <= 0)
            continue;
        const parsed = JSON.parse(line);
        if (parsed.result.length !== 0) {
            actualResult = parsed.result[0];
            break;
        }
    }
    if (actualResult == null)
        return actualResult;
    return { ...actualResult, type: 'success' };
}
module.exports = { GoogleASR };