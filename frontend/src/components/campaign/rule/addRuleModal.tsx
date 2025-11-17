import { X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { EligibilityRuleType, TierType } from "../../../types";

export const AddRuleModal = ({
  tier,
  setTier,
  open,
  setOpen,
}: {
  tier: TierType;
  setTier: (eligibilityRule: EligibilityRuleType) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleClickEsc = (event: KeyboardEvent) => {
      if (modalRef.current && event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideModal);
    document.addEventListener("keydown", handleClickEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
      document.removeEventListener("keydown", handleClickEsc);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-xl w-80 shadow-xl" ref={modalRef}>
        <div className="flex justify-between items-center">
          <span className="font-semibold">Select Eligibility Rule</span>
          <button
            onClick={() => setOpen(false)}
            className="hover:bg-gray-100 p-1 rounded"
          >
            <X className="w-4" />
          </button>
        </div>
        <div className="mt-4">

        </div>
      </div>
    </div>
  );
};
