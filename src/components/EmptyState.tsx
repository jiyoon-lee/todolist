import React from "react";

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = "데이터가 없습니다.",
  icon,
}) => (
  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
    {icon && <div className="mb-2">{icon}</div>}
    <span>{message}</span>
  </div>
);

export default EmptyState;
