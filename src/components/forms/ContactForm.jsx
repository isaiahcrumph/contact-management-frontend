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
  const [touched, setTouched] = useState({});

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

  // Validate a single field
  const validateField = (name, value) => {
    switch(name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        if (!/^[A-Za-z\s'-]+$/.test(value)) return 'First name can only contain letters, spaces, hyphens and apostrophes';
        return '';
      
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
        if (!/^[A-Za-z\s'-]+$/.test(value)) return 'Last name can only contain letters, spaces, hyphens and apostrophes';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) 
          return 'Please enter a valid email address (example@domain.com)';
        return '';
      
      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required';
        if (!/^\d{3}-\d{3}-\d{4}$/.test(value)) 
          return 'Please use format: 555-123-4567';
        return '';
      
      case 'city':
        if (!value.trim()) return 'City is required';
        if (!/^[A-Za-z\s'-]+$/.test(value)) 
          return 'City name can only contain letters, spaces, hyphens and apostrophes';
        return '';
      
      case 'state':
        if (!value.trim()) return 'State is required';
        if (!/^[A-Z]{2}$/.test(value)) 
          return 'Please enter a valid 2-letter state code (e.g., WA)';
        return '';
      
      case 'zipCode':
        if (!value.trim()) return 'ZIP Code is required';
        if (!/^\d{5}(-\d{4})?$/.test(value)) 
          return 'Please enter a valid 5-digit ZIP code or ZIP+4';
        return '';
      
      default:
        return '';
    }
  };

  // Handle input field changes with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone numbers - auto format
    if (name === 'phoneNumber') {
      // Strip all non-digits
      const digits = value.replace(/\D/g, '');
      
      // Format with hyphens as they type
      let formattedValue = value;
      if (digits.length <= 3) {
        formattedValue = digits;
      } else if (digits.length <= 6) {
        formattedValue = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else {
        formattedValue = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } 
    // For state fields, convert to uppercase
    else if (name === 'state') {
      setFormData(prev => ({
        ...prev,
        [name]: value.toUpperCase()
      }));
    }
    // For all other fields
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field
    if (touched[name]) {
      const fieldError = name === 'phoneNumber' 
        ? validateField(name, value.replace(/\D/g, '').length >= 10 ? value : '')
        : validateField(name, name === 'state' ? value.toUpperCase() : value);
        
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  };

  // Handle blur event for validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const fieldError = validateField(name, name === 'state' ? value.toUpperCase() : value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const fillDummyData = () => {
    // Arrays of valid first and last names
    const firstNames = ['John', 'Jane', 'Robert', 'Maria', 'David', 'Sarah', 'Michael', 'Emma', 'William', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
    
    // Randomly select names from the arrays
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    const dummyData = {
      id: null,
      firstName: randomFirst,
      lastName: randomLast,
      email: `${randomFirst.toLowerCase()}.${randomLast.toLowerCase()}@example.com`,
      phoneNumber: `555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      address: `${Math.floor(Math.random() * 9000) + 1000} Main Street`,
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    };
    
    setFormData(dummyData);
    
    // Clear all errors since dummy data is valid
    setErrors({});
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(dummyData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
  };

  // Validate all fields for form submission
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'id' && key !== 'address') { // Address is optional
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (validateForm()) {
      onSubmit(formData);
    }
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
          onBlur={handleBlur}
          placeholder="John"
          className={`w-full px-3 py-2 bg-gray-700 border ${
            touched.firstName && errors.firstName ? 'border-red-500' : 'border-gray-600'
          } rounded-md text-white`}
          aria-describedby={errors.firstName ? "firstName-error" : ""}
        />
        {touched.firstName && errors.firstName && 
          <p id="firstName-error" className="text-red-500 mt-1">{errors.firstName}</p>}
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
          onBlur={handleBlur}
          placeholder="Smith"
          className={`w-full px-3 py-2 bg-gray-700 border ${
            touched.lastName && errors.lastName ? 'border-red-500' : 'border-gray-600'
          } rounded-md text-white`}
          aria-describedby={errors.lastName ? "lastName-error" : ""}
        />
        {touched.lastName && errors.lastName && 
          <p id="lastName-error" className="text-red-500 mt-1">{errors.lastName}</p>}
      </div>
      
      <div>
        <label htmlFor="email" className="block mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="FirstLast@example.com"
          className={`w-full px-3 py-2 bg-gray-700 border ${
            touched.email && errors.email ? 'border-red-500' : 'border-gray-600'
          } rounded-md text-white`}
          aria-describedby={errors.email ? "email-error" : ""}
        />
        {touched.email && errors.email && 
          <p id="email-error" className="text-red-500 mt-1">{errors.email}</p>}
      </div>
      
      <div>
        <label htmlFor="phoneNumber" className="block mb-1">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="555-123-4567"
          className={`w-full px-3 py-2 bg-gray-700 border ${
            touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : 'border-gray-600'
          } rounded-md text-white`}
          aria-describedby={errors.phoneNumber ? "phone-error" : ""}
        />
        {touched.phoneNumber && errors.phoneNumber && 
          <p id="phone-error" className="text-red-500 mt-1">{errors.phoneNumber}</p>}
        {!errors.phoneNumber && 
          <p className="text-gray-400 text-xs mt-1">Format: 555-123-4567</p>}
      </div>
      
      <div>
        <label htmlFor="address" className="block mb-1">Address (Optional)</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
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
            onBlur={handleBlur}
            placeholder="Seattle"
            className={`w-full px-3 py-2 bg-gray-700 border ${
              touched.city && errors.city ? 'border-red-500' : 'border-gray-600'
            } rounded-md text-white`}
            aria-describedby={errors.city ? "city-error" : ""}
          />
          {touched.city && errors.city && 
            <p id="city-error" className="text-red-500 mt-1">{errors.city}</p>}
        </div>
        
        <div>
          <label htmlFor="state" className="block mb-1">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="WA"
            maxLength="2"
            className={`w-full px-3 py-2 bg-gray-700 border ${
              touched.state && errors.state ? 'border-red-500' : 'border-gray-600'
            } rounded-md text-white uppercase`}
            aria-describedby={errors.state ? "state-error" : ""}
          />
          {touched.state && errors.state && 
            <p id="state-error" className="text-red-500 mt-1">{errors.state}</p>}
          {!errors.state && 
            <p className="text-gray-400 text-xs mt-1">2 uppercase letters (WA)</p>}
        </div>
        
        <div>
          <label htmlFor="zipCode" className="block mb-1">ZIP Code</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="98101"
            className={`w-full px-3 py-2 bg-gray-700 border ${
              touched.zipCode && errors.zipCode ? 'border-red-500' : 'border-gray-600'
            } rounded-md text-white`}
            aria-describedby={errors.zipCode ? "zip-error" : ""}
          />
          {touched.zipCode && errors.zipCode && 
            <p id="zip-error" className="text-red-500 mt-1">{errors.zipCode}</p>}
          {!errors.zipCode && 
            <p className="text-gray-400 text-xs mt-1">5 digits or 5+4 format</p>}
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