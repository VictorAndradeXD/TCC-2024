import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function summarizeText({ text, type }) {
    if (type === 'abstractive') {
        const fetch = (await import('node-fetch')).default;
        const maxRetries = 5;
        const waitTime = 10000; // Tempo de espera em milissegundos (10 segundos)

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch('https://api-inference.huggingface.co/models/recogna-nlp/ptt5-base-summ-xlsum', {
                    headers: {
                        'Authorization': 'Bearer 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',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({ inputs: text })
                });

                if (!response.ok) {
                    const errorDetail = await response.text();
                    if (response.status === 503) {
                        const errorData = JSON.parse(errorDetail);
                        console.log(`Attempt ${attempt}: Model is loading. Estimated time: ${errorData.estimated_time} seconds`);
                        if (attempt < maxRetries) {
                            await new Promise(resolve => setTimeout(resolve, waitTime));
                            continue;
                        } else {
                            throw new Error(`Model still loading after ${maxRetries} attempts.`);
                        }
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetail}`);
                    }
                }

                const result = await response.json();

                if (!result || !result[0] || !result[0].summary_text) {
                    throw new Error('Unexpected response format');
                }

                return result[0].summary_text;

            } catch (error) {
                if (attempt >= maxRetries) {
                    console.error('Error:', error.message);
                    throw error;
                }
            }
        }
    } else if (type === 'extractive') {
        try {
            const { stdout } = await execPromise(`/home/victor/TCC/python_env/bin/python /home/victor/TCC/app/summarize_extractive.py "${text}"`);
            return stdout.trim();
        } catch (error) {
            console.error('Erro ao sumarizar o texto:', error);
            return null;
        }
    }
}
