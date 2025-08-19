import { Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTodos } from "../../hooks/useTodos";

interface TodoFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  onSuccess,
  onCancel,
  className = "",
}) => {
  const { addTodo } = useTodos();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!title.trim()) {
      setError("제목을 입력해주세요");
      return;
    }

    if (!currentUser) {
      setError("로그인이 필요합니다");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const todoData = {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate ? Timestamp.fromDate(new Date(dueDate)) : undefined,
        priority,
        completed: false,
      };

      await addTodo(todoData);

      // Reset form and call success callback
      resetForm();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Failed to create todo:", err);
      setError("할 일 생성 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 sm:p-8 md:p-10 ${className}`}
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:text-2xl">
        새 할 일 추가
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-6 md:space-y-8"
      >
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="할 일 제목을 입력하세요"
            required
            disabled={loading}
          />
        </div>

        {/* Description Textarea */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1"
          >
            설명 (선택사항)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="할 일에 대한 자세한 설명을 입력하세요"
            disabled={loading}
          />
        </div>

        {/* Due Date and Priority Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Due Date Picker */}
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              마감일 (선택사항)
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]} // 오늘 이후 날짜만 선택 가능
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              disabled={loading}
            />
          </div>

          {/* Priority Selector */}
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              우선순위
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "high" | "medium" | "low")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="low">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
            </select>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                생성 중...
              </div>
            ) : (
              "할 일 추가"
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              취소
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
