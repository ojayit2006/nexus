import React, { useState } from 'react';
import { useNexus, Due, Payment } from '../../context/NexusContext';
import { 
  CreditCard, 
  ArrowRight, 
  WalletCards, 
  CheckCircle2, 
  Download,
  Receipt,
  X,
  Loader2,
  ShieldCheck
} from 'lucide-react';

export function Payments() {
  const { profile, dues, payments, payDue } = useNexus();
  const [payModal, setPayModal] = useState<Due | null>(null);
  const [processing, setProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<Payment | null>(null);
  const [viewReceipt, setViewReceipt] = useState<Payment | null>(null);

  const simulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModal) return;

    setProcessing(true);
    
    // Simulate API Call
    setTimeout(() => {
      setProcessing(false);
      const targetId = payModal.id;
      setPayModal(null);
      payDue(targetId);
      
      // Need to find the newly created payment to show receipt.
      // Since context updates asynchronously, we'll construct a mock receipt representing what we just did for the success screen.
      const mockNewPayment: Payment = {
        id: `mock_${Date.now()}`,
        department: payModal.department,
        amount: payModal.amount,
        date: new Date().toLocaleString(),
        receiptNo: `RCPT-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Completed',
        type: payModal.department.toLowerCase().includes('library') ? 'fine' : 'repair'
      };
      
      setSuccessReceipt(mockNewPayment);
    }, 2000);
  };

  const closeSuccess = () => {
    setSuccessReceipt(null);
  };

  const ReceiptView = ({ payment, onClose }: { payment: Payment, onClose: () => void }) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212]">
         <div className="bg-[#121212] text-white p-4 flex justify-between items-center">
            <h2 className="font-black text-sm uppercase tracking-widest flex items-center gap-2"><Receipt className="w-4 h-4" /> Receipt {payment.receiptNo}</h2>
            <button onClick={onClose} className="hover:text-[#D02020]"><X className="w-5 h-5" /></button>
         </div>
         <div className="p-8 relative bg-mesh">
             <div className="absolute top-8 right-8 w-24 h-24 border-4 border-[#D02020] text-[#D02020] rounded-full flex items-center justify-center font-black text-xl uppercase tracking-widest opacity-20 -rotate-12 select-none pointer-events-none">Paid</div>
             
             <div className="text-center mb-8 border-b-2 border-dashed border-[#E0E0E0] pb-6">
               <div className="w-16 h-16 bg-[#1040C0] rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-[#121212]">
                 <CheckCircle2 className="w-8 h-8 text-white" />
               </div>
               <h3 className="font-black text-2xl uppercase tracking-tight text-[#121212]">₹{payment.amount}</h3>
               <p className="font-bold text-xs uppercase tracking-widest opacity-60 mt-1">Payment Successful</p>
             </div>

             <div className="space-y-4 font-medium text-sm">
               <div className="flex justify-between border-b border-[#E0E0E0] pb-2">
                 <span className="opacity-60">Student</span>
                 <span className="font-bold">{profile.name} ({profile.rollNo})</span>
               </div>
               <div className="flex justify-between border-b border-[#E0E0E0] pb-2">
                 <span className="opacity-60">Department</span>
                 <span className="font-bold">{payment.department}</span>
               </div>
               <div className="flex justify-between border-b border-[#E0E0E0] pb-2">
                 <span className="opacity-60">Date & Time</span>
                 <span className="font-bold whitespace-nowrap">{payment.date}</span>
               </div>
             </div>

             <button onClick={() => { alert('Downloading PDF receipt...'); onClose(); }} className="w-full mt-8 py-4 bg-[#F0C020] border-4 border-[#121212] font-black uppercase text-sm tracking-wider flex items-center justify-center gap-2 hover:shadow-[4px_4px_0px_0px_#121212] transition-all hover:-translate-y-1">
               <Download className="w-5 h-5" /> Download Receipt
             </button>
         </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      
      <div>
        <h1 className="font-black text-3xl md:text-5xl uppercase tracking-tight mb-2">Payments & Dues</h1>
        <p className="text-lg font-medium opacity-80">Clear all pending financial holds safely and instantly.</p>
      </div>

      {/* Dues Section */}
      <div>
        <h2 className="font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-2">
          <span className="w-4 h-4 bg-[#D02020] inline-block border-2 border-[#121212]" />
          Action Required
        </h2>
        
        {dues.length === 0 ? (
          <div className="bg-[#1040C0]/10 border-4 border-[#1040C0] p-8 flex items-center justify-center">
             <div className="text-center">
                <CheckCircle2 className="w-12 h-12 text-[#1040C0] mx-auto mb-4" />
                <h3 className="font-black text-xl uppercase tracking-tight text-[#1040C0]">All Dues Cleared</h3>
                <p className="font-bold text-sm mt-1 opacity-80">You have no pending payments.</p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dues.map((due) => (
              <div key={due.id} className="bg-white border-4 border-[#121212] flex flex-col hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#121212] transition-all duration-200">
                <div className="p-5 border-b-4 border-[#121212] flex justify-between items-start">
                   <div>
                     <p className="font-bold text-xs uppercase tracking-widest opacity-60 mb-1">{due.department}</p>
                     <h3 className="font-black text-3xl tracking-tight">₹{due.amount}</h3>
                   </div>
                   <div className="p-3 bg-[#F0F0F0] border-2 border-[#121212]">
                     <WalletCards className="w-6 h-6" />
                   </div>
                </div>
                <div className="p-5 flex-1">
                   <p className="font-medium text-sm mb-4">Reason: <span className="font-bold">{due.reason}</span></p>
                   <div className="inline-block px-2 py-1 bg-[#D02020]/10 text-[#D02020] border-2 border-[#D02020] font-bold text-xs uppercase tracking-wider">
                     Due: {due.dueDate}
                   </div>
                </div>
                <button 
                  onClick={() => setPayModal(due)}
                  className="w-full py-4 bg-[#D02020] text-white border-t-4 border-[#121212] font-black uppercase text-sm tracking-wider flex justify-center items-center gap-2 hover:bg-red-700 transition"
                >
                  Pay Now <ArrowRight className="w-4 h-4 border-2 border-white rounded-full p-0.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History */}
      <div>
        <h2 className="font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-2">
          <span className="w-4 h-4 bg-[#121212] inline-block border-2 border-[#121212]" />
          Payment History
        </h2>
        
        <div className="bg-white border-4 border-[#121212] overflow-hidden shadow-[4px_4px_0px_0px_#121212]">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#121212] text-white">
                    <th className="p-4 font-black uppercase text-xs tracking-widest border-r-2 border-[#121212]/20">Date</th>
                    <th className="p-4 font-black uppercase text-xs tracking-widest border-r-2 border-[#121212]/20">Department</th>
                    <th className="p-4 font-black uppercase text-xs tracking-widest border-r-2 border-[#121212]/20">Amount</th>
                    <th className="p-4 font-black uppercase text-xs tracking-widest border-r-2 border-[#121212]/20">Receipt No</th>
                    <th className="p-4 font-black uppercase text-xs tracking-widest border-r-2 border-[#121212]/20">Status</th>
                    <th className="p-4 font-black uppercase text-xs tracking-widest w-24"></th>
                  </tr>
                </thead>
                <tbody className="font-medium text-sm">
                  {payments.map(payment => (
                    <tr key={payment.id} className="border-b-2 border-[#E0E0E0] hover:bg-[#F0F0F0]">
                      <td className="p-4 border-r-2 border-[#E0E0E0]">{payment.date}</td>
                      <td className="p-4 font-bold uppercase tracking-tight border-r-2 border-[#E0E0E0]">{payment.department}</td>
                      <td className="p-4 border-r-2 border-[#E0E0E0] font-bold">₹{payment.amount}</td>
                      <td className="p-4 border-r-2 border-[#E0E0E0] uppercase text-xs tracking-wider opacity-70">{payment.receiptNo}</td>
                      <td className="p-4 border-r-2 border-[#E0E0E0]">
                        <span className="inline-block px-2 py-1 bg-[#1040C0]/10 text-[#1040C0] font-bold text-[10px] uppercase tracking-wider border-2 border-[#1040C0]">
                          {payment.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                         <button onClick={() => setViewReceipt(payment)} className="font-bold uppercase text-[10px] tracking-widest hover:underline text-[#1040C0]">View Receipt</button>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                     <tr>
                       <td colSpan={6} className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">No payment records found.</td>
                     </tr>
                  )}
                </tbody>
             </table>
           </div>
        </div>
      </div>

      {/* Payment Checkout Sandbox Modal */}
      {payModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => !processing && setPayModal(null)} />
          <div className="relative bg-[#F9F9F9] w-full max-w-md border-4 border-[#121212] flex flex-col shadow-[12px_12px_0px_0px_rgba(0,0,0,0.5)]">
             <div className="bg-[#121212] text-white p-5 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-[#F0C020]" />
                 <h2 className="font-black text-sm uppercase tracking-widest">Secure Checkout</h2>
               </div>
               {!processing && <button onClick={() => setPayModal(null)} className="hover:text-[#D02020]"><X className="w-5 h-5" /></button>}
             </div>
             
             {processing ? (
               <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                 <Loader2 className="w-12 h-12 text-[#1040C0] animate-spin mb-6" />
                 <h3 className="font-black text-xl uppercase tracking-tight mb-2">Processing Payment</h3>
                 <p className="text-sm font-medium opacity-60 text-center">Do not close this window...</p>
                 <div className="flex gap-1 mt-6">
                   <div className="w-2 h-2 rounded-full bg-[#121212] animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-2 h-2 rounded-full bg-[#121212] animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-2 h-2 rounded-full bg-[#121212] animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>
               </div>
             ) : (
               <form onSubmit={simulatePayment} className="p-6 flex flex-col">
                 <div className="bg-white border-2 border-[#121212] p-4 mb-6 flex justify-between items-center shadow-[4px_4px_0px_0px_#121212] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#F0F0F0] rounded-full -translate-y-1/2 translate-x-1/3" />
                    <div className="relative z-10">
                      <p className="font-bold text-xs uppercase tracking-widest opacity-60">Total Amount</p>
                      <h3 className="font-black text-4xl tracking-tight text-[#1040C0]">₹{payModal.amount}</h3>
                    </div>
                 </div>

                 <div className="space-y-4 mb-8">
                    <div>
                      <label className="font-black text-[10px] uppercase tracking-widest opacity-80 mb-1 block">Cardholder Name</label>
                      <input type="text" defaultValue={profile.name} className="w-full p-3 border-2 border-[#121212] font-bold text-sm uppercase outline-none focus:border-[#1040C0] bg-white transition-colors" required />
                    </div>
                    <div>
                      <label className="font-black text-[10px] uppercase tracking-widest opacity-80 mb-1 block">Card Number</label>
                      <div className="relative">
                        <input type="text" placeholder="XXXX XXXX XXXX XXXX" maxLength={19} className="w-full p-3 pl-10 border-2 border-[#121212] font-mono font-bold text-sm outline-none focus:border-[#1040C0] bg-white transition-colors" required />
                        <CreditCard className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="font-black text-[10px] uppercase tracking-widest opacity-80 mb-1 block">Expiry</label>
                        <input type="text" placeholder="MM/YY" maxLength={5} className="w-full p-3 border-2 border-[#121212] font-mono font-bold text-sm outline-none focus:border-[#1040C0] bg-white text-center transition-colors" required />
                      </div>
                      <div className="flex-1">
                        <label className="font-black text-[10px] uppercase tracking-widest opacity-80 mb-1 block">CVV</label>
                        <input type="password" placeholder="•••" maxLength={3} className="w-full p-3 border-2 border-[#121212] font-mono font-bold text-lg outline-none focus:border-[#1040C0] bg-white text-center transition-colors tracking-[0.2em]" required />
                      </div>
                    </div>
                 </div>

                 <button type="submit" className="w-full py-4 bg-[#1040C0] text-white border-4 border-[#121212] font-black uppercase tracking-wider hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#121212] transition-all">
                   Confirm Payment
                 </button>
               </form>
             )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successReceipt && <ReceiptView payment={successReceipt} onClose={closeSuccess} />}

      {/* View Extant Receipt */}
      {viewReceipt && <ReceiptView payment={viewReceipt} onClose={() => setViewReceipt(null)} />}

    </div>
  );
}
