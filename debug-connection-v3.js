
const urls = {
    CONEXAO: 'https://wh.agenciamiro.online/webhook/conexao-agente',
    PERFIL: 'https://wh.agenciamiro.online/webhook/perfil-agente',
    DASH_LEADS: 'https://wh.agenciamiro.online/webhook/dash-leads',
    REFERENCIA: 'https://wh.agenciamiro.online/webhook/anhanguera-referencia',
    HISTORICO: 'https://wh.agenciamiro.online/webhook/historico-tabelas'
};

const credentials = {
    usuario: 'adrian@anhanguerasp.com.br',
    senha: 'miro123',
    instancia: 'v184731250001021'
};

const postToWebhook = async (name, url, info) => {
    console.log(`\n--- Testing ${name} ---`);
    // console.log(`Payload: ${JSON.stringify(info)}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(info),
            signal: AbortSignal.timeout(10000)
        });

        console.log(`Status: ${response.status}`);
        const text = await response.text();
        if (!text) console.log('Raw Body is EMPTY string');
        else console.log(`Raw Body: ${text}`);

    } catch (e) {
        console.error(`Error fetching ${url}:`, e);
    }
};

const run = async () => {
    // Retry all with 'instancia'
    await postToWebhook('CONEXAO', urls.CONEXAO, credentials);
    await postToWebhook('PERFIL', urls.PERFIL, credentials);
    await postToWebhook('HISTORICO', urls.HISTORICO, credentials);
};

run();
