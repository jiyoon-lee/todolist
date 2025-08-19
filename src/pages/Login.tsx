import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthPage } from '../components/auth';

const Login: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 이미 로그인된 사용자는 대시보드로 리다이렉트
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthPage />;
};

export default Login;
