export const Logo = ({ size = 'default' }: { size?: 'default' | 'large' }) => {
  const shapeSize = size === 'large' ? 'w-12 h-12' : 'w-8 h-8';

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col gap-1">
        <div className={`${shapeSize} rounded-full bg-[#D02020] border-4 border-[#121212]`} />
        <div className={`${shapeSize} bg-[#1040C0] border-4 border-[#121212]`} />
        <div
          className={`${shapeSize} bg-[#F0C020] border-4 border-[#121212]`}
          style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
          }}
        />
      </div>
      <span className="font-black text-2xl tracking-tight uppercase">NEXUS</span>
    </div>
  );
};
