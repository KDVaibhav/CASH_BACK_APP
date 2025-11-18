import React, { useEffect, useRef, useState } from "react";
import { ProductRuleType, EligibilityRuleType, TierType } from "../../../types";
import { CopyPlus, RefreshCcw, Trash2, X } from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";

export const ProductRule = ({
  rule,
  setRule,
  tier,
  setTier,
  handleDelete,
}: {
  rule: ProductRuleType;
  setRule: (updatedRule: ProductRuleType) => void;
  tier: TierType;
  setTier: (duplicateRule: EligibilityRuleType) => void;
  handleDelete: () => void;
}) => {
  const store = useAppStore((s) => s.store);
  const [val, setVal] = useState("");

  const handleRefresh = () => {
    setRule({
      ...rule,
      qty: {
        qtyOption: "UNIQUE",
        compOperators: "GTE",
        qty: 0,
      },
      isInclude: true,
      value: [],
    });
    setVal("");
  };
  const handleDuplicate = () => {
    setTier({
      category: "PRODUCT",
      rule,
    });
  };

  return (
    <div className="bg-stone-100 rounded-xl border border-gray-300 p-4">
      <div className="flex justify-between">
        <div className="text-xs font-semibold">{rule.type}</div>
        <div className="flex gap-2">
          <div
            onClick={handleDuplicate}
            className="hover:bg-gray-200 p-1 rounded"
          >
            <CopyPlus className="w-4" />
          </div>
          <div
            onClick={handleRefresh}
            className="hover:bg-gray-200 p-1 rounded"
          >
            <RefreshCcw className="w-4" />
          </div>
          <div onClick={handleDelete} className="hover:bg-gray-200 p-1 rounded">
            <Trash2 className="w-4" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {rule.qty && (
          <select
            id={`cartRuleQtyOption-${rule.type}`}
            value={rule.qty.qtyOption}
            onChange={(e) =>
              setRule({
                ...rule,
                qty: {
                  ...rule.qty,
                  qtyOption: e.target.value as typeof rule.qty.qtyOption,
                },
              })
            }
            className="text-sm border-b border-gray-200 py-1"
          >
            <option value="ALL">Quantity of all selected products</option>
            <option value="SUBTOTAL">Subtotal of all selected products</option>
            <option value="UNIQUE">Quantity of all selected products</option>
          </select>
        )}
        {rule.qty && (
          <select
            id={`cartRuleQtyCompOperators-${rule.type}`}
            value={rule.qty.compOperators}
            onChange={(e) =>
              setRule({
                ...rule,
                qty: {
                  ...rule.qty,
                  compOperators: e.target
                    .value as typeof rule.qty.compOperators,
                },
              })
            }
            className="text-sm border-b border-gray-200 py-1"
          >
            <option value="GTE">Greater than or equal to</option>
            <option value="LTE">Less than or equal to</option>
            <option value="EQUAL">Equal to</option>
          </select>
        )}
        {rule.qty && (
          <div className="flex items-center gap-2">
            <div>{store.currency}</div>
            <input
              type="number"
              value={rule.qty.qty}
              onChange={(e) =>
                setRule({
                  ...rule,
                  qty: {
                    ...rule.qty,
                    qty: Number(e.target.value),
                  },
                })
              }
              className="text-sm border-b border-gray-200 py-1 w-3/4"
            />
          </div>
        )}

        <select
          id={`cartRuleIsIncluded-${rule.type}`}
          value={rule.isInclude ? "INCLUDE" : "EXCLUDE"}
          onChange={(e) =>
            setRule({
              ...rule,
              isInclude: e.target.value === "INCLUDE" ? true : false,
            })
          }
          className="text-sm border-b border-gray-200 py-1"
        >
          <option value="INCLUDE">INCLUDE</option>
          <option value="EXCLUDE">EXCLUDE</option>
        </select>
        <div className="flex items-center gap-2">
          <div className="">
            <div className="flex gap-2 flex-wrap">
              {rule.value.map((v, idx) => (
                <div
                  key={idx}
                  className="bg-gray-200 flex w-fit rounded justify-end px-2 py-1"
                >
                  <span>{v}</span>
                  <X
                    className="w-4 px-1 rounded hover:bg-gray-400"
                    onClick={(e) =>
                      setRule({
                        ...rule,
                        value: [...rule.value.filter((rv) => rv !== v)],
                      })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="">
              <input
                type="text"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && val.trim() !== "") {
                    setRule({
                      ...rule,
                      value: [...rule.value, val.trim()],
                    });
                    setVal("");
                  }
                }}
                placeholder={
                  rule.type === "SPECIFIC PRODUCTS"
                    ? "Enter Specific Product and press Enter"
                    : "Enter Specific Product with variants and press Enter"
                }
                className="text-sm border-b border-gray-200 py-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
