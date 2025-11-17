import { Info, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigationStore } from "../store/useNavigationStore";
import { Button } from "../components/button";
import { CampaignType, EligibilityRuleType, TierType } from "../types";
import { Tier } from "../components/campaign/tier";
import { useAppStore } from "../store/useAppStore";

export const CreateCampaign = () => {
  const store = useAppStore((s) => s.store);
  const { _id, timeZone, currency } = store!;
  const emptyTier: TierType = {
    tierPos: 1,
    eligibilityType: "OR",
    value: {
      amount: 100,
      currency: currency,
    },
    eligibilityRules: [],
  };

  const emptyCampaign: CampaignType = {
    name: "",
    storeId: _id!,
    isEnabled: true,
    type: "PERCENTAGE",
    timeZone: timeZone,
    tiers: [emptyTier],
  };
  const [formData, setFormData] = useState<CampaignType>(emptyCampaign);

  const handleSubmit = () => {};
  const addTier = () => {
    setFormData((prev) => ({
      ...prev,
      tiers: [
        ...prev.tiers,
        { ...emptyTier, tierPos: formData.tiers.length + 1 },
      ],
    }));
  };
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-3xl font-semibold">Create New Campaign</span>
        <Button label="Save Campaign" onClick={handleSubmit} />
      </div>
      {/* Eligibility Rule */}
      <div className="bg-white rounded-xl p-4 space-y-3">
        <div className=" flex justify-between border-b border-gray-300 pb-4">
          <span className="flex items-center gap-1 font-bold text-xl">
            <span>Campaign Eligibility Rules</span>
            <Info className="w-4" />
          </span>
          <Button
            className="bg-gray-100 hover:bg-gray-200 text-black"
            onClick={addTier}
            label={
              <span className="flex gap-2">
                <Plus className="w-4" /> <span>Add Tiers</span>
              </span>
            }
          />
        </div>
        {formData.tiers &&
          formData.tiers.map((tier: TierType, id) => (
            <Tier
              tier={tier}
              setTier={(updatedTier) =>
                setFormData((prev) => ({
                  ...prev,
                  tiers: prev.tiers.map((t) =>
                    t.tierPos === tier.tierPos ? updatedTier : t
                  ),
                }))
              }
              key={id}
              handleDelete={() =>
                setFormData((prev) => ({
                  ...prev,
                  tiers: prev.tiers.filter(
                    (t, idx) => t.tierPos !== tier.tierPos
                  ),
                }))
              }
            />
          ))}
      </div>
    </div>
  );
};
