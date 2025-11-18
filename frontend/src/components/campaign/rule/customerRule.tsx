import React, { useEffect, useRef, useState } from "react";
import {
  CustomerRuleType,
  EligibilityRuleType,
  TierType,
} from "../../../types";
import { CopyPlus, RefreshCcw, Trash2, X } from "lucide-react";
import { Button } from "../../button";
import { useAppStore } from "../../../store/useAppStore";

export const CustomerRule = ({
  rule,
  setRule,
  setTier,
  handleDelete,
}: {
  rule: CustomerRuleType;
  setRule: (updatedRule: CustomerRuleType) => void;
  tier: TierType;
  setTier: (duplicateRule: EligibilityRuleType) => void;
  handleDelete: () => void;
}) => {
  const store = useAppStore((s) => s.store);
  const [val, setVal] = useState("");

  const handleRefresh = () => {
    setRule({
      ...rule,
      option: rule.type === "CUSTOMER TAGS" ? "IS" : "GTE",
      value: [],
    });
    setVal("");
  };
  const handleDuplicate = () => {
    setTier({
      category: "CUSTOMER",
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
        {rule.option === "IS" || rule.option === "IS_NOT" ? (
          <select
            name="customerRuleOption"
            id={`customerRuleOption-${rule.type}`}
            value={rule.option}
            onChange={(e) =>
              setRule({
                ...rule,
                option: e.target.value as typeof rule.option,
              })
            }
            className="text-sm border-b border-gray-200 py-1"
          >
            <option value="IS">Is</option>
            <option value="IS_NOT">Is Not</option>
          </select>
        ) : (
          <select
            name="customerRuleOption"
            id={`customerRuleOption-${rule.type}`}
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
        {rule.option === "IS" || rule.option === "IS_NOT" ? (
          <div className="">
            <div className="flex gap-2">
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
                        value: [...rule.value.filter((tag) => tag !== v)],
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
                placeholder="Enter tag"
                className="text-sm border-b border-gray-200 py-1 w-3/4"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div>{store.currency}</div>
            <input
              type="number"
              value={rule.value[0] ?? ""}
              onChange={(e) =>
                setRule({
                  ...rule,
                  value: [e.target.value.toString()],
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
