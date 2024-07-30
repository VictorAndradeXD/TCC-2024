// Função para resumir texto
async function summarizeText(text) {
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
}
module.exports = { summarizeText };