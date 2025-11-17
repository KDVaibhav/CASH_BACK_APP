import React from "react";

interface DashboardCardProps {}

export const DashboardCards = ({title, description, }: DashboardCardProps) => {
  return (
    <div>
      <div>
        <div className="">
          <ShoppingCart />
          <span>Create {}</span>
        </div>
        <div>Store</div>
      </div>
    </div>
  );
};
