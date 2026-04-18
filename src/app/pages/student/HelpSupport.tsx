import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  LifeBuoy,
  Send,
  CheckCircle2
} from 'lucide-react';

export function HelpSupport() {
  const { departments } = useNexus();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    {
      q: "How long does clearance approval normally take?",
      a: "Most departments process approvals within 24-48 hours. The entire chain typically completes within 3 to 5 business days, provided all dues are paid and documents are correct."
    },
    {
      q: "What should I do if my document is rejected?",
      a: "Navigate to the Document Vault or My Application page. Review the comment left by the authority explaining the rejection reason. Ensure you fix the issue and click 'Re-upload' or 'Respond' to submit a corrected version."
    },
    {
      q: "Who do I contact if my payment isn't reflected?",
      a: "First check your Notification and Payment History. If the payment was deducted from your bank but still shows as pending here, please raise a ticket using the form below with your transaction ID."
    },
    {
      q: "Can I download my No-Dues Certificate early?",
      a: "No. The system will automatically generate your official, digitally-signed No-Dues Certificate only when all 7 departments have marked your status as 'Cleared'."
    },
    {
      q: "My ID card scan size is too large. What should I do?",
      a: "The Document Vault accepts PDF and JPEG files up to 2MB. Use an online image compressor or save your PDF in a reduced size format before uploading."
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => setTicketSubmitted(false), 5000);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      
      <div>
        <h1 className="font-black text-3xl md:text-5xl uppercase tracking-tight mb-2">Help & Support</h1>
        <p className="text-lg font-medium opacity-80">Get answers quickly or reach out to the support team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: FAQs & Ticketing */}
        <div className="lg:col-span-2 space-y-10">
          
          <div>
            <h2 className="font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-2">
              <span className="w-4 h-4 bg-[#F0C020] inline-block border-2 border-[#121212]" />
              Frequently Asked Questions
            </h2>
            <div className="bg-white border-4 border-[#121212] shadow-[4px_4px_0px_0px_#121212] divide-y-2 divide-[#121212]">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 flex items-center justify-between hover:bg-[#F9F9F9] transition-colors text-left"
                  >
                    <span className="font-black md:text-lg uppercase tracking-tight pr-4">{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-6 h-6 shrink-0" /> : <ChevronDown className="w-6 h-6 shrink-0 opacity-50" />}
                  </button>
                  {openFaq === i && (
                    <div className="p-5 bg-[#F0F0F0] border-t-2 border-[#121212]">
                      <p className="font-medium leading-relaxed opacity-90">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-2">
              <span className="w-4 h-4 bg-[#1040C0] inline-block border-2 border-[#121212]" />
              Raise a Ticket
            </h2>
            
            {ticketSubmitted ? (
               <div className="bg-[#1040C0]/10 border-4 border-[#1040C0] p-8 flex items-center gap-6 shadow-[4px_4px_0px_0px_#1040C0]">
                  <CheckCircle2 className="w-12 h-12 text-[#1040C0] shrink-0" />
                  <div>
                    <h3 className="font-black text-xl uppercase tracking-tight text-[#1040C0]">Ticket Raised</h3>
                    <p className="font-medium mt-1">Your ticket <span className="font-bold">#NX-2041</span> has been submitted successfully. Our team will contact you via your university email address.</p>
                  </div>
               </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="bg-white border-4 border-[#121212] flex flex-col shadow-[4px_4px_0px_0px_#121212] overflow-hidden">
                <div className="p-6 md:p-8 space-y-6 bg-[#F9F9F9]">
                  <div>
                    <label className="font-black uppercase text-xs tracking-widest mb-2 block">Issue Category</label>
                    <select className="w-full border-2 border-[#121212] p-3 font-bold uppercase text-sm outline-none focus:border-4 bg-white transition-all transition-colors" required>
                      <option value="">-- Choose Category --</option>
                      <option value="payment">Payment Issue</option>
                      <option value="document">Document Rejection</option>
                      <option value="technical">Technical Bug</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-black uppercase text-xs tracking-widest mb-2 block">Describe your issue</label>
                    <textarea 
                      rows={5} 
                      placeholder="Please provide specifics so we can resolve this faster..."
                      className="w-full border-2 border-[#121212] p-4 font-medium outline-none focus:border-4 transition-all bg-white" 
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-[#121212] text-white font-black uppercase tracking-wider flex justify-center items-center gap-2 hover:bg-[#1040C0] transition-colors">
                  Submit Ticket <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Right Column: Contact Directory */}
        <div className="lg:col-span-1">
          <h2 className="font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-2">
              <span className="w-4 h-4 bg-[#D02020] inline-block border-2 border-[#121212]" />
              Directory
          </h2>
          <div className="space-y-4">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white border-2 border-[#121212] p-4 hover:border-4 hover:shadow-[4px_4px_0px_0px_#121212] transition-all flex flex-col min-h-[120px]">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-black uppercase tracking-tight">{dept.name}</h3>
                   <Mail className="w-4 h-4 opacity-30" />
                 </div>
                 
                 <div className="mt-auto">
                   <p className="font-bold text-sm text-[#121212]">{dept.authority}</p>
                   <a href="#" className="font-bold text-[10px] uppercase tracking-widest text-[#1040C0] opacity-80 hover:opacity-100 mt-1 inline-block hover:underline">
                     {dept.name.toLowerCase().substring(0, 3)}.admin@nexus.edu
                   </a>
                 </div>
              </div>
            ))}
            
            <div className="bg-[#D02020] text-white border-4 border-[#121212] p-6 shadow-[4px_4px_0px_0px_#121212]">
               <LifeBuoy className="w-8 h-8 mb-4 border-2 border-white rounded-full p-1" />
               <h3 className="font-black uppercase tracking-tight mb-2">Urgent Issues</h3>
               <p className="font-medium text-sm leading-relaxed mb-4 opacity-90">
                 For immediate blocks halting your clearance near deadline, call the registrar desk.
               </p>
               <p className="font-black text-xl tracking-tight leading-none bg-[#121212] inline-block px-3 py-2 border-2 border-white">+91 0800-4422</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
