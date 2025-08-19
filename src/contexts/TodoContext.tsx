import React, { createContext, useContext, useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { Todo } from '../types';
import { useAuth } from './AuthContext';
import {
  addTodo as addTodoToFirestore,
  updateTodo as updateTodoInFirestore,
  deleteTodo as deleteTodoFromFirestore,
  toggleTodoCompletion,
  subscribeToUserTodos
} from '../services/firestore';

// TodoContext를 위한 인터페이스 (기존 타입과 구분)
interface TodoContextValue {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (todoData: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: React.ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setTodos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserTodos(
      currentUser.id,
      (userTodos) => {
        setTodos(userTodos);
        setLoading(false);
      },
      (error) => {
        console.error('Todo subscription error:', error);
        setError('할 일 목록을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  const addTodo = async (todoData: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) {
      throw new Error('사용자가 로그인되지 않았습니다.');
    }

    try {
      setError(null);
      await addTodoToFirestore(currentUser.id, todoData);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('할 일 추가 중 오류가 발생했습니다.');
      throw error;
    }
  };

  const updateTodo = async (id: string, updates: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>) => {
    try {
      setError(null);
      await updateTodoInFirestore(id, updates);
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('할 일 수정 중 오류가 발생했습니다.');
      throw error;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      await deleteTodoFromFirestore(id);
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('할 일 삭제 중 오류가 발생했습니다.');
      throw error;
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) {
      throw new Error('해당 할 일을 찾을 수 없습니다.');
    }

    try {
      setError(null);
      await toggleTodoCompletion(id, !todo.completed);
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError('할 일 상태 변경 중 오류가 발생했습니다.');
      throw error;
    }
  };

  const value: TodoContextValue = {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
