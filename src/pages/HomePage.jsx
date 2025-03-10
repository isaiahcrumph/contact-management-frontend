import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import CrudButton from '../components/buttons/CrudButton';
import ContactsTable from '../components/tables/ContactsTable';
import ContactForm from '../components/forms/ContactForm';
import Message from '../components/feedback/Message';

const HomePage = () => {
  // State for sample data
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "555-123-4567",
      address: "123 Main St",
      city: "Seattle",
      state: "WA",
      zipCode: "98101"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phoneNumber: "555-987-6543",
      address: "456 Pine Ave",
      city: "Portland",
      state: "OR",
      zipCode: "97201"
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      phoneNumber: "555-555-5555",
      address: "789 Oak Blvd",
      city: "San Francisco",
      state: "CA",
      zipCode: "94101"
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);

  // Mock handlers for CRUD operations
  const handleCreate = () => {
    setCurrentContact(null);
    setShowForm(true);
  };

  const handleRead = () => {
    setShowForm(false);
    setCurrentContact(null);
    setMessage(null);
    setSelectedContactId(null);
    
    // Simulate loading
    setLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleUpdate = () => {
    if (selectedContactId) {
      const contactToUpdate = contacts.find(c => c.id === selectedContactId);
      if (contactToUpdate) {
        setCurrentContact(contactToUpdate);
        setShowForm(true);
      } else {
        setMessage({ type: 'warning', message: 'Please select a contact to update' });
      }
    } else {
      setMessage({ type: 'warning', message: 'Please select a contact to update' });
    }
  };

  const handleDelete = () => {
    if (selectedContactId) {
      // Simulate deletion
      setContacts(prev => prev.filter(contact => contact.id !== selectedContactId));
      setMessage({ type: 'success', message: 'Contact deleted successfully' });
      setSelectedContactId(null);
    } else {
      setMessage({ type: 'warning', message: 'Please select a contact to delete' });
    }
  };

  const handleFormSubmit = (formData) => {
    if (formData.id) {
      // Update existing contact
      setContacts(prev => 
        prev.map(contact => 
          contact.id === formData.id ? formData : contact
        )
      );
      setMessage({ type: 'success', message: 'Contact updated successfully' });
    } else {
      // Create new contact
      const newContact = {
        ...formData,
        id: contacts.length + 1, // Simple ID generation for demo purposes
      };
      setContacts(prev => [...prev, newContact]);
      setMessage({ type: 'success', message: 'Contact created successfully' });
    }
    setShowForm(false);
    setCurrentContact(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentContact(null);
  };

  const handleSelectContact = (id) => {
    setSelectedContactId(id === selectedContactId ? null : id);
  };

  // Test error message
  const showTestError = () => {
    setError("Failed to load contacts. Please try again.");
    setMessage(null);
  };

  return (
    <PageLayout title="Contact Management">
<div className="flex flex-wrap gap-2 mb-6">
  <CrudButton type="create" onClick={handleCreate} label="Create Contact" />
  <CrudButton type="read" onClick={handleRead} label="View Contacts" />
  <CrudButton 
  type="update" 
  onClick={handleUpdate} 
  label="Update Contact" 
  disabled={!selectedContactId}
/>
<CrudButton 
  type="delete" 
  onClick={handleDelete} 
  label="Delete Contact" 
  disabled={!selectedContactId}
/>
  <CrudButton type="read" onClick={showTestError} label="Test Error" />
</div>
      
      <hr className="my-6 border-gray-600" />
      
      {message && (
        <Message 
          type={message.type} 
          message={message.message} 
          onClose={() => setMessage(null)} 
        />
      )}
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        {showForm ? (
          <ContactForm 
            contact={currentContact} 
            onSubmit={handleFormSubmit} 
            onCancel={handleFormCancel} 
          />
        ) : (
          <ContactsTable 
            contacts={contacts} 
            loading={loading} 
            error={error}
            selectedContactId={selectedContactId}
            onSelectContact={handleSelectContact}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default HomePage;