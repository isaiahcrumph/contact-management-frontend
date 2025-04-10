import React from 'react';
import PropTypes from 'prop-types';

const CrudButton = ({ type, onClick, label, disabled = false }) => {
  // Define color variants based on CRUD type
  const variants = {
    create: 'bg-green-600 hover:bg-green-700',
    read: 'bg-blue-600 hover:bg-blue-700',
    update: 'bg-orange-600 hover:bg-orange-700',
    delete: 'bg-red-600 hover:bg-red-700',
  };

  // Get the appropriate color class
  const colorClass = variants[type] || variants.read;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${colorClass} text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {label}
    </button>
  );
};

CrudButton.propTypes = {
  type: PropTypes.oneOf(['create', 'read', 'update', 'delete']).isRequired,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default CrudButton;
