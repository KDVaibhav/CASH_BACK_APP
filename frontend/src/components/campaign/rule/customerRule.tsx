import React, { useState } from "react";
import { CustomerRuleType } from "../../../types";
import { X } from "lucide-react";
import { Button } from "../../button";

export const CustomerRule = ({
  rule,
  setRule,
  handleDelete,
}: {
  rule: CustomerRuleType;
  setRule: (updatedRule: CustomerRuleType) => void;
  handleDelete: () => void;
}) => {
  const [val, setVal] = useState("");
  const addVal = () => {
    setRule({
      ...rule,
      value: [...rule.value, val],
    });
  };
  const removeVal = (e: string) => {
    setRule({
      ...rule,
      value: [...rule.value.filter((v) => v !== e)],
    });
  };
  return (
    <div className="bg-stone-100 rounded-xl border border-gray-300 p-4">
      <div className="text-xs font-semibold">{rule.type}</div>
      <div className="3">
        {rule.option === "IS" || rule.option === "IS_NOT" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      onClick={handleDelete}
                    />
                  </div>
                ))}
              </div>
              <div>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  placeholder="Enter Tag"
                  className="text-sm border-b border-gray-200 py-1"
                />
                <Button label="Add" onClick={addVal} className="py-0" />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
            >
              <option value="GTE">Greater than or equal to</option>
              <option value="LTE">Less than or equal to</option>
              <option value="EQUAL">Equal to</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
