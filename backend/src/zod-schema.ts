import { z } from "zod";
import { EligibilityRuleType, exchangeRates, TimeZone } from "./data";
import mongoose from "mongoose";

const objectId = z.union([
  z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId (expect 24-hex characters)"),
  z.instanceof(mongoose.Types.ObjectId),
]);

export const CampaignTypeEnum = z.enum(["PERCENTAGE", "FIXED_AMOUNT"]);
export const TransactionTypeEnum = z.enum(["CREDIT", "DEBIT"]);
export const TransactionStatusEnum = z.enum([
  "REDEEMED",
  "ALLOTED",
  "PENDING",
  "FAILED",
  "EXPIRED",
]);
export const ProductVariantEnum = z.enum(["SMALL", "MEDIUM", "LARGE"]);
export const ProductColorEnum = z.enum(["BLACK", "WHITE", "BLUE", "GREEN"]);

export const FieldsEnum = z.enum(["QUANTITY", "UNIQUEQUANTITY", "SUBTOTAL"]);

export const OrderTagsEnum = z.enum(["GIFT_MESSAGE"]);

const timeZoneValues = Object.keys(TimeZone) as string[]; // in your mongoose you used Object.keys(TimeZone)
export const TimeZoneEnum = z.enum(
  timeZoneValues.length
    ? (timeZoneValues as [string, ...string[]])
    : ["GMT+05:30"]
);

export const MoneyZ = z.object({
  amount: z.number().nonnegative(),
  currency: z.enum(Object.keys(exchangeRates)),
});

export const DayTimeZ = z.object({
  days: z.number().int().nonnegative().optional().default(90),
  time: z.string().optional().default("10:00AM"),
});

export const CampaignScheduleZ = z.object({
  startDateTime: z.coerce.date().optional(),
  endDateTime: z.coerce.date().optional(),
});

export const CashbackZ = z.object({
  value: MoneyZ,
  campaignName: z.string(),
  campaignId: objectId,
  deliveryDaysTime: DayTimeZ.optional(),
  expirationDaysTime: DayTimeZ.optional(),
});

export const StoreZ = z.object({
  _id: objectId.optional(),
  name: z.string().min(1),
  timeZone: TimeZoneEnum.default("GMT+05:30"),
  currency: z.enum(Object.keys(exchangeRates)),
});

export const CustomerZ = z.object({
  _id: objectId.optional(),
  name: z.string().min(1),
  email: z.string().email(),
  storeId: objectId,
  timeZone: TimeZoneEnum.default("GMT+05:30"),
  currency: z.enum(Object.keys(exchangeRates)).default("INR"),
  tags: z.array(z.string()).optional().default([]),
  customerLifeTimeSpent: z.number().nonnegative().optional().default(0),
  customerLifeTimeCashback: z.number().nonnegative().optional().default(0),
});

