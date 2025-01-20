import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Verifica se o token de autenticação está armazenado no sessionStorage
  const isAuthenticated = !!sessionStorage.getItem('authToken');
    console.log(isAuthenticated);
  // Se não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/Home" />;
  }

  // Se autenticado, renderiza o conteúdo protegido
  return children;
};

export default PrivateRoute;
