
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
    estancia: 'v184731250001021'
};

const postToWebhook = async (name, url, info) => {
    console.log(`\n--- Testing ${name} ---`);
    console.log(`Payload: ${JSON.stringify(info)}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: JSON.stringify(info),
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();

        if (text.trim().startsWith('<')) {
            console.log(`Raw Body (HTML preview): ${text.substring(0, 200)}...`);
        } else {
            console.log(`Raw Body: ${text}`);
        }

        try {
            const json = JSON.parse(text);
            // console.log('Parsed JSON:', JSON.stringify(json, null, 2));
        } catch (e) {
            if (!text.trim().startsWith('<')) console.log('Could not parse JSON');
        }

    } catch (e) {
        console.error(`Error fetching ${url}:`, e);
    }
};

const run = async () => {
    // 1. Test HISTORICO which was missing
    await postToWebhook('HISTORICO', urls.HISTORICO, credentials);

    // 2. Retry CONEXAO with 'estancia'
    await postToWebhook('CONEXAO (estancia)', urls.CONEXAO, credentials);

    // 3. Retry CONEXAO with 'instancia' (common typo/alternative)
    const credsInstance = { ...credentials, instancia: credentials.estancia };
    delete credsInstance.estancia;
    await postToWebhook('CONEXAO (instancia)', urls.CONEXAO, credsInstance);

    // 4. Test PERFIL again to confirm 'telefone' field
    await postToWebhook('PERFIL', urls.PERFIL, credentials);
};

run();
