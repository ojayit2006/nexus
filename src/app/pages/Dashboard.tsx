import { motion, AnimatePresence } from 'motion/react';
import {
  PieChart,
  FileText,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Upload,
  User,
  LogOut,
  X
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { BauhausButton } from '../components/BauhausButton';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setIsModalOpen(false);
          setUploadProgress(0);
          toast.success('Document uploaded successfully! Verification in progress.');
        }, 500);
      }
    }, 150);
  };
  const student = {
    name: 'JULIAN SCHMIDT',
    id: 'NX-2026-0842',
    dept: 'ARCHITECTURE & DESIGN',
    stages: [
      { id: 1, label: 'DOCUMENT SUBMISSION', status: 'approved', icon: <FileText className="w-5 h-5" /> },
      { id: 2, label: 'LIBRARY CLEARANCE', status: 'approved', icon: <CheckCircle className="w-5 h-5" /> },
      { id: 3, label: 'DEPARTMENT DUES', status: 'pending', icon: <Clock className="w-5 h-5" /> },
      { id: 4, label: 'FINANCE SIGN-OFF', status: 'idle', icon: <CreditCard className="w-5 h-5" /> }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex flex-col">
      {/* Dashboard Nav */}
      <nav className="px-8 lg:px-12 py-4 bg-white border-b-4 border-[#121212] flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link to="/">
            <Logo />
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <span className="font-black text-xs tracking-widest bg-[#121212] text-white px-3 py-1">ADMIN PANEL</span>
            <span className="font-bold text-xs uppercase opacity-60 italic">Live Status: Syncing...</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F0C020] border-2 border-[#121212] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden sm:block text-right">
              <p className="font-black text-[10px] leading-tight uppercase">{student.name}</p>
              <p className="font-bold text-[8px] opacity-60 uppercase">{student.id}</p>
            </div>
          </div>
          <Link to="/">
            <LogOut className="w-6 h-6 hover:text-[#D02020] cursor-pointer" />
          </Link>
        </div>
      </nav>

      <div className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-8">
        {/* Left Column - Status & Workflow */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <header className="flex flex-col gap-4">
            <h1 className="font-black text-4xl lg:text-6xl uppercase leading-[0.9]">
              CLEARANCE <br /> <span className="text-[#1040C0]">PROTOCOL</span>
            </h1>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="bg-[#D02020] text-white px-4 py-2 border-2 border-[#121212] font-black uppercase text-xs">
                PENDING APPROVAL
              </div>
              <div className="bg-white border-2 border-[#121212] px-4 py-2 font-black uppercase text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F0C020]" />
                Dues Check Required
              </div>
            </div>
          </header>

          <div className="grid sm:grid-cols-2 gap-4">
            {student.stages.map((stage) => (
              <div 
                key={stage.id}
                className={`p-6 border-4 border-[#121212] relative ${
                  stage.status === 'approved' ? 'bg-white' : 
                  stage.status === 'pending' ? 'bg-[#F0C020]' : 'bg-[#E0E0E0] opacity-50'
                }`}
                style={{ boxShadow: stage.status === 'idle' ? 'none' : '4px 4px 0px 0px #121212' }}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 bg-[#121212] flex items-center justify-center text-white">
                    {stage.icon}
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-tighter">PHASE 0{stage.id}</span>
                </div>
                <h3 className="font-black text-xl uppercase mb-2 leading-tight">{stage.label}</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full border-2 border-[#121212] ${
                    stage.status === 'approved' ? 'bg-[#1040C0]' : 
                    stage.status === 'pending' ? 'bg-[#D02020]' : 'bg-white'
                  }`} />
                  <span className="font-bold text-[10px] uppercase">{stage.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border-4 border-[#121212] p-8" style={{ boxShadow: '8px 8px 0px 0px #121212' }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-black text-2xl uppercase">Document Library</h2>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <BauhausButton variant="outline" className="px-4 py-2 text-xs">
                    <Upload className="w-4 h-4 mr-2" /> UPLOAD NEW
                  </BauhausButton>
                </DialogTrigger>
                <DialogContent className="rounded-none border-4 border-[#121212] bg-[#F0F0F0] p-0 overflow-hidden sm:max-w-md">
                  <div className="bg-[#121212] p-6 text-white flex justify-between items-center">
                    <DialogTitle className="font-black text-2xl uppercase tracking-tighter">UPLOAD PROTOCOL</DialogTitle>
                    <button onClick={() => setIsModalOpen(false)} className="hover:text-[#D02020]">
                       <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpload} className="p-8 space-y-6">
                    <div className="space-y-2">
                       <label className="font-black text-[10px] uppercase tracking-widest">Document Type</label>
                       <Select required>
                          <SelectTrigger className="rounded-none border-2 border-[#121212] bg-white h-12 font-bold uppercase text-xs">
                             <SelectValue placeholder="SELECT DOCUMENT" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-2 border-[#121212]">
                             <SelectItem value="id" className="font-bold uppercase text-xs">Identification Card</SelectItem>
                             <SelectItem value="noc" className="font-bold uppercase text-xs">No Objection Certificate</SelectItem>
                             <SelectItem value="fees" className="font-bold uppercase text-xs">Fee Receipt</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>

                    <div className="space-y-2">
                       <label className="font-black text-[10px] uppercase tracking-widest">Select File</label>
                       <Input 
                          type="file" 
                          required 
                          className="rounded-none border-2 border-[#121212] bg-white h-12 pt-2.5 font-bold uppercase text-[10px] file:font-black file:uppercase file:text-[10px] file:bg-[#121212] file:text-white file:px-4 file:h-full file:-ml-3 file:mr-4" 
                       />
                    </div>

                    {isUploading && (
                      <div className="space-y-2">
                         <div className="flex justify-between font-black text-[10px] uppercase">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                         </div>
                         <div className="h-3 w-full bg-[#E0E0E0] border-2 border-[#121212]">
                            <motion.div 
                               className="h-full bg-[#1040C0]" 
                               initial={{ width: 0 }}
                               animate={{ width: `${uploadProgress}%` }}
                            />
                         </div>
                      </div>
                    )}

                    <BauhausButton 
                      type="submit" 
                      variant="red" 
                      className="w-full" 
                      disabled={isUploading}
                    >
                      {isUploading ? 'PROCESSING...' : 'INITIALIZE UPLOAD →'}
                    </BauhausButton>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-4">
              {['Academic Transcript', 'NOC - Hostels', 'Library Clearance Card'].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-2 border-[#121212] hover:bg-[#F0F0F0] cursor-pointer">
                  <div className="flex items-center gap-4">
                    <FileText className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase">{doc}</span>
                  </div>
                  <Download className="w-5 h-5 hover:text-[#1040C0]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Summary */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-[#1040C0] border-4 border-[#121212] p-8 text-white" style={{ boxShadow: '8px 8px 0px 0px #121212' }}>
            <h2 className="font-black text-2xl uppercase mb-6 leading-tight">FINANCIAL OVERVIEW</h2>
            <div className="space-y-6">
              <div>
                <p className="font-bold text-[10px] uppercase opacity-60 mb-1">TOTAL DUES</p>
                <p className="font-black text-5xl">₹2,450</p>
              </div>
              <div className="h-2 w-full bg-[#121212] relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-[#F0C020]" 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <p className="font-bold text-xs uppercase">65% OF DUES CLEARED</p>
              <BauhausButton variant="yellow" className="w-full" onClick={() => toast.success('Payment portal opened: Remaining dues ₹1,450')}>PAY OUTSTANDING</BauhausButton>
            </div>
          </div>

          <div className="bg-white border-4 border-[#121212] p-8" style={{ boxShadow: '8px 8px 0px 0px #121212' }}>
            <h2 className="font-black text-2xl uppercase mb-6">CERTIFICATE</h2>
            <div className="aspect-square bg-[#F0F0F0] border-4 border-[#121212] border-dashed flex flex-col items-center justify-center p-8 text-center gap-4">
               <div className="relative">
                  <Clock className="w-12 h-12 text-[#D02020]" />
                  <motion.div 
                    className="absolute inset-0 border-4 border-[#D02020] rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
               </div>
               <p className="font-black text-sm uppercase">WAITING FOR FINAL SIGN-OFF</p>
               <p className="font-medium text-[10px] opacity-60">Your digital certificate with QR verification will be issued automatically once all stages are approved.</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-auto border-t-4 border-[#121212] px-12 py-6 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-bold text-[10px] uppercase">© 2026 NEXUS PROTOCOL — INFRASTRUCTURE MONITOR : ONLINE</p>
        <div className="flex gap-4">
          <div className="w-4 h-4 bg-[#D02020] rounded-full" />
          <div className="w-4 h-4 bg-[#1040C0]" />
          <div className="w-4 h-4 bg-[#F0C020]" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        </div>
      </footer>
    </div>
  );
}
