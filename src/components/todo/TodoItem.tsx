import { Timestamp } from "firebase/firestore";
import React from "react";
import { Todo } from "../../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (timestamp?: Timestamp | null) => {
    if (!timestamp) return "";
    return timestamp.toDate().toLocaleDateString("ko-KR");
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "높음";
      case "medium":
        return "보통";
      case "low":
        return "낮음";
      default:
        return "보통";
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg sm:p-6 md:p-8 ${
        todo.completed
          ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <h4
              className={`text-lg font-medium sm:text-xl ${
                todo.completed
                  ? "line-through text-gray-500 dark:text-gray-400"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {todo.title}
            </h4>
            {todo.description && (
              <p
                className={`mt-1 text-sm sm:text-base ${
                  todo.completed
                    ? "text-gray-400 dark:text-gray-500"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {todo.description}
              </p>
            )}
            <div className="flex items-center space-x-4 mt-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                  todo.priority
                )}`}
              >
                {getPriorityText(todo.priority)}
              </span>
              {todo.dueDate && (
                <span className="text-xs text-gray-500">
                  마감: {formatDate(todo.dueDate)}
                </span>
              )}
              <span className="text-xs text-gray-500">
                생성: {formatDate(todo.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(todo.id)}
          className="ml-4 text-red-600 hover:text-red-800"
          title="삭제"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
