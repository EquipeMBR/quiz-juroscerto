
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div 
      className="w-full h-1.5 bg-slate-100 sticky top-0 z-[60] overflow-hidden"
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progresso do quiz: ${currentStep} de ${totalSteps}`}
    >
      <div 
        className="h-full bg-gradient-to-r from-[#B5E48C] via-[#34A0A4] to-[#1e293b] transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(52,160,164,0.3)]"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
