// src/components/modals/ContactDetailsModal.jsx
import React from 'react';

const ContactDetailsModal = ({ contact, onClose }) => {
  if (!contact) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Contact Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-white">{contact.email}</p>
          </div>
          <div>
             <p className="text-gray-400 text-sm">Phone</p>
            <p className="text-white">{contact.phoneNumber}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-400 text-sm">Address</p>
            <p className="text-white">{contact.address}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">City</p>
            <p className="text-white">{contact.city}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">State</p>
            <p className="text-white">{contact.state}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Zip Code</p>
            <p className="text-white">{contact.zipCode}</p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose} 
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsModal;