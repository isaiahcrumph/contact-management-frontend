import React from 'react';
import { Link } from 'react-router-dom';
import UserInfoDisplay from '../UserInfoDisplay';

const PageLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-900 w-full">
      {/* Header with navigation */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-white">Contact Management</h1>
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white transition">Regular Contacts</Link>
              <Link to="/empty-contacts" className="text-gray-300 hover:text-white transition">Empty Contacts</Link>
            </nav>
          </div>
          <UserInfoDisplay />
        </div>
      </header>
      
      {/* Main content - preserving your original layout */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;