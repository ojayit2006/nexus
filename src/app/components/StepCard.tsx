import { ReactNode } from 'react';

interface StepCardProps {
  stepNumber: number;
  icon: ReactNode;
  title: string;
}

export const StepCard = ({ stepNumber, icon, title }: StepCardProps) => {
  return (
    <div
      className="relative bg-white border-4 border-[#121212] p-6 flex flex-col items-center text-center gap-4"
      style={{ boxShadow: '8px 8px 0px 0px #121212' }}
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-[#D02020] border-4 border-[#121212]"
          style={{ transform: 'rotate(45deg)' }}
        />
        <span
          className="relative z-10 font-black text-3xl text-white"
          style={{ transform: 'rotate(0deg)' }}
        >
          {stepNumber}
        </span>
      </div>
      <div className="text-[#121212] mb-2">{icon}</div>
      <h3 className="font-bold uppercase tracking-wide text-xs leading-tight">
        {title}
      </h3>
    </div>
  );
};
