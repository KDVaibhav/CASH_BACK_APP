import React, { useEffect, useRef, useState } from "react";
import { EligibilityRuleType, TierType } from "../../types";
import { Button } from "../button";
import { ChevronDown, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { EligibilityRule } from "./eligibilityRule";
import { AddRuleModal } from "./rule/addRuleModal";
export const Tier = ({
  tier,
  setTier,
  handleDelete,
}: {
  tier: TierType;
  setTier: (e: TierType) => void;
  handleDelete: () => void;
}) => {
  const { tierPos, eligibilityRules, eligibilityType: type } = tier;
  const { amount, currency } = tier.value;
  const [tierOpen, setTierOpen] = useState(true);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const handleRefresh = () => {};
  return (
    <div className=" border-gray-300 border rounded-xl">
      {ruleModalOpen && (
        <AddRuleModal
          open={ruleModalOpen}
          setOpen={setRuleModalOpen}
          tier={tier}
          setTier={(eligibilityRule: EligibilityRuleType) => ({
            ...tier,
            eligibilityRule: [...tier.eligibilityRules, eligibilityRule],
          })}
        />
      )}
      <div
        className={`flex justify-between bg-gray-50 p-4 ${
          tierOpen ? "rounded-t-xl" : "rounded-xl"
        }`}
      >
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setTierOpen(!tierOpen)}
            className={`${!open && "-rotate-90"} transition-transform `}
          >
            <ChevronDown className="w-4" />
          </button>
          <div>Tier {tierPos}</div>
        </div>
        <div className="flex gap-2">
          <div onClick={handleRefresh} className="cursor-pointer">
            <RefreshCcw className="w-4" />
          </div>
          <div onClick={handleDelete} className="cursor-pointer">
            <Trash2 className="w-4" />
          </div>
        </div>
      </div>
      <div
        className={`p-4 space-y-2 block ${
          !tierOpen && "hidden"
        } transition-transform `}
      >
        <div className="flex items-center justify-between">
          <span>Eligibility rules</span>
          <Button
            className="bg-gray-100 text-black hover:bg-gray-200"
            onClick={() => setRuleModalOpen(true)}
            label={
              <span className="flex gap-2">
                <Plus className="w-4" /> <span>Add rule</span>
              </span>
            }
          />
        </div>
        {/* ERs */}
        {eligibilityRules.length > 0 &&
          eligibilityRules.map((eligibilityRule: EligibilityRuleType, idx) => (
            <EligibilityRule
              key={idx}
              er={eligibilityRule}
              index={idx}
              setErule={(updatedRule: EligibilityRuleType, index: number) =>
                setTier({
                  ...tier,
                  eligibilityRules: tier.eligibilityRules.map((er, i) =>
                    i === index ? updatedRule : er
                  ),
                })
              }
              handleDelete={() =>
                setTier({
                  ...tier,
                  eligibilityRules: tier.eligibilityRules.filter(
                    (_, i) => i !== idx
                  ),
                })
              }
            />
          ))}
        {/* value */}
        <div className="">
          <span>Cashback value</span>
          <div className="flex gap-2 w-full bg-gray-50 items-center p-2 rounded-xl">
            <div>{currency}</div>
            <input
              value={amount}
              type="number"
              placeholder=""
              className="w-full pl-2"
              onChange={(e) =>
                setTier({
                  ...tier,
                  value: {
                    ...tier.value,
                    amount: Number(e.target.value),
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
