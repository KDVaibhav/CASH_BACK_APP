import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { PlusCircle } from "lucide-react";
import { useNavigationStore } from "../store/useNavigationStore";

export const Navbar = () => {
  const navigate = useNavigationStore((s) => s.navigate);
  const store = useAppStore((state) => state.store);
  return (
    <div className="flex justify-between px-4 items-center shadow py-4">
      <div className="font-bold">
        {store ? (
          <div>
            Active Store: <span className="text-blue-500"></span>
            {store.name}
          </div>
        ) : (
          <div>No Store Selected</div>
        )}
      </div>
      <button
        onClick={() =>
          navigate("Create Store", [
            { label: "Home", path: "/" },
            { label: "Create Store", path: "/createStore" },
          ])
        }
        className="bg-green-600 text-white flex p-2 rounded-xl gap-2"
      >
        <PlusCircle className="w-5" />
        Create Store
      </button>
    </div>
  );
};
