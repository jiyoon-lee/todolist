import React, { useState } from "react";
import { useTodos } from "../../hooks/useTodos";

const TodoFilter: React.FC = () => {
  const { filters, setFilters, sortOption, setSortOption } = useTodos();
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleStatusChange = (status: "all" | "active" | "completed") => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handlePriorityChange = (
    priority: "all" | "high" | "medium" | "low"
  ) => {
    setFilters((prev) => ({ ...prev, priority }));
  };

  const handleDueDateChange = (dueDate: "all" | "today" | "week" | "month") => {
    setFilters((prev) => ({ ...prev, dueDate }));
  };

  const handleSortChange = (sort: "createdAt" | "dueDate" | "priority") => {
    setSortOption(sort);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchTerm: value }));
    }, 400);
    setDebounceTimeout(timeout);
  };

  const handleReset = () => {
    setFilters({
      status: "all",
      priority: "all",
      dueDate: "all",
      searchTerm: "",
    });
    setSortOption("createdAt");
    setSearchTerm("");
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col gap-4 sm:p-6 md:p-8">
      <div className="flex gap-2 flex-wrap sm:gap-4">
        <select
          value={filters.status}
          onChange={(e) => handleStatusChange(e.target.value as any)}
          className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100"
        >
          <option value="all">전체</option>
          <option value="active">진행중</option>
          <option value="completed">완료</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => handlePriorityChange(e.target.value as any)}
          className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100"
        >
          <option value="all">우선순위 전체</option>
          <option value="high">높음</option>
          <option value="medium">중간</option>
          <option value="low">낮음</option>
        </select>
        <select
          value={filters.dueDate}
          onChange={(e) => handleDueDateChange(e.target.value as any)}
          className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100"
        >
          <option value="all">마감일 전체</option>
          <option value="today">오늘</option>
          <option value="week">이번주</option>
          <option value="month">이번달</option>
        </select>
        <select
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value as any)}
          className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100"
        >
          <option value="createdAt">생성일순</option>
          <option value="dueDate">마감일순</option>
          <option value="priority">우선순위순</option>
        </select>
        <button
          type="button"
          onClick={handleReset}
          className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-100"
        >
          초기화
        </button>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex gap-2 sm:gap-4"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="검색어 입력..."
          className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 w-full bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100"
        />
      </form>
    </div>
  );
};

export default TodoFilter;
