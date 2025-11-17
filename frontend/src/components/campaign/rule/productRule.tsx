import React from "react";
import { ProductRuleType } from "../../../types";

export const ProductRule = ({
  rule,
  setRule,
  handleDelete,
}: {
  rule: ProductRuleType;
  setRule: (updatedRule: ProductRuleType) => void;
  handleDelete: () => void;
}) => {
  return <div>productRule</div>;
};
