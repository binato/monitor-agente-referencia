
export interface AgentCredentials {
  id: string;
  nome: string;
  usuario: string;
  senha: string;
  estancia: string;
}

export interface AgentStatusData {
  conexao: 'CONECTADO' | 'INSTÁVEL' | 'OFFLINE';
  status: 'ATIVO' | 'PAUSA' | 'INATIVO';
  whatsapp: string;
  baseAtiva: string;
  lastUpdate: string;
  loading: boolean;
  error?: string;
}

export interface MonitoredAgent extends AgentCredentials {
  data: AgentStatusData;
}

export interface ApiResponse {
  Response?: any;
}

export enum WebhookEndpoints {
  REFERENCIA = 'https://wh.agenciamiro.online/webhook/anhanguera-referencia',
  CONEXAO = 'https://wh.agenciamiro.online/webhook/conexao-agente',
  PERFIL = 'https://wh.agenciamiro.online/webhook/perfil-agente',
  HISTORICO = 'https://wh.agenciamiro.online/webhook/historico-tabelas',
  DASH_LEADS = 'https://wh.agenciamiro.online/webhook/dash-leads'
}
