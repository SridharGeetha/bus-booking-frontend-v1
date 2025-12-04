import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '../Service/service';


const ProtectedRoute = ({ element: Element }) => {

  if (isAdmin()) {
    return <Element />; 
  } else {
    return <Navigate to="*" replace />; 
  }
};

export default ProtectedRoute;