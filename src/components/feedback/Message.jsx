import React from 'react';

const Message = ({ type = 'info', message, onClose }) => {
  const types = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };

  const bgClass = types[type] || types.info;

  return (
    <div className={`${bgClass} border px-4 py-3 rounded relative mb-4`} role="alert">
      <span className="block sm:inline">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          aria-label="Close notification"
        >
          <span className="text-xl">&times;</span>
        </button>
      )}
    </div>
  );
};

export default Message;