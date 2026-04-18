import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { MockUser } from '../context/mockUsers';
import { 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const InputField = ({ label, type = "text", error, ...props }: any) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-800 mb-1">{label}</label>
      <input 
        type={type}
        className={`w-full p-3 bg-[#F9F9F9] border-2 transition-colors outline-none focus:bg-white
          ${error ? 'border-[#D02020]' : 'border-[#121212] focus:border-[#1040C0]'}`}
        {...props}
      />
      {error && <p className="text-[#D02020] text-xs font-bold mt-1.5">{error}</p>}
    </div>
  );
};

export function AuthPage() {
  const navigate = useNavigate();
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [redirectingUser, setRedirectingUser] = useState<MockUser | null>(null);

  const completeAuthentication = (user: MockUser) => {
    setRedirectingUser(user);
    setSuccessAnimation(true);
    setTimeout(() => {
      navigate(user.redirectTo);
    }, 1500);
  };

  const getRedirectMessage = () => {
    if (!redirectingUser) return 'Redirecting...';
    switch (redirectingUser.role) {
      case 'student': return 'Redirecting to Student Dashboard...';
      case 'lab-incharge': return 'Redirecting to Lab In-charge Portal...';
      case 'hod': return 'Redirecting to HOD Portal...';
      case 'principal': return 'Redirecting to Principal Portal...';
      case 'admin': return 'Redirecting to Admin Panel...';
      default: return 'Redirecting to your dashboard...';
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-white border-4 border-[#121212] flex flex-col shadow-[8px_8px_0px_0px_#121212] relative overflow-hidden">
        
        <AnimatePresence>
          {successAnimation && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 bg-[#1040C0] text-white flex flex-col items-center justify-center p-8"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <CheckCircle2 className="w-20 h-20 mb-6" />
              </motion.div>
              <h2 className="font-black text-2xl uppercase tracking-tight text-center">Authentication<br/>Successful</h2>
              <p className="text-sm font-medium opacity-80 mt-2 text-center">{getRedirectMessage()}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-8 pb-4 flex flex-col items-center justify-center">
           <div className="w-14 h-14 bg-[#F0C020] border-4 border-[#121212] rounded-full flex items-center justify-center mb-4">
              <span className="font-black text-xl tracking-tight leading-none translate-x-[1px]">NU</span>
           </div>
           {!forgotPasswordMode && (
             <h1 className="font-black uppercase text-xl tracking-tight">Sign In</h1>
           )}
        </div>

        {forgotPasswordMode ? (
          <ForgotPasswordView 
            onBack={() => setForgotPasswordMode(false)}
            onComplete={completeAuthentication}
          />
        ) : (
          <div className="p-6 md:p-8 pt-0">
            <SignInView 
              onForgot={() => setForgotPasswordMode(true)}
              onComplete={completeAuthentication}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sign In Component ---

function SignInView({ onForgot, onComplete }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const isFormValid = email.trim().length > 0 && password.length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setAuthError(null);
    const result = login(email, password);
    
    if (result.success && result.user) {
      onComplete(result.user);
    } else {
      setAuthError(result.error || 'Authentication failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">

      <InputField 
        label="Email Address"
        type="email"
        placeholder="Enter your registered email" 
        value={email}
        onChange={(e: any) => { setEmail(e.target.value); setAuthError(null); }}
      />
      
      <div className="mb-4 relative">
        <label className="block text-sm font-bold text-gray-800 mb-1">Password</label>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"}
            className={`w-full p-3 bg-[#F9F9F9] border-2 outline-none focus:bg-white focus:border-[#1040C0] ${authError ? 'border-[#D02020]' : 'border-[#121212]'}`}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setAuthError(null); }}
          />
          <button 
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {authError && <p className="text-[#D02020] text-xs font-bold mt-1.5">{authError}</p>}
      </div>

      <div className="flex justify-between items-center mb-8 mt-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 border-2 border-[#121212] accent-[#121212] cursor-pointer" />
          <span className="text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity">Remember me</span>
        </label>
        
        <button type="button" onClick={onForgot} className="text-sm font-bold text-[#1040C0] hover:underline">
          Forgot password?
        </button>
      </div>

      <button 
        type="submit"
        disabled={!isFormValid}
        className="w-full py-4 bg-[#121212] text-white font-black uppercase tracking-widest border-4 border-transparent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:shadow-[4px_4px_0px_#1040C0] hover:-translate-y-1 transition-all"
      >
        Sign In
      </button>

      <div className="mt-8 pt-6 border-t font-medium text-xs text-center border-[#E0E0E0] opacity-50">
        Enter your credentials to access the internal workspace.
      </div>
    </form>
  );
}

// --- Forgot Password Component ---

function ForgotPasswordView({ onBack, onComplete }: any) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [pwd, setPwd] = useState('');
  
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if(email.includes('@')) setStep(2);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    // Conceptually we fake a password reset success, returning generic student for test if needed.
    // In strict architectural implementation, they must sign in after reset anyway.
    if(otp.length === 6 && pwd.length >= 8) onBack(); 
  }

  return (
    <div className="p-6 md:p-8 flex flex-col h-full min-h-[460px]">
      <h2 className="font-black text-2xl uppercase tracking-tight mb-2">Reset Password</h2>
      <p className="text-sm font-medium opacity-80 mb-8 pb-4 border-b-4 border-[#121212]">
        {step === 1 ? 'Enter your registered college email.' : 'Enter the OTP and your new password.'}
      </p>

      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="flex-1 flex flex-col">
          <InputField 
            label="College Email" 
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!email.includes('@')}
            className="w-full mt-auto py-4 bg-[#1040C0] text-white font-black uppercase tracking-widest border-2 border-[#121212] disabled:opacity-50"
          >
            Send Reset OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="flex-1 flex flex-col gap-4">
           <div>
             <label className="block text-sm font-bold text-gray-800 mb-1">6-Digit OTP</label>
             <input type="text" maxLength={6} className="w-full p-3 font-mono tracking-[0.5em] text-center bg-[#F9F9F9] border-2 border-[#121212] outline-none" value={otp} onChange={e=>setOtp(e.target.value)}/>
           </div>
           <InputField label="New Password" type="password" value={pwd} onChange={(e: any) => setPwd(e.target.value)} />
           
           <button 
            type="submit"
            disabled={otp.length !== 6 || pwd.length < 8}
            className="w-full mt-auto py-4 bg-[#D02020] text-white font-black uppercase tracking-widest border-2 border-[#121212] disabled:opacity-50"
          >
            Reset Password
          </button>
        </form>
      )}

      <button onClick={onBack} className="mt-6 text-sm font-bold text-center w-full opacity-60 hover:opacity-100 flex items-center justify-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to sign in
      </button>
    </div>
  );
}
