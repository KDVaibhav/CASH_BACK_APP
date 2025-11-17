import React from "react";
import { CustomerRuleType } from "../../../types";

export const CustomerRule = ({
  rule,
  setRule,
  handleDelete,
}: {
  rule: CustomerRuleType;
  setRule: (updatedRule: CustomerRuleType) => void;
  handleDelete: () => void;
}) => {
  return <div>C</div>;
};
