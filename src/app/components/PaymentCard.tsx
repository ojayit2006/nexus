import { BauhausButton } from './BauhausButton';
import { toast } from 'sonner';

interface PaymentCardProps {
  title: string;
  amount: number;
  buttonVariant: 'red' | 'blue' | 'yellow';
  buttonText: string;
}

export const PaymentCard = ({ title, amount, buttonVariant, buttonText }: PaymentCardProps) => {
  return (
    <div
      className="bg-white border-4 border-[#121212] p-6 flex flex-col gap-4"
      style={{ boxShadow: '8px 8px 0px 0px #121212' }}
    >
      <p className="font-bold uppercase tracking-widest text-xs">{title}</p>
      <p className="font-black text-5xl">₹{amount.toLocaleString()}</p>
      <BauhausButton 
        variant={buttonVariant} 
        className="w-full"
        onClick={() => toast.success(`Payment successful: ₹${amount.toLocaleString()} for ${title}`)}
      >
        {buttonText}
      </BauhausButton>
    </div>
  );
};

