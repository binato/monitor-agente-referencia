
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AgentForm from './components/AgentForm';
import AgentTable from './components/AgentTable';
import { MonitoredAgent, AgentCredentials } from './types';
import { fetchAgentStatus } from './services/apiService';

const LOCAL_STORAGE_KEY = 'monitored_agents_v2';

const App: React.FC = () => {
  const [agents, setAgents] = useState<MonitoredAgent[]>([]);
  const [isUpdatingAll, setIsUpdatingAll] = useState(false);

  // Carrega do localStorage apenas no início
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const sanitized = parsed.map((a: MonitoredAgent) => ({
          ...a,
          data: { ...a.data, loading: false }
        }));
        setAgents(sanitized);
      } catch (e) {
        console.error("Erro ao carregar agentes", e);
      }
    } else {
      const example: MonitoredAgent = {
        id: 'example-' + Date.now(),
        nome: 'POLO RIO CLARO (EXEMPLO)',
        usuario: 'adrian@anhanguerasp.com.br',
        senha: 'miro123',
        estancia: 'v184731250001021',
        data: {
          conexao: 'OFFLINE',
          status: 'INATIVO',
          whatsapp: 'Aguardando atualização',
          baseAtiva: 'Principal',
          lastUpdate: '',
          loading: false
        }
      };
      setAgents([example]);
    }
  }, []);

  // Salva no localStorage sempre que o estado de agentes mudar
  useEffect(() => {
    if (agents.length >= 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(agents));
    }
  }, [agents]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  const handleAddAgent = (cred: Omit<AgentCredentials, 'id'>) => {
    const newAgent: MonitoredAgent = {
      ...cred,
      id: 'agent-' + Date.now() + Math.random().toString(36).substr(2, 9),
      data: {
        conexao: 'OFFLINE',
        status: 'INATIVO',
        whatsapp: 'Clique em Atualizar',
        baseAtiva: 'Nenhuma',
        lastUpdate: '',
        loading: false
      }
    };
    setAgents(prev => [...prev, newAgent]);
  };

  const handleRemoveAgent = (id: string) => {
    // Removendo o confirm para evitar bloqueios de thread ou problemas de UI
    const updated = agents.filter(a => a.id !== id);
    setAgents(updated);
  };

  const updateAgentData = async (agent: MonitoredAgent) => {
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, data: { ...a.data, loading: true } } : a));

    try {
      const newData = await fetchAgentStatus(agent);
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, data: newData } : a));
    } catch (err) {
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, data: { ...a.data, loading: false, error: 'Erro' } } : a));
    }
  };

  const handleRefreshAll = async () => {
    if (agents.length === 0) return;
    setIsUpdatingAll(true);

    const promises = agents.map(agent => updateAgentData(agent));
    await Promise.all(promises);

    setIsUpdatingAll(false);
  };

  const connectedCount = agents.filter(a => a.data.conexao === 'CONECTADO').length;
  const disconnectedCount = agents.filter(a => a.data.conexao === 'OFFLINE' || a.data.conexao === 'INSTÁVEL').length;

  return (
    <main className="w-full max-w-[1600px] mx-auto p-6 md:p-8">
      <Header onToggleTheme={toggleTheme} />

      <AgentForm onAddAgent={handleAddAgent} />

      <section>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-black uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-4xl">list_alt</span>
            Painel de Controle
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white dark:bg-zinc-900 p-3 brutal-border brutal-shadow">
            <div className="text-sm font-black uppercase px-2 flex items-center justify-center">
              Agentes:
              <span className="ml-2 font-bold px-2 py-0.5">
                {agents.length}
              </span>
            </div>
            <button
              onClick={handleRefreshAll}
              disabled={isUpdatingAll}
              className={`btn-brutal px-6 py-2 font-black uppercase text-sm flex items-center justify-center gap-2 bg-primary text-white ${isUpdatingAll ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}`}
            >
              <span className={`material-symbols-outlined text-sm ${isUpdatingAll ? 'animate-spin' : ''}`}>sync</span>
              {isUpdatingAll ? 'Sincronizando...' : 'Atualizar Tudo'}
            </button>
          </div>
        </div>

        <AgentTable
          agents={agents}
          onRemoveAgent={handleRemoveAgent}
          isUpdating={isUpdatingAll}
        />
      </section>

      <footer className="mt-12 text-center text-xs font-bold opacity-40 uppercase tracking-widest pb-8">
        Referência © {new Date().getFullYear()} - Sistema de Monitoramento Integrado
      </footer>
    </main>
  );
};

export default App;
