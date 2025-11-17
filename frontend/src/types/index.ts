export type ObjectId = string;
export type CampaignTypeEnum = "PERCENTAGE" | "FIXED_AMOUNT";
export type TransactionTypeEnum = "CREDIT" | "DEBIT";
export type TransactionStatusEnum =
  | "REDEEMED"
  | "ALLOTED"
  | "PENDING"
  | "FAILED"
  | "EXPIRED";

export type ProductVariantEnum = "SMALL" | "MEDIUM" | "LARGE";
export type ProductColorEnum = "BLACK" | "WHITE" | "BLUE" | "GREEN";
export type FieldsEnum = "QUANTITY" | "UNIQUEQUANTITY" | "SUBTOTAL";
export type OrderTagsEnum = "GIFT_MESSAGE";

export type TimeZoneEnum = "GMT+05:30" | string;

export interface Money {
  amount: number;
  currency: string;
}

export interface DayTime {
  days?: number;
  time?: string;
}

export interface CampaignSchedule {
  startDateTime?: Date;
  endDateTime?: Date;
}

export interface Cashback {
  value: Money;
  campaignName: string;
  campaignId: ObjectId;
  deliveryDaysTime?: DayTime;
  expirationDaysTime?: DayTime;
}

export interface Store {
  _id?: ObjectId;
  name: string;
  timeZone: TimeZoneEnum;
  currency: string;
}

export interface Customer {
  _id?: ObjectId;
  name: string;
  email: string;
  storeId: ObjectId;
  timeZone: TimeZoneEnum;
  currency: string;
  tags: string[];
  customerLifeTimeSpent: number;
  customerLifeTimeCashback: number;
}

export interface Product {
  _id?: ObjectId;
  name: string;
  storeId: ObjectId;
  collectionIds: ObjectId[];
  type: string;
  value: Money;
  variant?: ProductVariantEnum;
  color?: ProductColorEnum;
  tags: string[];
  attributes?: { key: string; value: string }[];
}

export interface Collection {
  _id?: ObjectId;
  name: string;
  storeId: ObjectId;
}

export interface ProductOrder {
  productId: ObjectId;
  quantity: number;
}

export interface Order {
  customerId: ObjectId;
  storeId: ObjectId;
  products: ProductOrder[];
  totalQuantity: number;
  value: Money;
  GMTTime: Date;
  campaignCashback?: Cashback[];
  attributes: Record<string, any>[];
}

export interface TransactionLog {
  _id?: ObjectId;
  customerId: ObjectId;
  storeId: ObjectId;
  campaignId: ObjectId;
  campaignName: string;
  deliveryDayTime?: Date;
  expiryDayTime?: Date;
  description?: string;
  type: TransactionTypeEnum;
  value: Money;
  status: TransactionStatusEnum;
}

export interface ScheduledJob {
  _id?: ObjectId;
  transactionLogId: ObjectId;
  type: "DELIVER_CASHBACK" | "EXPIRE_CASHBACK";
  category: "SCHEDULED" | "FAILED" | "COMPLETED";
  scheduledFor: Date;
  processedAt?: Date;
  retries: number;
  error?: string;
}

export type QtyOption = "UNIQUE" | "ALL" | "SUBTOTAL";
export type CompOperator = "GTE" | "LTE" | "EQUAL";

export interface Qty {
  qtyOption: QtyOption;
  compOperators: CompOperator;
  qty: number;
}

export interface CustomerRuleType {
  type: "CUSTOMER_TAGS" | "CUSTOMER_LIFETIME_SPENT";
  option: "IS" | "IS_NOT" | "GTE" | "LTE" | "EQUAL";
  value: string[];
}

export interface CartRuleType {
  type: "CART_QUANTITY" | "CART_TOTAL" | "CART_ATTRIBUTES" | "CART_CURRENCY";
  attribute?: {
    isSelected: boolean;
    subOption: "IS" | "IS_NOT" | "CONTAINS" | "DOES_NOT_CONTAINS";
  };
  qty?: Qty;
  option: "GTE" | "LTE" | "EQUAL" | "IS" | "IS_NOT";
  value: string;
}

export interface ProductRuleType {
  type:
    | "SPECIFIC_PRODUCTS"
    | "PRODUCTS_WITH_VARIANTS"
    | "COLLECTIONS"
    | "PRODUCT_LINE_ATTRIBUTES"
    | "PRODUCT_TAGS"
    | "PRODUCT_TYPES";
  qty: Qty;
  isInclude: boolean;
  attribute?: {
    isSelected: boolean;
    subOption: "IS" | "IS_NOT" | "CONTAINS" | "DOES_NOT_CONTAINS";
  };
  value: string[];
}

export type EligibilityRuleType =
  | { category: "CUSTOMER"; rule: CustomerRuleType }
  | { category: "CART"; rule: CartRuleType }
  | { category: "PRODUCT"; rule: ProductRuleType };

export interface TierType {
  _id?: ObjectId;
  tierPos: number;
  eligibilityType?: "AND" | "OR";
  eligibilityRules?: EligibilityRuleType[];
  value: Money;
}

export interface CampaignType {
  _id?: ObjectId;
  name: string;
  storeId: ObjectId;
  isEnabled: boolean;
  type: CampaignTypeEnum;
  timeZone: TimeZoneEnum;
  campaignSchedule?: CampaignSchedule;
  deliveryDaysTime?: DayTime;
  expirationDaysTime?: DayTime;
  tiers: TierType[];
}
