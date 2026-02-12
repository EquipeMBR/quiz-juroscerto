
import React from 'react';

interface QuizCardProps {
  label: string;
  index: number;
  onClick: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ label, index, onClick }) => {
  const [title, description] = label.split(': ');

  const colors = [
    { 
      border: 'border-blue-100', 
      hoverBorder: 'hover:border-blue-400', 
      bg: 'bg-white', 
      iconBg: 'bg-blue-50', 
      iconText: 'text-blue-600', 
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /> 
    },
    { 
      border: 'border-indigo-100', 
      hoverBorder: 'hover:border-indigo-400', 
      bg: 'bg-white', 
      iconBg: 'bg-indigo-50', 
      iconText: 'text-indigo-600', 
      icon: <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" /> 
    },
    { 
      border: 'border-emerald-100', 
      hoverBorder: 'hover:border-emerald-400', 
      bg: 'bg-white', 
      iconBg: 'bg-emerald-50', 
      iconText: 'text-emerald-600', 
      icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /> 
    },
    { 
      border: 'border-slate-200', 
      hoverBorder: 'hover:border-slate-400', 
      bg: 'bg-white', 
      iconBg: 'bg-slate-50', 
      iconText: 'text-slate-600', 
      icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></> 
    },
  ];

  const style = colors[index % colors.length];

  return (
    <button
      onClick={onClick}
      className={`group w-full p-5 sm:p-6 text-left border ${style.border} ${style.hoverBorder} ${style.bg} rounded-[24px] transition-all duration-300 flex items-start sm:items-center gap-4 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-slate-100 h-full shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-0.5`}
    >
      <div 
        aria-hidden="true"
        className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border border-white flex items-center justify-center ${style.iconBg} ${style.iconText} transition-all shadow-sm group-hover:bg-slate-900 group-hover:text-white`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {style.icon}
        </svg>
      </div>
      <div className="flex-1 flex flex-col pt-0.5 sm:pt-0">
        <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
          {title}
        </span>
        {description && (
          <span className="text-xs sm:text-sm font-medium text-slate-500 leading-snug">
            {description}
          </span>
        )}
      </div>
    </button>
  );
};

export default QuizCard;
