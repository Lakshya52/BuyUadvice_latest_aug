import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
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
