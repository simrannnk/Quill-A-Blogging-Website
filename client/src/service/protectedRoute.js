
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
const userInfo = JSON.parse(localStorage.getItem('userAuth')) || {};
const isAuthenticated = userInfo.isAuthenticated; 

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
