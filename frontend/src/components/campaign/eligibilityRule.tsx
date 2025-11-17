import React from "react";
import { EligibilityRuleType } from "../../types";
import { CustomerRule } from "./rule/customerRule";
import { CartRule } from "./rule/cartRule";
import { ProductRule } from "./rule/productRule";

export const EligibilityRule = ({ er }: { er: EligibilityRuleType }) => {
  const { category, rule } = er;
  const renderRule = () => {
    switch (category) {
      case "CUSTOMER":
        return <CustomerRule rule={rule} />;
      case "CART":
        return <CartRule rule={rule} />;
      case "PRODUCT":
        return <ProductRule rule={rule} />;
    }
  };
  return <div>{renderRule()}</div>;
};
