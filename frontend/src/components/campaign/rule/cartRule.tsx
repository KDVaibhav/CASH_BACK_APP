import React from "react";
import { CartRuleType } from "../../../types";

export const CartRule = ({
  rule,
  setRule,
  handleDelete,
}: {
  rule: CartRuleType;
  setRule: (updatedRule: CartRuleType) => void;
  handleDelete: () => void;
}) => {
  return <div>cartRule</div>;
};