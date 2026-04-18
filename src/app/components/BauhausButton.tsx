import { ReactNode } from 'react';

interface BauhausButtonProps {
  children: ReactNode;
  variant?: 'red' | 'blue' | 'yellow' | 'outline';
  className?: string;
  onClick?: () => void;
}

export const BauhausButton = ({
  children,
  variant = 'red',
  className = '',
  onClick
}: BauhausButtonProps) => {
  const variants = {
    red: 'bg-[#D02020] text-white border-[#121212]',
    blue: 'bg-[#1040C0] text-white border-[#121212]',
    yellow: 'bg-[#F0C020] text-[#121212] border-[#121212]',
    outline: 'bg-white text-[#121212] border-[#121212]'
  };

  return (
    <button
      onClick={onClick}
      className={`
        px-8 py-4
        font-bold uppercase tracking-wide text-sm
        border-4 ${variants[variant]}
        transition-all duration-150
        hover:translate-x-[-2px] hover:translate-y-[-2px]
        active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
        ${className}
      `}
      style={{
        boxShadow: '4px 4px 0px 0px #121212'
      }}
    >
      {children}
    </button>
  );
};
