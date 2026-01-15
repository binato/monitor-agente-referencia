
import { AgentCredentials, ApiResponse, WebhookEndpoints, AgentStatusData } from '../types';

/**
 * Função auxiliar para extrair dados de forma segura de dentro do campo 'Response'
 */
const extractFromResponse = (data: any, keys: string[]): string | undefined => {
  if (!data) return undefined;
  // Se for uma string (JSON vindo como string), tenta parsear
  let target = data;
  if (typeof data === 'string' && (data.startsWith('{') || data.startsWith('['))) {
    try { target = JSON.parse(data); } catch (e) { target = data; }
  }

  // Busca recursiva ou direta pelas chaves
  for (const key of keys) {
    if (target[key] !== undefined && target[key] !== null) {
      return String(target[key]);
    }
  }
  return undefined;
};

const postToWebhook = async (url: string, credentials: Partial<AgentCredentials>): Promise<ApiResponse> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: credentials.usuario,
        senha: credentials.senha,
        instancia: credentials.estancia // API expects 'instancia'
      }),
    });

    if (!response.ok) return { Response: {} };

    const text = await response.text();
    // Se retornou 200 OK mas sem corpo, assumimos que o sinal de vida foi recebido com sucesso
    // O usuário relatou que o "agente está conectado", então um 200 OK vazio pode significar status OK.
    if (!text || text.trim() === '') {
      return {
        Response: {
          conexao: 'CONECTADO',
          status: 'ATIVO',
          status_agente: 'ATIVO'
        }
      };
    }

    // Tenta parsear o JSON
    try {
      const json = JSON.parse(text);

      // Se for array, pega o primeiro item e envelopa
      if (Array.isArray(json)) {
        return { Response: json.length > 0 ? json[0] : {} };
      }

      // Se já tem a chave Response, retorna como está
      if (json.Response) {
        return json;
      }

      // Caso contrário, envelopa o objeto inteiro no Response
      return { Response: json };

    } catch (e) {
      // Se não for JSON (por exemplo HTML), retorna vazio para evitar erros
      return { Response: {} };
    }
  } catch (e) {
    console.error(`Falha na requisição para ${url}:`, e);
    return { Response: {} };
  }
};

export const fetchAgentStatus = async (credentials: AgentCredentials): Promise<AgentStatusData> => {
  try {
    // Chama as APIs principais. O usuário informou que as informações ficam no campo Response.
    const [conexaoRes, perfilRes, dashRes, historicoRes, refRes] = await Promise.all([
      postToWebhook(WebhookEndpoints.CONEXAO, credentials),
      postToWebhook(WebhookEndpoints.PERFIL, credentials),
      postToWebhook(WebhookEndpoints.DASH_LEADS, credentials),
      postToWebhook(WebhookEndpoints.HISTORICO, credentials),
      postToWebhook(WebhookEndpoints.REFERENCIA, credentials)
    ]);

    const cData = conexaoRes.Response || conexaoRes; // Pode vir direto
    const pData = perfilRes.Response || perfilRes;   // Pode vir direto
    const dData = dashRes.Response || dashRes;       // Pode vir direto
    const hData = historicoRes.Response || historicoRes; // Pode vir direto
    const rData = refRes.Response || {};

    // Mapeamento flexível de WhatsApp
    const whatsapp =
      extractFromResponse(pData, ['whatsapp', 'numero', 'phone', 'wa_number', 'telefone']) ||
      extractFromResponse(rData, ['whatsapp', 'numero']) ||
      'N/A';

    // Mapeamento flexível de Base
    let baseAtiva = '- Nenhuma -';
    // Se for array (historico-tabelas), procurar a ativa
    const hList = Array.isArray(hData) ? hData : (hData.Response && Array.isArray(hData.Response) ? hData.Response : []);

    // Procura por objeto com ativo: true (boolean) ou string "true"
    const ativa = hList.find((b: any) => b.ativo === true || String(b.ativo).toLowerCase() === 'true');

    if (ativa) {
      // Prioriza 'lista_leads', depois 'nome_base'
      baseAtiva = ativa.lista_leads || ativa.nome_base || 'Base Ativa';
    } else {
      baseAtiva = extractFromResponse(dData, ['base_atual', 'nome_base', 'base']) ||
        extractFromResponse(rData, ['base', 'base_ativa']) ||
        '- Nenhuma -';
    }

    // Mapeamento de Conexão
    const rawConexao =
      extractFromResponse(cData, ['status', 'conexao', 'connected']) ||
      extractFromResponse(rData, ['conexao', 'status_conexao']) ||
      '';

    // Mapeamento de Status do Agente
    const rawStatus =
      extractFromResponse(pData, ['status_agente', 'status', 'state']) ||
      extractFromResponse(rData, ['status', 'status_agente']) ||
      '';

    return {
      conexao: parseConexao(rawConexao),
      status: parseStatus(rawStatus),
      whatsapp: whatsapp,
      baseAtiva: baseAtiva,
      lastUpdate: new Date().toLocaleTimeString('pt-BR'),
      loading: false
    };
  } catch (error) {
    return {
      conexao: 'OFFLINE',
      status: 'INATIVO',
      whatsapp: 'Erro na API',
      baseAtiva: 'Indisponível',
      lastUpdate: new Date().toLocaleTimeString('pt-BR'),
      loading: false,
      error: 'Erro de processamento'
    };
  }
};

const parseConexao = (status: string): 'CONECTADO' | 'INSTÁVEL' | 'OFFLINE' => {
  const s = status.toUpperCase();
  if (s.includes('CONECT') || s.includes('ON') || s.includes('TRUE') || s.includes('ATIVO') || s.includes('SUCCESS')) return 'CONECTADO';
  if (s.includes('INST') || s.includes('WARN') || s.includes('WAIT')) return 'INSTÁVEL';
  return 'OFFLINE';
};

const parseStatus = (status: string): 'ATIVO' | 'PAUSA' | 'INATIVO' => {
  const s = status.toUpperCase();
  if (s.includes('ATIVO') || s.includes('ACTIVE') || s.includes('TRABALHANDO')) return 'ATIVO';
  if (s.includes('PAUSA') || s.includes('PAUSE') || s.includes('ALMOCO')) return 'PAUSA';
  return 'INATIVO';
};
