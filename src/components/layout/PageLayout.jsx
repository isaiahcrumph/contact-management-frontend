import React from 'react';

const PageLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-900 w-full">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;