import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);
    }
  };

  if (!currentUser) {
    return null; // ProtectedRoute에서 처리됨
  }

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-6">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="프로필"
                  className="w-16 h-16 rounded-full mr-4"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-medium mr-4">
                  {currentUser.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {currentUser.displayName || '사용자'}
                </h3>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">이메일</label>
                <p className="mt-1 text-sm text-gray-900">{currentUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">표시 이름</label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentUser.displayName || '설정되지 않음'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">가입일</label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentUser.createdAt.toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div className="pt-4 space-y-2">
                <Link
                  to="/dashboard"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2 inline-block"
                >
                  대시보드로 돌아가기
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
