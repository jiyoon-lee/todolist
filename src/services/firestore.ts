import { db } from '../utils/firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { Todo } from '../types';

const TODOS_COLLECTION = 'todos';

export const addTodo = async (userId: string, todoData: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  const todoRef = collection(db, TODOS_COLLECTION);
  return addDoc(todoRef, {
    ...todoData,
    userId,
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateTodo = async (todoId: string, updates: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>) => {
  const todoRef = doc(db, TODOS_COLLECTION, todoId);
  return updateDoc(todoRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deleteTodo = (todoId: string) => {
  const todoRef = doc(db, TODOS_COLLECTION, todoId);
  return deleteDoc(todoRef);
};

export const getUserTodosQuery = (userId: string) => {
  return query(
    collection(db, TODOS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
};

// 실시간 구독을 위한 함수
export const subscribeToUserTodos = (
  userId: string, 
  callback: (todos: Todo[]) => void,
  onError?: (error: Error) => void
) => {
  const q = getUserTodosQuery(userId);
  
  return onSnapshot(
    q, 
    (snapshot: QuerySnapshot<DocumentData>) => {
      const todos: Todo[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        todos.push({
          id: doc.id,
          ...data
        } as Todo);
      });
      callback(todos);
    },
    (error) => {
      console.error('Error fetching todos:', error);
      if (onError) onError(error);
    }
  );
};

// Todo 완료 상태 토글
export const toggleTodoCompletion = async (todoId: string, completed: boolean) => {
  return updateTodo(todoId, { completed });
};

// Priority 업데이트
export const updateTodoPriority = async (todoId: string, priority: 'high' | 'medium' | 'low') => {
  return updateTodo(todoId, { priority });
};

// Due date 업데이트
export const updateTodoDueDate = async (todoId: string, dueDate: Timestamp | null) => {
  return updateTodo(todoId, { dueDate: dueDate || undefined });
};
