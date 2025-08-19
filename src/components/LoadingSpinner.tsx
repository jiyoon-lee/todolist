import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
}

const sizeClasses = {
  small: "w-4 h-4",
  medium: "w-8 h-8",
  large: "w-12 h-12",
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "medium" }) => (
  <div className="flex justify-center items-center">
    <div
      className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}
    />
  </div>
);

export default LoadingSpinner;
