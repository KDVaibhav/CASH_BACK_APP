import React, { useEffect, useRef, useState } from "react";
import { TierType } from "../../types";
import { Button } from "../button";
import { ChevronDown, Plus } from "lucide-react";
import { EligibilityRule } from "./eligibilityRule";
export const Tier = ({
  tier,
  setTier,
}: {
  tier: TierType;
  setTier: (e: TierType) => void;
}) => {
  const { tierPos, eligibilityRules: ERs, eligibilityType: type } = tier;
  const { amount, currency } = tier.value;
  const [open, setOpen] = useState(true);
  const addER = () => {};
  return (
    <div className="border-gray-300 border rounded-xl">
      <div
        className={`flex justify-between bg-gray-50 p-4 ${
          open ? "rounded-t-xl" : "rounded-xl"
        }`}
      >
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setOpen(!open)}
            className={`${!open && "-rotate-90"} transition-transform `}
          >
            <ChevronDown className="w-4" />
          </button>
          <div>Tier {tierPos}</div>
        </div>
        <div className=""></div>
      </div>
      <div
        className={`p-4 space-y-2 block ${
          !open && "hidden"
        } transition-transform `}
      >
        <div className="flex items-center justify-between">
          <span>Eligibility rules</span>
          <Button
            className="bg-gray-100 text-black hover:bg-gray-200"
            onClick={addER}
            label={
              <span className="flex gap-2">
                <Plus className="w-4" /> <span>Add rule</span>
              </span>
            }
          />
        </div>
        {/* ERs */}
        {ERs?.map((er, idx) => (
          <EligibilityRule key={idx} er={er} />
        ))}
        {/* value */}
        <div className="">
          <span>Cashback value</span>
          <div className="flex gap-2 w-full bg-gray-50 items-center p-2 rounded-xl">
            <div>{currency}</div>
            <input value={amount} placeholder="" className="w-full" onChange={setTier} />
          </div>
        </div>
      </div>
    </div>
  );
};
