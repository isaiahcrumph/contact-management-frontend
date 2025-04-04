import React from 'react';

const PageLayout = ({ children, title }) => {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1024px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem'
        }}>{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;