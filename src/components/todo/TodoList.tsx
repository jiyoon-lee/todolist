import React from "react";
import { useTodos } from "../../hooks/useTodos";
import TodoItem from "./TodoItem";

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
    {message}
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center py-8 text-gray-500 dark:text-gray-400 sm:text-lg">
    {message}
  </div>
);

const TodoList: React.FC = () => {
  const { todos, loading, error, toggleTodo, deleteTodo } = useTodos();

  if (loading) return <div>로딩중...</div>;
  if (error) return <ErrorMessage message={error} />;
  if (todos.length === 0)
    return (
      <EmptyState message="아직 할 일이 없습니다. 첫 할 일을 추가해보세요!" />
    );

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      ))}
    </div>
  );
};

export default TodoList;
