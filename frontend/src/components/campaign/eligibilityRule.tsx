import React from "react";
import {
  CartRuleType,
  CustomerRuleType,
  EligibilityRuleType,
  ProductRuleType,
} from "../../types";
import { CustomerRule } from "./rule/customerRule";
import { CartRule } from "./rule/cartRule";
import { ProductRule } from "./rule/productRule";

export const EligibilityRule = ({
  er,
  index,
  setErule,
  handleDelete,
}: {
  er: EligibilityRuleType;
  index: number;
  setErule: (updatedRule: EligibilityRuleType, index: number) => void;
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
            handleDelete={handleDelete}
          />
        );
      case "CART":
        return (
          <CartRule
            rule={rule}
            setRule={handleRuleUpdate}
            handleDelete={handleDelete}
          />
        );
      case "PRODUCT":
        return (
          <ProductRule
            rule={rule}
            setRule={handleRuleUpdate}
            handleDelete={handleDelete}
          />
        );
    }
  };
  return <div>{renderRule()}</div>;
};
