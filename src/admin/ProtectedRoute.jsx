import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from './api';

export default function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/gestao/login" replace />;
  }
  return children;
}
