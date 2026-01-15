
import React, { useState } from 'react';
import { AgentCredentials } from '../types';

interface AgentFormProps {
  onAddAgent: (agent: Omit<AgentCredentials, 'id'>) => void;
}

const AgentForm: React.FC<AgentFormProps> = ({ onAddAgent }) => {
  const [formData, setFormData] = useState({
    nome: '',
    usuario: '',
    senha: '',
    estancia: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.usuario || !formData.senha || !formData.estancia) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    onAddAgent(formData);
    setFormData({ nome: '', usuario: '', senha: '', estancia: '' });
  };

  return (
    <section className="mb-8">
      <form 
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 p-4 brutal-border flex flex-col xl:flex-row items-center gap-4 brutal-shadow"
      >
        <div className="flex-shrink-0 flex items-center gap-2 pr-4 xl:border-r-3 border-black dark:border-white">
          <span className="material-symbols-outlined font-black">add_circle</span>
          <span className="font-black uppercase text-sm">Novo Agente</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 flex-grow w-full">
          <input 
            className="w-full p-2 text-sm brutal-input font-bold" 
            placeholder="NOME DO AGENTE" 
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
          />
          <input 
            className="w-full p-2 text-sm brutal-input font-bold" 
            placeholder="LOGIN / USUÁRIO" 
            type="text"
            value={formData.usuario}
            onChange={(e) => setFormData({...formData, usuario: e.target.value})}
          />
          <input 
            className="w-full p-2 text-sm brutal-input font-bold" 
            placeholder="SENHA" 
            type="password"
            value={formData.senha}
            onChange={(e) => setFormData({...formData, senha: e.target.value})}
          />
          <input 
            className="w-full p-2 text-sm brutal-input font-bold" 
            placeholder="INSTÂNCIA / URL" 
            type="text"
            value={formData.estancia}
            onChange={(e) => setFormData({...formData, estancia: e.target.value})}
          />
        </div>
        <button 
          type="submit"
          className="btn-brutal bg-primary px-8 py-2 font-black uppercase text-sm whitespace-nowrap w-full xl:w-auto text-white"
        >
          Registrar
        </button>
      </form>
    </section>
  );
};

export default AgentForm;
