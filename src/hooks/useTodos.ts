import { useEffect, useState } from "react";
import { useTodos as useBaseTodos } from "../contexts/TodoContext";
import { Todo } from "../types";

type StatusFilter = "all" | "active" | "completed";
type PriorityFilter = "all" | "high" | "medium" | "low";
type DueDateFilter = "all" | "today" | "week" | "month";
type SortOption = "createdAt" | "dueDate" | "priority";

interface Filters {
  status: StatusFilter;
  priority: PriorityFilter;
  dueDate: DueDateFilter;
  searchTerm: string;
}

export const useTodos = () => {
  const { todos, ...rest } = useBaseTodos();
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    priority: "all",
    dueDate: "all",
    searchTerm: "",
  });
  const [sortOption, setSortOption] = useState<SortOption>("createdAt");

  useEffect(() => {
    let result = [...todos];

    // 상태 필터
    if (filters.status === "active") {
      result = result.filter((todo) => !todo.completed);
    } else if (filters.status === "completed") {
      result = result.filter((todo) => todo.completed);
    }

    // 우선순위 필터
    if (filters.priority !== "all") {
      result = result.filter((todo) => todo.priority === filters.priority);
    }

    // 마감일 필터
    if (filters.dueDate !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (filters.dueDate === "today") {
        result = result.filter((todo) => {
          if (!todo.dueDate) return false;
          const dueDate =
            todo.dueDate instanceof Date
              ? todo.dueDate
              : todo.dueDate?.toDate();
          if (!dueDate) return false;
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      } else if (filters.dueDate === "week") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        result = result.filter((todo) => {
          if (!todo.dueDate) return false;
          const dueDate =
            todo.dueDate instanceof Date
              ? todo.dueDate
              : todo.dueDate?.toDate();
          if (!dueDate) return false;
          return dueDate >= startOfWeek && dueDate <= endOfWeek;
        });
      } else if (filters.dueDate === "month") {
        const month = today.getMonth();
        const year = today.getFullYear();
        result = result.filter((todo) => {
          if (!todo.dueDate) return false;
          const dueDate =
            todo.dueDate instanceof Date
              ? todo.dueDate
              : todo.dueDate?.toDate();
          if (!dueDate) return false;
          return dueDate.getMonth() === month && dueDate.getFullYear() === year;
        });
      }
    }

    // 검색
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(term) ||
          (todo.description && todo.description.toLowerCase().includes(term))
      );
    }

    // 정렬
    result.sort((a, b) => {
      if (sortOption === "dueDate") {
        const aDate = a.dueDate
          ? a.dueDate instanceof Date
            ? a.dueDate
            : a.dueDate.toDate()
          : null;
        const bDate = b.dueDate
          ? b.dueDate instanceof Date
            ? b.dueDate
            : b.dueDate.toDate()
          : null;
        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;
        return aDate.getTime() - bDate.getTime();
      } else if (sortOption === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        // createdAt
        const aDate = a.createdAt
          ? a.createdAt instanceof Date
            ? a.createdAt
            : a.createdAt.toDate()
          : null;
        const bDate = b.createdAt
          ? b.createdAt instanceof Date
            ? b.createdAt
            : b.createdAt.toDate()
          : null;
        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;
        return aDate.getTime() - bDate.getTime();
      }
    });

    setFilteredTodos(result);
  }, [todos, filters, sortOption]);

  return {
    todos: filteredTodos,
    filters,
    setFilters,
    sortOption,
    setSortOption,

    ...rest,
  };
};

// 추가적인 Todo 관련 훅들
export const useTodosByPriority = () => {
  const { todos } = useBaseTodos();
  return {
    highPriority: todos.filter((todo) => todo.priority === "high"),
    mediumPriority: todos.filter((todo) => todo.priority === "medium"),
    lowPriority: todos.filter((todo) => todo.priority === "low"),
  };
};

export const useTodoStats = () => {
  const { todos } = useBaseTodos();
  return {
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    pending: todos.filter((todo) => !todo.completed).length,
    highPriority: todos.filter(
      (todo) => todo.priority === "high" && !todo.completed
    ).length,
  };
};

export const useFilteredTodos = (
  filter: "all" | "completed" | "pending" = "all"
) => {
  const { todos } = useBaseTodos();
  switch (filter) {
    case "completed":
      return todos.filter((todo) => todo.completed);
    case "pending":
      return todos.filter((todo) => !todo.completed);
    default:
      return todos;
  }
};
