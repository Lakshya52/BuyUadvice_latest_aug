import React, { useEffect, useState } from 'react';
import { X, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginModal = () => {
  const { isLoginOpen, closeLogin, loginUser } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError('');
    setIdentifier('');
  }, [isLoginOpen]);

  const handleContinue = async () => {
    if (!identifier.trim()) {
      setError('Please enter your email or phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/backend/auth/identifier.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        loginUser(data.user);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleContinue();
  };

  const handleGoogleClick = () => {
    const width = 500, height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    window.open(
      '/backend/auth/google.php',
      'google-auth',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  useEffect(() => {
    const handler = async (e) => {
      if (e.data?.type === 'google-auth-success') {
        try {
          const res = await fetch('/backend/auth/check.php', { credentials: 'include' });
          const data = await res.json();
          if (data?.authenticated) {
            loginUser(data.user);
            navigate('/dashboard');
          }
        } catch (err) {
          console.error('Auth check error:', err);
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${
        isLoginOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-[#0f172a]/30 transition-all duration-500 ease-out ${
          isLoginOpen ? 'opacity-100 backdrop-blur-[6px]' : 'opacity-0 backdrop-blur-none'
        }`}
        onClick={closeLogin}
      ></div>
      
      {/* Modal Content */}
      <div 
        className={`bg-white rounded-[32px] w-full max-w-[420px] p-8 relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out transform ${
          isLoginOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Close Button */}
        <button 
          onClick={closeLogin}
          className="absolute right-6 top-6 text-[#182b4f] hover:text-black transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
        
        {/* Title */}
        <h2 className="text-[22px] font-semibold text-center text-[#182b4f] mb-6 mt-2">
          Log in or sign up
        </h2>
        
        {/* Google Button */}
        <button onClick={handleGoogleClick} className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-[13px] hover:bg-gray-50 transition-colors mb-5 cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-[#182b4f] font-medium text-[15px]">Continue with google</span>
        </button>
        
        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-gray-400/80 text-[13px] lowercase font-normal">or</span>
          </div>
        </div>
        
        {/* Email/Phone Input */}
        <div className="relative mb-5">
          <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
            <Mail size={18} strokeWidth={2} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Email / Phone" 
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-12 pr-4 py-[13px] border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#182b4f]/15 focus:border-[#182b4f] transition-all text-[15px] text-gray-800 placeholder-gray-400/80"
          />
        </div>

        {error && (
          <p className="text-red-500 text-[13px] mb-4 text-center">{error}</p>
        )}
        
        {/* Continue Button */}
        <button 
          onClick={handleContinue}
          disabled={loading}
          className="w-full bg-[#182b4f] hover:bg-[#12203c] text-white rounded-full py-[13.5px] font-medium transition-colors text-[16px] mb-5 cursor-pointer shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Please wait...' : 'Continue'}
        </button>
        
        {/* Terms */}
        <div className="flex items-start gap-2.5 px-1 mt-6">
          <input 
            type="checkbox" 
            id="terms" 
            className="mt-1 w-4 h-4 rounded border-gray-300 text-[#182b4f] focus:ring-[#182b4f] cursor-pointer"
          />
          <label htmlFor="terms" className="text-[13px] text-gray-400 leading-normal select-none cursor-pointer">
            I agree to <a href="#" className="font-semibold text-[#182b4f] underline hover:text-black transition-colors">Terms & Conditions</a> and <a href="#" className="font-semibold text-[#182b4f] underline hover:text-black transition-colors">Privacy Policy</a>
          </label>
        </div>
        
      </div>
    </div>
  );
};

export default LoginModal;
