import React from "react";

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  className = "",
}) => (
  <div
    className={`bg-gray-200 animate-pulse rounded ${className}`}
    style={{ width, height }}
    aria-busy="true"
    aria-label="Loading..."
  />
);

export default Skeleton;
