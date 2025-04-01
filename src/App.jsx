// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import EmptyContactsPage from './pages/EmptyContactsPage';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      <Route path="/empty-contacts" element={
        <ProtectedRoute>
          <EmptyContactsPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;