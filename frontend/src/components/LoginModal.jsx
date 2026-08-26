import React, { useEffect, useState, useCallback } from 'react';
import { X, Mail, ArrowLeft, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginModal = () => {
  const { isLoginOpen, closeLogin, loginUser, setHasPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const [step, setStep] = useState('email');
  const [otp, setOtp] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [resending, setResending] = useState(false);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setError('');
    setEmail('');
    setAgreed(true);
    setStep('email');
    setOtp('');
    setMaskedEmail('');
    setResendTimer(0);
    setSuccessMsg('');
    setResending(false);
    setPassword('');
    setShowPassword(false);
    setConfirmPassword('');
    setShowConfirm(false);
  }, [isLoginOpen]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(''), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  const handleCheckEmail = async () => {
    if (!agreed) {
      setError('Please agree to Terms & Conditions and Privacy Policy');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/backend/auth/check-email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.exists && data.has_password) {
          setStep('password');
        } else {
          await sendOtp();
        }
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (isResend = false) => {
    if (isResend) setResending(true);
    else setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch('/backend/auth/send-otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMaskedEmail(data.masked || email.trim());
        setStep('otp');
        setOtp('');
        setError('');
        setResendTimer(60);
        setSuccessMsg(isResend ? 'OTP resent successfully' : '');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
      setResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }
    if (otp.trim().length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/backend/auth/verify-otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        if (data.has_password) {
          loginUser(data.user, true, true);
          navigate('/dashboard');
        } else {
          loginUser(data.user, false, false);
          setStep('set-password');
        }
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/backend/auth/login-password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password: password.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        loginUser(data.user);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }
    if (password.trim().length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password.trim() !== confirmPassword.trim()) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/backend/auth/set-password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setHasPassword(true);
        closeLogin();
        navigate('/dashboard');
      } else {
        setError(data.error || 'Failed to set password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'set-password') {
      navigate('/dashboard');
      return;
    }
    setStep('email');
    setOtp('');
    setError('');
    setSuccessMsg('');
    setResendTimer(0);
    setPassword('');
    setConfirmPassword('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (loading || resending) return;
      if (step === 'email') handleCheckEmail();
      else if (step === 'otp') handleVerifyOtp();
      else if (step === 'password') handlePasswordLogin();
      else if (step === 'set-password') handleSetPassword();
    }
  };

  const handleGoogleClick = () => {
    if (!agreed) {
      setError('Please agree to Terms & Conditions and Privacy Policy');
      return;
    }
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
            if (data.has_password) {
              loginUser(data.user, true, true);
              navigate('/dashboard');
            } else {
              loginUser(data.user, false, false);
              setStep('set-password');
            }
          }
        } catch (err) {
          console.error('Auth check error:', err);
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const titles = {
    email: 'Log in or sign up',
    otp: 'Enter OTP',
    password: 'Enter your password',
    'set-password': 'Create your password',
  };

  const stepTitles = {
    email: 'Log in or sign up',
    otp: 'Enter OTP',
    password: 'Welcome back',
    'set-password': 'Set up your account',
  };

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
        className={`bg-white rounded-4xl w-full max-w-[420px] p-8 relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out transform ${
          isLoginOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Close Button */}
        <button 
          onClick={closeLogin}
          className="absolute right-6 top-6 text-(--color-primary) hover:text-black transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
        
        {/* Title */}
        <h2 className="text-[22px] font-semibold text-center text-(--color-primary) mb-6 mt-2">
          {stepTitles[step]}
        </h2>

        {/* EMAIL STEP */}
        {step === 'email' && (
          <>
            <button onClick={handleGoogleClick} className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-3.25 hover:bg-gray-50 transition-colors mb-5 cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-(--color-primary) font-medium text-[15px]">Continue with Google</span>
            </button>
            
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-gray-400/80 text-[13px] lowercase font-normal">or</span>
              </div>
            </div>
            
            <div className="relative mb-5">
              <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                <Mail size={18} strokeWidth={2} className="text-gray-400" />
              </div>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                autoComplete="email"
                className="w-full pl-12 pr-4 py-3.25 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-(--color-primary)/15 focus:border-(--color-primary) transition-all text-[15px] text-gray-800 placeholder-gray-400/80"
              />
            </div>

            {error && <p className="text-red-500 text-[13px] mb-4 text-center">{error}</p>}
            
            <button 
              onClick={handleCheckEmail}
              disabled={loading}
              className="w-full bg-(--color-primary) hover:bg-(--color-primary-dark) text-white rounded-full py-[13.5px] font-medium transition-colors text-[16px] mb-5 cursor-pointer shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : 'Continue'}
            </button>
          </>
        )}

        {/* OTP STEP */}
        {step === 'otp' && (
          <>
            <button onClick={handleBack} className="flex items-center gap-2 text-[14px] text-gray-500 hover:text-(--color-primary) transition-colors mb-5 cursor-pointer">
              <ArrowLeft size={16} strokeWidth={2.5} />
              Back
            </button>

            <p className="text-[15px] text-gray-600 mb-2 text-center">
              We sent a code to <span className="font-semibold text-(--color-primary)">{maskedEmail}</span>
            </p>

            {successMsg && (
              <div className="flex items-center justify-center gap-2 mb-4 text-(--color-accent) text-[14px] font-medium">
                <CheckCircle2 size={16} strokeWidth={2.5} />
                {successMsg}
              </div>
            )}

            <div className="relative mb-5">
              <input 
                type="text" 
                inputMode="numeric"
                placeholder="Enter 6-digit OTP" 
                value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                onKeyDown={handleKeyDown}
                maxLength={6}
                autoFocus
                className="w-full px-4 py-3.25 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-(--color-primary)/15 focus:border-(--color-primary) transition-all text-[15px] text-gray-800 placeholder-gray-400/80 text-center tracking-[8px] font-semibold"
              />
            </div>

            {error && <p className="text-red-500 text-[13px] mb-4 text-center">{error}</p>}

            <button 
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full bg-(--color-primary) hover:bg-(--color-primary-dark) text-white rounded-full py-[13.5px] font-medium transition-colors text-[16px] mb-5 cursor-pointer shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center text-[14px] text-gray-500 h-5">
              {resendTimer > 0 ? (
                <p>Resend code in <span className="font-semibold text-(--color-primary)">{resendTimer}s</span></p>
              ) : (
                <p>
                  Didn't receive the code?{' '}
                  <button 
                    onClick={() => sendOtp(true)} 
                    disabled={resending} 
                    className="text-(--color-primary) font-semibold hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {resending ? 'Sending...' : 'Resend'}
                  </button>
                </p>
              )}
            </div>
          </>
        )}

        {/* PASSWORD LOGIN STEP */}
        {step === 'password' && (
          <>
            <button onClick={handleBack} className="flex items-center gap-2 text-[14px] text-gray-500 hover:text-(--color-primary) transition-colors mb-5 cursor-pointer">
              <ArrowLeft size={16} strokeWidth={2.5} />
              Back
            </button>

            <p className="text-[15px] text-gray-600 mb-2 text-center">
              Login as <span className="font-semibold text-(--color-primary)">{email.trim()}</span>
            </p>

            <div className="relative mb-5">
              <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                <Lock size={18} strokeWidth={2} className="text-gray-400" />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full pl-12 pr-12 py-3.25 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-(--color-primary)/15 focus:border-(--color-primary) transition-all text-[15px] text-gray-800 placeholder-gray-400/80"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
              </button>
            </div>

            {error && <p className="text-red-500 text-[13px] mb-4 text-center">{error}</p>}

            <button 
              onClick={handlePasswordLogin}
              disabled={loading || !password.trim()}
              className="w-full bg-(--color-primary) hover:bg-(--color-primary-dark) text-white rounded-full py-[13.5px] font-medium transition-colors text-[16px] mb-5 cursor-pointer shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </>
        )}

        {/* SET PASSWORD STEP */}
        {step === 'set-password' && (
          <>
            <p className="text-[15px] text-gray-600 mb-5 text-center">
              Create a password for your account so you can login directly next time.
            </p>

            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                <Lock size={18} strokeWidth={2} className="text-gray-400" />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                autoFocus
                className="w-full pl-12 pr-12 py-3.25 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-(--color-primary)/15 focus:border-(--color-primary) transition-all text-[15px] text-gray-800 placeholder-gray-400/80"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
              </button>
            </div>

            <div className="relative mb-5">
              <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                <Lock size={18} strokeWidth={2} className="text-gray-400" />
              </div>
              <input 
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm your password" 
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-12 py-3.25 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-(--color-primary)/15 focus:border-(--color-primary) transition-all text-[15px] text-gray-800 placeholder-gray-400/80"
              />
              <button 
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-4.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showConfirm ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
              </button>
            </div>

            <p className="text-[12px] text-gray-400 mb-4 text-center">At least 8 characters with uppercase, lowercase, and a number</p>

            {error && <p className="text-red-500 text-[13px] mb-4 text-center">{error}</p>}

            <button 
              onClick={handleSetPassword}
              disabled={loading || !password.trim() || !confirmPassword.trim()}
              className="w-full bg-(--color-primary) hover:bg-(--color-primary-dark) text-white rounded-full py-[13.5px] font-medium transition-colors text-[16px] mb-4 cursor-pointer shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting up...' : 'Continue'}
            </button>

            <button 
              onClick={handleBack}
              className="w-full text-center text-[14px] text-gray-500 hover:text-(--color-primary) cursor-pointer transition-colors"
            >
              Skip for now
            </button>
          </>
        )}
        
        {/* Terms */}
        {step === 'email' && (
          <div className="flex items-start gap-2.5 px-1 mt-6">
            <input 
              type="checkbox" 
              id="terms" 
              checked={agreed}
              onChange={(e) => { setAgreed(e.target.checked); setError(''); }}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-(--color-primary) focus:ring-(--color-primary) cursor-pointer"
            />
            <label htmlFor="terms" className="text-[13px] text-gray-400 leading-normal select-none cursor-pointer">
              I agree to <Link to="/terms" onClick={closeLogin} className="font-semibold text-(--color-primary) underline hover:text-black transition-colors">Terms & Conditions</Link> and <Link to="/privacy" onClick={closeLogin} className="font-semibold text-(--color-primary) underline hover:text-black transition-colors">Privacy Policy</Link>
            </label>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default LoginModal;
