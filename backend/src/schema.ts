import mongoose, { Mongoose } from "mongoose";
import { exchangeRates, TimeZone } from "./data";
import {
  CampaignType,
  CollectionType,
  CustomerType,
  ProductType,
  ScheduleJobType,
  StoreType,
  TransactionLogType,
} from "./zod-schema";
export type CurrencyCode = keyof typeof exchangeRates;

const CampaignType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED_AMOUNT: "FIXED_AMOUNT",
};

const TransactionType = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT",
};

const OrderTags = {
  GIFT_MESSAGE: "GIFT_MESSAGE",
};

export const TransactionStatus = {
  REDEEMED: "REDEEMED",
  CREDITED: "CREDITED",
  PENDING: "PENDING",
  FAILED: "FAILED",
  EXPIRED: "EXPIRED",
};

const ProductVariant = {
  SMALL: "SMALL",
  MEDIUM: "MEDIUM",
  LARGE: "LARGE",
};

const ProductColor = {
  BLACK: "BLACK",
  WHITE: "WHITE",
  BLUE: "BLUE",
  GREEN: "GREEN",
};

const MoneySchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    currency: {
      type: String,
      enum: Object.keys(exchangeRates),
      required: true,
    },
  },
  { _id: false }
);

const dayTimeSchema = new mongoose.Schema(
  {
    days: { type: Number, required: true },
    time: { type: String, required: true },
  },
  {
    _id: false,
  }
);

const campaignScheduleSchema = new mongoose.Schema(
  {
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
  },
  {
    _id: false,
  }
);

const attributeSchema = new mongoose.Schema(
  {
    isSelected: { type: Boolean, required: true },
    subOption: {
      type: String,
      enum: ["IS", "IS_NOT", "CONTAINS", "DOES_NOT_CONTAINS"],
      required: true,
    },
  },
  {
    _id: false,
  }
);

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  timeZone: {
    type: String,
    enum: Object.keys(TimeZone),
    required: true,
  },
  currency: { type: String, enum: Object.keys(exchangeRates), required: true },
});

//done
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  storeId: { type: String, required: true },
  tags: { type: [String] },
  timeZone: {
    type: String,
    enum: Object.keys(TimeZone),
    required: true,
  },
  currency: { type: String, enum: Object.keys(exchangeRates), required: true },
  customerLifeTimeSpent: { type: Number, default: 0 },
  customerLifeTimeCashback: { type: Number, default: 0 },
});

//done
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  type: { type: String, required: true },
  collectionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
  value: { type: MoneySchema, required: true },
  variant: {
    type: String,
    enum: Object.values(ProductVariant),
  },
  color: { type: String, enum: Object.values(ProductColor) },
  tags: { type: [String] },
  attributes: { type: Map, of: String },
});

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
});

// const orderSchema = new mongoose.Schema({
//   customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
//   storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
//   productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
//   value: { type: MoneySchema, required: true },
//   campaignCashback: { type: Number, default: 0 },
//   tags: { type: [OrderTags], default: [] },
// });

const transactionLogSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    }, //for processing transactions
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    campaignName: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    expiryDayTime: { type: dayTimeSchema },
    deliveryDayTime: { type: dayTimeSchema },
    value: { type: MoneySchema, required: true },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
    },
  },
  { timestamps: true }
);

const scheduledJobSchema = new mongoose.Schema({
  transactionLogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transactionLog",
    required: true,
  },
  type: { type: String, enum: ["DELIVER_CASHBACK", "EXPIRE_CASHBACK"] },
  category: { type: String, enum: ["SCHEDULED", "FAILED", "COMPLETED"] },
  scheduledFor: { type: Date, required: true },
  processedAt: { type: Date },
  retries: { type: Number, default: 0 },
  error: { type: String },
});

const qtySchema = new mongoose.Schema(
  {
    qtyOption: {
      type: String,
      enum: ["UNIQUE", "ALL", "SUBTOTAL"],
      required: true,
    },
    compOperators: {
      type: String,
      enum: ["GTE", "LTE", "EQUAL"],
      required: true,
    },
    qty: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

const customerERSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["CUSTOMER_TAGS", "CUSTOMER_LIFETIME_SPENT"],
      required: true,
    },
    option: {
      type: String,
      enum: ["IS", "IS_NOT", "GTE", "LTE", "EQUAL"],
      required: true,
    },
    value: { type: [String], required: true },
  },
  { _id: false }
);

const cartERSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["CART_QUANTITY", "CART_TOTAL", "CART_ATTRIBUTES", "CART_CURRENCY"],
      required: true,
    },
    attribute: { type: attributeSchema },
    qty: { type: qtySchema },
    option: {
      type: String,
      enum: ["GTE", "LTE", "EQUAL", "IS", "IS_NOT"],
      required: true,
    },
    value: { type: String, required: true },
  },
  { _id: false }
);

const productERSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "SPECIFIC_PRODUCTS",
        "PRODUCTS_WITH_VARIANTS",
        "COLLECTIONS",
        "PRODUCT_LINE_ATTRIBUTES",
        "PRODUCT_TAGS",
        "PRODUCT_TYPES",
      ],
      required: true,
    },
    qty: { type: qtySchema, required: true },
    isInclude: {
      type: Boolean,
      required: true,
    },
    attribute: { type: attributeSchema },
    value: { type: [String], required: true },
  },
  { _id: false }
);

const eligibilityRuleSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["CUSTOMER", "CART", "PRODUCT"],
      required: true,
    },
    customerRule: { type: customerERSchema },
    cartRule: { type: cartERSchema },
    productRule: { type: productERSchema },
    // operator: { type: String, enum: Object.keys(Operator) },
    // subOperator: { type: String, enum: Object.keys(Operator) },
    // subSubOperator: { type: String, enum: Object.keys(Operator) },
    // value: { type: [String] },
    // subValue: { type: [String] },
  },
  {
    _id: false,
  }
);

const TierSchema = new mongoose.Schema(
  {
    tierPos: { type: Number, required: true }, //change it to level
    eligibilityType: { type: String, enum: ["AND", "OR"], required: true },
    eligibilityRules: [
      {
        type: eligibilityRuleSchema,
        required: true,
      },
    ],
    value: { type: MoneySchema, required: true }, //shift currency to campaign
  },
  { _id: false }
);

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    isEnabled: { type: Boolean, default: false },
    type: {
      type: String,
      enum: Object.values(CampaignType),
      required: true,
    },
    timeZone: {
      type: String,
      enum: Object.keys(TimeZone),
      required: true,
    },
    campaignSchedule: { type: campaignScheduleSchema },
    deliveryDaysTime: { type: Date },
    expirationDaysTime: { type: Date },
    tiers: [{ type: TierSchema, required: true }],
  },
  { timestamps: true }
);

export const Store = mongoose.model<StoreType>("Store", storeSchema);
export const Campaign = mongoose.model<CampaignType>(
  "Campaign",
  campaignSchema
);
export const Product = mongoose.model<ProductType>("Product", productSchema);
export const Collection = mongoose.model<CollectionType>(
  "Collection",
  collectionSchema
);
export const Customer = mongoose.model<CustomerType>(
  "Customer",
  customerSchema
);
export const TransactionLog = mongoose.model<TransactionLogType>(
  "TransactionLog",
  transactionLogSchema
);

export const ScheduledJob = mongoose.model<ScheduleJobType>(
  "ScheduleJob",
  scheduledJobSchema
);
