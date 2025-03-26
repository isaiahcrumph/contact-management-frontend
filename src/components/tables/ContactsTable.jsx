import React from 'react';
const ContactsTable = ({ contacts, loading, error, selectedContactId, onSelectContact, onViewContact }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
  if (!contacts || contacts.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded" role="info">
        No contacts found. Create a new contact to get started.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
          <tr>
            <th scope="col" className="py-3 px-6">Name</th>
            <th scope="col" className="py-3 px-6">Email</th>
            <th scope="col" className="py-3 px-6">Phone</th>
            <th scope="col" className="py-3 px-6">City</th>
            <th scope="col" className="py-3 px-6">State</th>
            <th scope="col" className="py-3 px-6">Zip Code</th>
          </tr>
        </thead>
        <tbody>
        {contacts
  .filter(contact =>
    `${contact.firstName} ${contact.lastName} ${contact.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )
  .map((contact, index) => (
    <tr
      key={contact.id || index}
      className={`border-b border-gray-700 hover:bg-gray-600 cursor-pointer ${
        selectedContactId === contact.id ? 'bg-blue-900' : 'bg-gray-800'
      }`}
      onClick={() => onSelectContact(contact.id)}
      onDoubleClick={() => onViewContact(contact.id)}
    >
      <td className="py-4 px-6 font-medium whitespace-nowrap">
        {contact.firstName} {contact.lastName}
      </td>
      <td className="py-4 px-6">{contact.email}</td>
      <td className="py-4 px-6">{contact.phoneNumber}</td>
      <td className="py-4 px-6">{contact.city}</td>
      <td className="py-4 px-6">{contact.state}</td>
      <td className="py-4 px-6">{contact.zipCode}</td>
    </tr>
  ))}

        </tbody>
      </table>
    </div>
  );
};
export default ContactsTable;