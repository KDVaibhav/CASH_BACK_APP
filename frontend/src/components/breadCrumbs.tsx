import React from "react";
import { useNavigationStore } from "../store/useNavigationStore";
import { Home } from "lucide-react";

export const BreadCrumbs = () => {
  const breadcrumbs = useNavigationStore((s) => s.breadcrumbs);
  const navigate = useNavigationStore((s) => s.navigate);
  return (
    <div className="py-4 text-sm flex items-center space-x-2">
      {breadcrumbs.length > 1 &&
        breadcrumbs.map((b, idx) => (
          <span
            key={idx}
            onClick={() => {
              const targetPage = b.label;
              const newTrail = breadcrumbs.slice(0, idx + 1);
              navigate(targetPage, newTrail);
            }}
            className="cursor-pointer flex items-center space-x-2"
          >
            <span>
              {b.label === "Home" ? <Home className="w-5" /> : b.label}
            </span>
            <span>{idx < breadcrumbs.length - 1 && ">"}</span>
          </span>
        ))}
    </div>
  );
};
