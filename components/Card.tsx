import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon, active, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl border transition-all duration-300
        ${active 
          ? 'bg-slate-800/80 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
          : 'bg-slate-900/60 border-white/5 hover:border-white/10 hover:bg-slate-800/60'
        }
        backdrop-blur-sm p-4 ${className}
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className={`
              p-2 rounded-full 
              ${active ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/50 text-slate-400'}
            `}>
              {icon}
            </div>
          )}
          {title && <h3 className="text-lg font-medium text-slate-200">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  );
};