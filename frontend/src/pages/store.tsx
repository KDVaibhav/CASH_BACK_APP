import React, { useState } from "react";
import { Product } from "../types";

export const Store = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  return (
    <div>
      <div>Store</div>
    </div>
  );
};
