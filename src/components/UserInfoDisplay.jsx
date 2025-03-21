// src/components/UserInfoDisplay.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const UserInfoDisplay = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-300 mr-2">
        Logged in as: <span className="font-medium">{currentUser.username}</span>
        {currentUser.role && <span className="ml-1 text-xs text-gray-400">({currentUser.role})</span>}
      </span>
      <button 
        onClick={handleLogout}
        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default UserInfoDisplay;