export const ProductZ = z.object({
  _id: objectId.optional(),
  name: z.string().min(1),
  storeId: objectId,
  collectionIds: z.array(objectId).optional().default([]),
  type: z.string(),
  value: MoneyZ,
  variant: ProductVariantEnum.optional(),
  color: ProductColorEnum.optional(),
  tags: z.array(z.string()).optional().default([]),
  attributes: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

export const CollectionZ = z.object({
  _id: objectId.optional(),
  name: z.string().min(1),
  storeId: objectId,
});

const productOrder = z.object({
  productId: objectId,
  quantity: z.number().default(1),
});

export const OrderZ = z.object({
  customerId: objectId,
  storeId: objectId,
  products: z.array(productOrder),
  totalQuantity: z.number(),
  value: MoneyZ,
  GMTTime: z.coerce.date(),
  campaignCashback: z.array(CashbackZ).optional(),
  attributes: z.array(z.object()).optional().default([]),
});

export const TransactionLogZ = z.object({
  _id: objectId.optional(),
  customerId: objectId,
  storeId: objectId,
  campaignId: objectId,
  campaignName: z.string(),
  deliveryDayTime: z.date().optional(),
  expiryDayTime: z.date().optional(),
  description: z.string().optional(),
  type: TransactionTypeEnum.default("CREDIT"),
  value: MoneyZ,
  status: TransactionStatusEnum.default("PENDING"),
});

export const QtyZ = z.object({
  qtyOption: z.enum(["UNIQUE", "ALL", "SUBTOTAL"]),
  compOperators: z.enum(["GTE", "LTE", "EQUAL"]),
  qty: z.number(),
});

export const CustomerRuleZ = z.object({
  type: z.enum(["CUSTOMER_TAGS", "CUSTOMER_LIFETIME_SPENT"]),
  option: z.enum(["IS", "IS_NOT", "GTE", "LTE", "EQUAL"]),
  value: z.array(z.string()),
});

export const CartRuleZ = z.object({
  type: z.enum([
    "CART_QUANTITY",
    "CART_TOTAL",
    "CART_ATTRIBUTES",
    "CART_CURRENCY",
  ]),
  attribute: z
    .object({
      isSelected: z.boolean(),
      subOption: z.enum(["IS", "IS_NOT", "CONTAINS", "DOES_NOT_CONTAINS"]),
    })
    .optional(),
  qty: QtyZ.optional(),
  option: z.enum(["GTE", "LTE", "EQUAL", "IS", "IS_NOT"]),
  value: z.string(),
});

export const ProductRuleZ = z.object({
  type: z.enum([
    "SPECIFIC_PRODUCTS",
    "PRODUCTS_WITH_VARIANTS",
    "COLLECTIONS",
    "PRODUCT_LINE_ATTRIBUTES",
    "PRODUCT_TAGS",
    "PRODUCT_TYPES",
  ]),
  qty: QtyZ,
  isInclude: z.boolean(),
  attribute: z
    .object({
      isSelected: z.boolean(),
      subOption: z.enum(["IS", "IS_NOT", "CONTAINS", "DOES_NOT_CONTAINS"]),
    })
    .optional(),
  value: z.array(z.string()),
});

export const EligibilityRuleZ = z.discriminatedUnion("category", [
  z.object({ category: z.literal("CUSTOMER"), rule: CustomerRuleZ }),
  z.object({ category: z.literal("CART"), rule: CartRuleZ }),
  z.object({ category: z.literal("PRODUCT"), rule: ProductRuleZ }),
]);

export const TierZ = z.object({
  _id: objectId.optional(),
  tierPos: z.number(),
  eligibilityType: z.enum(["AND", "OR"]).default("AND"),
  eligibilityRules: z.array(EligibilityRuleZ).min(1),
  value: MoneyZ,
});

export const CampaignZ = z.object({
  _id: objectId.optional(),
  name: z.string().min(1),
  storeId: objectId,
  isEnabled: z.boolean().default(false),
  type: CampaignTypeEnum.default("PERCENTAGE"),
  timeZone: TimeZoneEnum.default("GMT+05:30"),
  campaignSchedule: CampaignScheduleZ.optional(),
  deliveryDaysTime: DayTimeZ.optional(),
  expirationDaysTime: DayTimeZ.optional(),
  tiers: z.array(TierZ),
});
export type QtyType = z.infer<typeof QtyZ>;
export type StoreType = z.infer<typeof StoreZ>;
export type CampaignType = z.infer<typeof CampaignZ>;
export type CustomerType = z.infer<typeof CustomerZ>;
export type ProductType = z.infer<typeof ProductZ>;
export type CollectionType = z.infer<typeof CollectionZ>;
export type TransactionLogType = z.infer<typeof TransactionLogZ>;
export type CashbackType = z.infer<typeof CashbackZ>;
export type OrderType = z.infer<typeof OrderZ>;
export type EligibilityRuleType = z.infer<typeof EligibilityRuleZ>;
export type TierType = z.infer<typeof TierZ>;
export type Money = z.infer<typeof MoneyZ>;
