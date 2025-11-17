import React from "react";
import { twMerge } from "tailwind-merge";
export const Button = ({
  label,
  onClick,
  className,
}: {
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "bg-blue-500 hover:bg-blue-400 text-white p-2 rounded-xl border border-gray-300",
        className
      )}
    >
      {label}
    </button>
  );
};
