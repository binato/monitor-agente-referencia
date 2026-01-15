
import React from 'react';
import { MonitoredAgent } from '../types';

interface AgentTableProps {
  agents: MonitoredAgent[];
  onRemoveAgent: (id: string) => void;
  isUpdating: boolean;
}

const AgentTable: React.FC<AgentTableProps> = ({ agents, onRemoveAgent, isUpdating }) => {
  return (
    <div className="overflow-x-auto brutal-border brutal-shadow">
      <table className="w-full text-left bg-white dark:bg-zinc-900 border-collapse">
        <thead>
          <tr className="border-b-3 border-black dark:border-white uppercase font-black text-sm">
            <th className="p-4 border-r-3 border-black dark:border-white bg-primary text-white">Agente</th>
            <th className="p-4 border-r-3 border-black dark:border-white">Conexão</th>
            <th className="p-4 border-r-3 border-black dark:border-white">WhatsApp</th>
            <th className="p-4 border-r-3 border-black dark:border-white">Base Ativa</th>
            <th className="p-4 text-center">Remover</th>
          </tr>
        </thead>
        <tbody className="font-bold">
          {agents.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-zinc-500 uppercase italic">
                Nenhum agente registrado para monitoramento.
              </td>
            </tr>
          ) : (
            agents.map((agent) => (
              <tr
                key={agent.id}
                className={`border-b-3 border-black dark:border-white hover:bg-primary/5 transition-colors ${agent.data.loading ? 'opacity-50' : ''}`}
              >
                <td className="p-4 border-r-3 border-black dark:border-white uppercase tracking-tight">
                  <div className="flex flex-col">
                    <span>{agent.nome}</span>
                    <span className="text-[10px] opacity-40 font-normal">{agent.usuario}</span>
                  </div>
                </td>
                <td className="p-4 border-r-3 border-black dark:border-white">
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-none brutal-border ${agent.data.conexao === 'CONECTADO' ? 'bg-green-500' :
                        agent.data.conexao === 'INSTÁVEL' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></span>
                    <span className={
                      agent.data.conexao === 'CONECTADO' ? 'text-green-600' :
                        agent.data.conexao === 'INSTÁVEL' ? 'text-yellow-600' : 'text-red-600'
                    }>
                      {agent.data.conexao}
                    </span>
                  </div>
                </td>
                <td className="p-4 border-r-3 border-black dark:border-white">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600 text-lg">chat</span>
                    {agent.data.whatsapp}
                  </div>
                </td>
                <td className="p-4 border-r-3 border-black dark:border-white">
                  <div className="flex flex-col">
                    <span className="text-[10px] opacity-60 uppercase">Base:</span>
                    <span className="text-sm">{agent.data.baseAtiva}</span>
                    {agent.data.lastUpdate && (
                      <span className="text-[9px] opacity-40 italic">Atu: {agent.data.lastUpdate}</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => onRemoveAgent(agent.id)}
                    className="p-2 bg-red-500 text-white brutal-border hover:bg-red-600 transition-colors btn-brutal shadow-none"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AgentTable;
