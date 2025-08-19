import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 로그인된 사용자는 대시보드로 리다이렉트
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Todo App에 오신 것을 환영합니다
        </h1>
        <div className="space-y-4">
          <Link
            to="/login"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded block text-center"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded block text-center"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
