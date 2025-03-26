import React, { useState, useEffect } from 'react';

const ContactForm = ({ contact, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData({
        id: contact.id || null,
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        email: contact.email || '',
        phoneNumber: contact.phoneNumber || '',
        address: contact.address || '',
        city: contact.city || '',
        state: contact.state || '',
        zipCode: contact.zipCode || ''
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const fillDummyData = () => {
    setFormData({
      id: null,
      firstName: `Test${Math.floor(Math.random() * 100)}`,
      lastName: `User${Math.floor(Math.random() * 100)}`,
      email: `test${Math.floor(Math.random() * 100)}@example.com`,
      phoneNumber: `555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      address: `${Math.floor(Math.random() * 9000) + 1000} Main Street`,
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    });
  };
  const validate = () => {
    const newErrors = {};
    
    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (!/^[A-Za-z\s'-]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters, spaces, hyphens and apostrophes';
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (!/^[A-Za-z\s'-]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters, spaces, hyphens and apostrophes';
    }
    
    // Email validation - Using more robust regex
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address (example@domain.com)';
    }
    
    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please use format: 555-123-4567';
    }
    
    // Address is optional in many systems, but you can add validation if needed
    
    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (!/^[A-Za-z\s'-]+$/.test(formData.city)) {
      newErrors.city = 'City name can only contain letters, spaces, hyphens and apostrophes';
    }
    
    // State validation
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    } else if (!/^[A-Z]{2}$/.test(formData.state)) {
      newErrors.state = 'Please enter a valid 2-letter state code (e.g., WA)';
    }
    
    // ZIP Code validation
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP Code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 5-digit ZIP code or ZIP+4';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">{formData.id ? 'Edit Contact' : 'Create Contact'}</h2>
      
      {/* First Name field */}
<div>
  <label htmlFor="firstName" className="block mb-1">First Name</label>
  <input
    type="text"
    id="firstName"
    name="firstName"
    value={formData.firstName}
    onChange={handleChange}
    placeholder="John"
    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
    aria-describedby={errors.firstName ? "firstName-error" : ""}
  />
  {errors.firstName && <p id="firstName-error" className="text-red-500 mt-1">{errors.firstName}</p>}
</div>

{/* Last Name field */}
<div>
  <label htmlFor="lastName" className="block mb-1">Last Name</label>
  <input
    type="text"
    id="lastName"
    name="lastName"
    value={formData.lastName}
    onChange={handleChange}
    placeholder="Smith"
    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
    aria-describedby={errors.lastName ? "lastName-error" : ""}
  />
  {errors.lastName && <p id="lastName-error" className="text-red-500 mt-1">{errors.lastName}</p>}
</div>
      
      <div>
        <label htmlFor="email" className="block mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="FirstLast@example.com"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          aria-describedby={errors.email ? "email-error" : ""}
        />
        {errors.email && <p id="email-error" className="text-red-500 mt-1">{errors.email}</p>}
      </div>
      
      <div>
        <label htmlFor="phoneNumber" className="block mb-1">Phone Number (555-123-4567)</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="555-123-4567"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          aria-describedby={errors.phoneNumber ? "phone-error" : ""}
        />
        {errors.phoneNumber && <p id="phone-error" className="text-red-500 mt-1">{errors.phoneNumber}</p>}
      </div>
      
      <div>
        <label htmlFor="address" className="block mb-1">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main Street"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block mb-1">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Seattle"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            aria-describedby={errors.city ? "city-error" : ""}
          />
          {errors.city && <p id="city-error" className="text-red-500 mt-1">{errors.city}</p>}
        </div>
        
        <div>
          <label htmlFor="state" className="block mb-1">State (2 letters)</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="WA"
            maxLength="2"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white uppercase"
            aria-describedby={errors.state ? "state-error" : ""}
          />
          {errors.state && <p id="state-error" className="text-red-500 mt-1">{errors.state}</p>}
        </div>
        
        <div>
          <label htmlFor="zipCode" className="block mb-1">ZIP Code</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="98101"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            aria-describedby={errors.zipCode ? "zip-error" : ""}
          />
          {errors.zipCode && <p id="zip-error" className="text-red-500 mt-1">{errors.zipCode}</p>}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
      <button 
    type="button" 
    onClick={fillDummyData}
    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
  >
    Fill Test Data
  </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {formData.id ? 'Update' : 'Create'}
        </button>
      </div>

      
    </form>
  );
};

export default ContactForm;