import React from "react";
import { EligibilityRuleType, TierType } from "../../types";
import { CustomerRule } from "./rule/customerRule";
import { CartRule } from "./rule/cartRule";
import { ProductRule } from "./rule/productRule";

export const EligibilityRule = ({
  er,
  index,
  setErule,
  tier,
  setTier,
  handleDelete,
}: {
  er: EligibilityRuleType;
  index: number;
  setErule: (updatedRule: EligibilityRuleType, index: number) => void;
  tier: TierType;
  setTier: (duplicateRule: EligibilityRuleType) => void;
  handleDelete: () => void;
}) => {
  const { category, rule } = er;
  const handleRuleUpdate = (updatedRule: any) => {
    setErule({ category, rule: updatedRule }, index);
  };
  const renderRule = () => {
    switch (category) {
      case "CUSTOMER":
        return (
          <CustomerRule
            rule={rule}
            setRule={handleRuleUpdate}
            tier={tier}
            setTier={setTier}
            handleDelete={handleDelete}
          />
        );
      case "CART":
        return (
          <CartRule
            rule={rule}
            setRule={handleRuleUpdate}
            tier={tier}
            setTier={setTier}
            handleDelete={handleDelete}
          />
        );
      case "PRODUCT":
        return (
          <ProductRule
            rule={rule}
            setRule={handleRuleUpdate}
            tier={tier}
            setTier={setTier}
            handleDelete={handleDelete}
          />
        );
    }
  };
  return <div>{renderRule()}</div>;
};
