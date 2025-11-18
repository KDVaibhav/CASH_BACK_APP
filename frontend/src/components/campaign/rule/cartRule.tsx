import React, { useEffect, useRef, useState } from "react";
import {
  CartRuleType,
  EligibilityRuleType,
  Qty,
  TierType,
} from "../../../types";
import { CopyPlus, RefreshCcw, Trash2, X } from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";

export const CartRule = ({
  rule,
  setRule,
  tier,
  setTier,
  handleDelete,
}: {
  rule: CartRuleType;
  setRule: (updatedRule: CartRuleType) => void;
  tier: TierType;
  setTier: (duplicateRule: EligibilityRuleType) => void;
  handleDelete: () => void;
}) => {
  const store = useAppStore((s) => s.store);
  const [val, setVal] = useState("");

  const handleRefresh = () => {
    setRule({
      ...rule,
      qty:
        rule.type === "CART QUANTITY"
          ? {
              qtyOption: "UNIQUE",
              compOperators: "GTE",
              qty: 0,
            }
          : undefined,

      option: rule.type === "CART TOTAL" ? "GTE" : undefined,
      value: rule.type === "CART TOTAL" ? "100" : undefined,
    });
    setVal("");
  };
  const handleDuplicate = () => {
    setTier({
      category: "CART",
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
        {rule.option && (
          <select
            name="cartRuleOption"
            id={`cartRuleOption-${rule.type}`}
            value={rule.option}
            onChange={(e) =>
              setRule({
                ...rule,
                option: e.target.value as typeof rule.option,
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
          <select
            name="cartRuleQtyOption"
            id={`cartRuleQtyOption-${rule.type}`}
            value={rule.qty.qtyOption}
            onChange={(e) =>
              setRule({
                ...rule,
                qty: {
                  ...rule.qty,
                  qtyOption: e.target.value as typeof rule.qty.qtyOption,
                } as Qty,
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
            name="cartRuleOption"
            id={`cartRuleQtycompOperators-${rule.type}`}
            value={rule.qty.compOperators}
            onChange={(e) =>
              setRule({
                ...rule,
                qty: {
                  ...rule.qty,
                  compOperators: e.target
                    .value as typeof rule.qty.compOperators,
                } as Qty,
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
                  } as Qty,
                })
              }
              className="text-sm border-b border-gray-200 py-1 w-3/4"
            />
          </div>
        )}

        {rule.option && (
          <div className="flex items-center gap-2">
            <div>{store.currency}</div>
            <input
              type="number"
              value={rule.value![0] ?? ""}
              onChange={(e) =>
                setRule({
                  ...rule,
                  value: e.target.value.toString(),
                })
              }
              className="text-sm border-b border-gray-200 py-1 w-3/4"
            />
          </div>
        )}
      </div>
    </div>
  );
};
