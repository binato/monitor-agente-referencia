
import React from 'react';

interface HeaderProps {
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleTheme }) => {
  return (
    <header className="mb-8 border-b-4 border-black dark:border-white pb-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-white rounded-full brutal-border flex items-center justify-center overflow-hidden brutal-shadow flex-shrink-0">
          <img 
            alt="Referencia Logo" 
            className="w-12 h-12" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuqlpJNz2M2sNYMDIsQlVvYy_yW3SvRCKCMYWl0JP-5Hr5abJe0CkysC8RxoL9I-OorUv4JeOe1FyPMV291U-IK8LFytmlRfb-zjUz-ugEflhi5WggevkiantJ8AlQAAxyQ90ioXaO4bOyPJLPWaVOfifNnhKmQADm9BCjgjK6FXxnBaDiC7H_m10oiKN1VrJ2j1EHU-CDec3Ge6rkN-vbETj1LBtGhKB9XVsBFLHHw_yG-UHaw5E38wRGmnXHnNKnoJ1aRTKUNyWT" 
          />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-1">Monitoramento</h1>
          <p className="text-lg font-bold text-primary uppercase">Referencia - Monitoramento dos Agentes</p>
        </div>
      </div>
      <button 
        className="btn-brutal bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white flex items-center justify-center gap-2 py-2 px-6 font-black"
        onClick={onToggleTheme}
      >
        <span className="material-symbols-outlined">contrast</span> TEMA
      </button>
    </header>
  );
};

export default Header;
