import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import {
  CartRuleType,
  CartRuleTypeEnum,
  CustomerRuleType,
  CustomerRuleTypeEnum,
  EligibilityRuleType,
  ProductRuleType,
  ProductRuleTypeEnum,
} from "../../../types";
import { rules } from "../../../data";
import { Button } from "../../button";

export const AddRuleModal = ({
  setRule,
  setOpen,
}: {
  setRule: (eligibilityRule: EligibilityRuleType) => void;
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
      <div
        className="bg-white p-4 rounded-xl w-100 shadow-xl max-h-96 overflow-y-scroll"
        ref={modalRef}
      >
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="font-semibold">Select Eligibility Rule</span>
          <button
            onClick={() => setOpen(false)}
            className="hover:bg-gray-100 p-1 rounded"
          >
            <X className="w-4" />
          </button>
        </div>
        {/* rules */}
        <div className="flex flex-col gap-4 mt-4 ">
          {rules.map((er, catIdx) => (
            <div className="" key={catIdx}>
              <div className="flex flex-col gap-2 text-lg">{er.category}</div>
              {er.rules.map((r, rIdx) => (
                <div
                  key={rIdx}
                  className="flex justify-between px-4 py-2 items-center hover:bg-gray-200 rounded-xl"
                  onClick={() => {
                    let category = er.category.split(" ")[0].toUpperCase();
                    let { description, ...rule } = r;
                    console.log(category);
                    if (category === "CUSTOMER") {
                      rule.type =
                        rule.type.toUpperCase() as CustomerRuleTypeEnum;
                      setRule({
                        category: "CUSTOMER",
                        rule: rule as CustomerRuleType,
                      });
                    } else if (category === "CART") {
                      rule.type = rule.type.toUpperCase() as CartRuleTypeEnum;
                      setRule({
                        category: "CART",
                        rule: rule as CartRuleType,
                      });
                    } else if (category === "PRODUCT") {
                      rule.type =
                        rule.type.toUpperCase() as ProductRuleTypeEnum;
                      setRule({
                        category: "PRODUCT",
                        rule: rule as ProductRuleType,
                      });
                    }
                    setOpen(false);
                  }}
                >
                  <div>
                    <div className="">{r.type}</div>
                    <div className="text-sm text-wrap text-gray-500">
                      {r.description}
                    </div>
                  </div>
                  <ChevronRight className="w-4 text-gray-500" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button
            label="Cancel"
            onClick={() => setOpen(false)}
            className="bg-gray-100 text-black hover:bg-gray-200"
          />
        </div>
      </div>
    </div>
  );
};
