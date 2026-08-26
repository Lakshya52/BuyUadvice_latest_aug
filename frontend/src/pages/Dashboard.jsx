import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, hasPassword, setHasPassword } = useAuth();
  const navigate = useNavigate();
  const [showSetPassword, setShowSetPassword] = useState(!hasPassword);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
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
        setShowSetPassword(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Failed to set password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 p-10 max-w-[480px] w-full text-center">
        {user.avatar && (
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mx-auto mb-5 object-cover" />
        )}
        <h1 className="text-[24px] font-bold text-[#1a1a1a] mb-2">Welcome, {user.name}</h1>
        <p className="text-[#666] text-[15px] mb-8">{user.email || 'Logged in via account'}</p>

        {showSetPassword && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={18} className="text-[var(--color-accent)]" />
              <h3 className="text-[16px] font-semibold text-[#182b4f]">Set your password</h3>
            </div>
            <p className="text-[13px] text-gray-500 mb-4">Create a password so you can login directly next time.</p>

            <div className="relative mb-3">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full px-4 pr-11 py-[11px] border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#182b4f]/15 focus:border-[#182b4f] transition-all text-[14px]"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative mb-3">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSetPassword(); }}
                className="w-full px-4 pr-11 py-[11px] border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#182b4f]/15 focus:border-[#182b4f] transition-all text-[14px]"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <p className="text-[12px] text-gray-400 mb-3">At least 8 characters with uppercase, lowercase, and a number</p>

            {error && <p className="text-red-500 text-[13px] mb-3 text-center">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={handleSetPassword}
                disabled={loading || !password.trim() || !confirmPassword.trim()}
                className="flex-1 bg-[#182b4f] hover:bg-[#12203c] text-white rounded-full py-[11px] font-medium transition-colors text-[14px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting...' : 'Save Password'}
              </button>
              <button
                onClick={() => setShowSetPassword(false)}
                className="px-5 py-[11px] text-gray-500 hover:text-[#182b4f] text-[14px] cursor-pointer transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {!showSetPassword && !hasPassword && (
          <button
            onClick={() => setShowSetPassword(true)}
            className="bg-[var(--color-accent)] hover:opacity-90 text-white rounded-full py-[12px] px-8 font-medium transition-colors cursor-pointer text-[15px] mb-4"
          >
            Set Password
          </button>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full py-[12px] px-8 font-medium transition-colors cursor-pointer text-[15px]"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
