import React, { useState } from "react";
import { TodoForm } from "./TodoForm";

interface InlineTodoFormProps {
  className?: string;
}

export const InlineTodoForm: React.FC<InlineTodoFormProps> = ({
  className = "",
}) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSuccess = () => {
    setIsFormVisible(false);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const handleShowForm = () => {
    setIsFormVisible(true);
  };

  return (
    <div className={className}>
      {!isFormVisible ? (
        <div className="text-center py-8 sm:py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 sm:text-xl">
            아직 할 일이 없습니다
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 sm:text-base">
            새로운 할 일을 추가해서 시작해보세요!
          </p>
          <button
            onClick={handleShowForm}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <svg
              className="w-5 h-5 mr-2 text-white dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            첫 번째 할 일 추가
          </button>
        </div>
      ) : (
        <TodoForm onSuccess={handleSuccess} onCancel={handleCancel} />
      )}
    </div>
  );
};
