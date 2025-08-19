import React, { useState } from "react";
import { InlineTodoForm, TodoFormModal, TodoItem } from "../components/todo";
import { useAuth } from "../contexts/AuthContext";
import { useTodos, useTodoStats } from "../hooks/useTodos";

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { todos, loading, error, toggleTodo, deleteTodo } = useTodos();
  const stats = useTodoStats();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const handleToggleTodo = async (id: string) => {
    try {
      await toggleTodo(id);
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (window.confirm("정말로 이 할 일을 삭제하시겠습니까?")) {
      try {
        await deleteTodo(id);
      } catch (error) {
        console.error("Failed to delete todo:", error);
      }
    }
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "completed":
        return todo.completed;
      case "pending":
        return !todo.completed;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            안녕하세요,{" "}
            {currentUser?.displayName || currentUser?.email?.split("@")[0]}님!
          </h1>
          <p className="mt-2 text-gray-600">
            오늘도 할 일을 효율적으로 관리해보세요.
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">전체 할 일</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600">완료된 할 일</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-orange-600">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-600">진행 중인 할 일</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">
              {stats.highPriority}
            </div>
            <div className="text-sm text-gray-600">높은 우선순위</div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* 할 일 목록 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* 헤더와 필터 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                할 일 목록
              </h3>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* 필터 버튼 */}
                <div className="flex rounded-md shadow-sm" role="group">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 text-sm font-medium border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      filter === "all"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    전체
                  </button>
                  <button
                    onClick={() => setFilter("pending")}
                    className={`px-4 py-2 text-sm font-medium border-t border-b focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      filter === "pending"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    진행 중
                  </button>
                  <button
                    onClick={() => setFilter("completed")}
                    className={`px-4 py-2 text-sm font-medium border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      filter === "completed"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    완료됨
                  </button>
                </div>

                {/* 새 할 일 추가 버튼 */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
                  새 할 일 추가
                </button>
              </div>
            </div>

            {/* 할 일 목록 또는 빈 상태 */}
            {todos.length === 0 ? (
              <InlineTodoForm />
            ) : filteredTodos.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>
                  {filter === "completed" && "완료된 할 일이 없습니다."}
                  {filter === "pending" && "진행 중인 할 일이 없습니다."}
                  {filter === "all" && "조건에 맞는 할 일이 없습니다."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Todo Form Modal */}
      <TodoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
};

export default Dashboard;
