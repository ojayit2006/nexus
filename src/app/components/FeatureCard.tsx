import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  decorationColor: 'red' | 'blue' | 'yellow';
  decorationShape: 'circle' | 'square' | 'triangle';
}

export const FeatureCard = ({
  icon,
  title,
  description,
  decorationColor,
  decorationShape
}: FeatureCardProps) => {
  const colors = {
    red: '#D02020',
    blue: '#1040C0',
    yellow: '#F0C020'
  };

  const getDecorationStyle = () => {
    const color = colors[decorationColor];
    const base = 'absolute top-0 right-0 w-3 h-3 border-2 border-[#121212]';

    if (decorationShape === 'circle') return `${base} rounded-full bg-[${color}]`;
    if (decorationShape === 'triangle') return base;
    return `${base} bg-[${color}]`;
  };

  return (
    <div
      className="relative bg-white border-4 border-[#121212] p-6 hover:-translate-y-1 transition-transform"
      style={{ boxShadow: '8px 8px 0px 0px #121212' }}
    >
      <div
        className={decorationShape === 'circle' ? 'absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-[#121212]' :
                   decorationShape === 'triangle' ? 'absolute top-0 right-0 w-3 h-3 border-2 border-[#121212]' :
                   'absolute top-0 right-0 w-3 h-3 border-2 border-[#121212]'}
        style={{
          backgroundColor: colors[decorationColor],
          clipPath: decorationShape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined
        }}
      />

      <div className="border-4 border-[#121212] w-16 h-16 flex items-center justify-center bg-white mb-4">
        {icon}
      </div>

      <h3 className="font-bold uppercase tracking-wide text-sm mb-2">{title}</h3>
      <p className="font-medium text-base leading-relaxed">{description}</p>
    </div>
  );
};
