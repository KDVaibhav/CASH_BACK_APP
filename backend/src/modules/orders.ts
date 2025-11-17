import { Router } from "express";
import {
  Campaign,
  CurrencyCode,
  Customer,
  Product,
  ScheduledJob,
  Store,
  TransactionLog,
} from "../schema";
import {
  CampaignType,
  CashbackType,
  OrderZ,
  ProductType,
  QtyType,
  TransactionLogType,
} from "../zod-schema";
import { currencyConverter } from "../utils";
const r = Router();

r.post("/processCashback", async (req, res) => {
  const parsedOrder = OrderZ.safeParse(req.body);
  if (!parsedOrder.success) {
    return res.status(400).json({ error: parsedOrder.error });
  }
  try {
    const store = await Store.findById(parsedOrder.data.storeId);
    if (!store) {
      return res.status(404).json({ message: `Store doesn't exist` });
    }
    const products = await Promise.all(
      parsedOrder.data.products.map(async (product) => {
        const foundProduct = await Product.findById(product.productId);
        if (!foundProduct) {
          throw new Error(`Invalid productId: ${product.productId}`);
        }
        return {
          product: foundProduct,
          quantity: product.quantity,
        };
      })
    );
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(404).json({ message: `ProductIds are not valid` });
    }
    const customer = await Customer.findById(parsedOrder.data.customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const campaigns: CampaignType[] = await Campaign.find({
      storeId: parsedOrder.data.storeId,
      isEnabled: true,
    });
    if (campaigns.length > 0) {
      let campaignCashback: CashbackType[] = [];
      for (let campaign of campaigns) {
        let isApplicable = true;
        const orderTime = new Date(parsedOrder.data.GMTTime);
        const startDateTime = campaign.campaignSchedule?.startDateTime;
        const endDateTime = campaign.campaignSchedule?.endDateTime;
        const start = startDateTime ? new Date(startDateTime) : undefined;
        const end = endDateTime ? new Date(endDateTime) : undefined;
        if ((start && orderTime < start) || (end && orderTime > end)) {
          continue;
        }
        for (let tier of campaign.tiers) {
          const tierType = tier.eligibilityType;
          for (let { category, rule: eRule } of tier.eligibilityRules) {
            if (category === "CUSTOMER") {
              if (eRule.type === "CUSTOMER_TAGS") {
                if (eRule.option === "IS") {
                  for (let tag of eRule.value) {
                    if (!customer.tags.includes(tag)) {
                      isApplicable = false;
                      break;
                    }
                  }
                } else {
                  for (let tag of eRule.value) {
                    if (customer.tags.includes(tag)) {
                      isApplicable = false;
                      break;
                    }
                  }
                }
              } else if (eRule.type === "CUSTOMER_LIFETIME_SPENT") {
                if (eRule.option === "GTE") {
                  isApplicable =
                    customer.customerLifeTimeSpent >= Number(eRule.value[0]);
                } else if (eRule.option === "LTE") {
                  isApplicable =
                    customer.customerLifeTimeSpent <= Number(eRule.value[0]);
                } else {
                  isApplicable =
                    customer.customerLifeTimeSpent === Number(eRule.value[0]);
                }
              } else {
                return res.status(404).json({ error: "Invalid Rule" });
              }
            } else if (category === "CART") {
              if (eRule.type === "CART_QUANTITY" && eRule.qty) {
                const { qtyOption, compOperators, qty } = eRule.qty;
                if (qtyOption === "UNIQUE") {
                  if (compOperators === "GTE") {
                    isApplicable = parsedOrder.data.products.length >= qty;
                  } else if (compOperators === "LTE") {
                    isApplicable = parsedOrder.data.products.length <= qty;
                  } else {
                    isApplicable = parsedOrder.data.products.length === qty;
                  }
                } else {
                  if (compOperators === "GTE") {
                    isApplicable = parsedOrder.data.totalQuantity >= qty;
                  } else if (compOperators === "LTE") {
                    isApplicable = parsedOrder.data.totalQuantity <= qty;
                  } else {
                    isApplicable = parsedOrder.data.totalQuantity === qty;
                  }
                }
              } else if (eRule.type === "CART_TOTAL") {
                const { amount, currency } = parsedOrder.data.value;
                if (eRule.option === "GTE") {
                  isApplicable =
                    currencyConverter(amount, currency, "USD") >=
                    currencyConverter(
                      Number(eRule.value),
                      store.currency,
                      "USD"
                    );
                } else if (eRule.option === "LTE") {
                  isApplicable =
                    currencyConverter(amount, currency, "USD") <=
                    currencyConverter(
                      Number(eRule.value),
                      store.currency,
                      "USD"
                    );
                } else {
                  isApplicable =
                    currencyConverter(amount, currency, "USD") ===
                    currencyConverter(
                      Number(eRule.value),
                      store.currency,
                      "USD"
                    );
                }
              } else if (eRule.type === "CART_ATTRIBUTES") {
                const { isSelected, subOption } = eRule.attribute!;
                const { key, value } = JSON.parse(eRule.value);
                if (!parsedOrder.data.attributes) isApplicable = false;
                else {
                  if (isSelected) {
                    if (
                      subOption === "CONTAINS" &&
                      !parsedOrder.data.attributes.some(
                        (attribute) =>
                          attribute.key === key &&
                          (attribute.value as string).includes(value)
                      )
                    ) {
                      isApplicable = false;
                    } else if (
                      subOption === "DOES_NOT_CONTAINS" &&
                      parsedOrder.data.attributes.some(
                        (attribute) =>
                          attribute.key === key &&
                          (attribute.value as string).includes(value)
                      )
                    ) {
                      isApplicable = false;
                    } else if (
                      subOption === "IS" &&
                      !parsedOrder.data.attributes.some(
                        (attribute) =>
                          attribute.key === key && attribute.value === value
                      )
                    ) {
                      isApplicable = false;
                    } else if (
                      subOption === "IS_NOT" &&
                      parsedOrder.data.attributes.some(
                        (attribute) =>
                          attribute.key === key && attribute.value === value
                      )
                    ) {
                      isApplicable = false;
                    } else {
                      return res
                        .status(404)
                        .json({ error: "Invalid subOption" });
                    }
                  } else {
                    if (
                      subOption === "CONTAINS" &&
                      !parsedOrder.data.attributes.some((attribute) =>
                        (attribute.value as string).includes(value)
                      )
                    ) {
                      isApplicable = false;
                    } else if (
                      subOption === "DOES_NOT_CONTAINS" &&
                      parsedOrder.data.attributes.some((attribute) =>
                        (attribute.value as string).includes(value)
                      )
                    ) {
                      isApplicable = false;
                    } else if (
                      subOption === "IS" &&
                      !parsedOrder.data.attributes.some(
                        (attribute) => attribute.value === value
                      )
                    ) {
                      isApplicable = false;
                    } else if (
                      subOption === "IS_NOT" &&
                      parsedOrder.data.attributes.some(
                        (attribute) => attribute.value === value
                      )
                    ) {
                      isApplicable = false;
                    } else {
                      return res
                        .status(404)
                        .json({ error: "Invalid subOption" });
                    }
                  }
                }
              } else if (eRule.type === "CART_CURRENCY") {
                if (eRule.option === "IS") {
                  isApplicable =
                    eRule.value === parsedOrder.data.value.currency;
                } else if (eRule.option === "IS_NOT") {
                  isApplicable =
                    eRule.value !== parsedOrder.data.value.currency;
                } else {
                  return res.status(404).json({ error: "Invalid option" });
                }
              } else {
                return res.status(404).json({ error: "Invalid Rule" });
              }
            } else if (category === "PRODUCT") {
              if (eRule.type === "SPECIFIC_PRODUCTS") {
                const filteredProducts = products.filter((product) =>
                  eRule.value.includes(product.product!._id.toString())
                );
                isApplicable = qtySelector(
                  filteredProducts,
                  eRule.qty,
                  eRule.isInclude
                );
              } else if (eRule.type === "PRODUCTS_WITH_VARIANTS") {
                const filteredProducts = products.filter((product) =>
                  eRule.value.includes(product.product!._id.toString())
                );
                isApplicable = qtySelector(
                  filteredProducts,
                  eRule.qty,
                  eRule.isInclude
                );
              } else if (eRule.type === "COLLECTIONS") {
                const filteredProducts = products.filter((product) =>
                  eRule.value.some((collectionId) =>
                    product.product!.collectionIds.includes(collectionId)
                  )
                );
                isApplicable = qtySelector(
                  filteredProducts,
                  eRule.qty,
                  eRule.isInclude
                );
              } else if (eRule.type === "PRODUCT_LINE_ATTRIBUTES") {
                const parsed = JSON.parse(eRule.value[0]);
                const key = Object.keys(parsed)[0];
                const value = parsed[key];
                const filteredProducts = products.filter((product) =>
                  product.product.attributes?.includes({ key, value })
                );
                isApplicable = qtySelector(
                  filteredProducts,
                  eRule.qty,
                  eRule.isInclude
                );
              } else if (eRule.type === "PRODUCT_TAGS") {
                const filteredProducts = products.filter((product) =>
                  eRule.value.some((tag: string) =>
                    product.product.tags.includes(tag)
                  )
                );
                isApplicable = qtySelector(
                  filteredProducts,
                  eRule.qty,
                  eRule.isInclude
                );
              } else if (eRule.type === "PRODUCT_TYPES") {
                const filteredProducts = products.filter((product) =>
                  eRule.value.includes(product.product.type)
                );
                isApplicable = qtySelector(
                  filteredProducts,
                  eRule.qty,
                  eRule.isInclude
                );
              } else {
                return res.status(404).json({ error: "Invalid rule" });
              }
            } else {
              return res.status(404).json({ error: "Invalid Category" });
            }
            if (!isApplicable && tierType === "AND") {
              break;
            }
            if (isApplicable && tierType === "OR") {
              break;
            }
          }
          if (isApplicable) {
            let cashback: CashbackType = {
              campaignName: campaign.name,
              campaignId: campaign._id!,
              value: tier.value,
            };
            if (campaign.deliveryDaysTime) {
              cashback.deliveryDaysTime = campaign.deliveryDaysTime;
            }
            if (campaign.expirationDaysTime) {
              cashback.expirationDaysTime = campaign.expirationDaysTime;
            }
            campaignCashback.push(cashback);
          }
        }
      }
      if (campaignCashback.length > 0) {
        return res.status(200).json(campaignCashback);
      } else {
        return res
          .status(200)
          .json({ message: "Not eligible for the campaign" });
      }
    }
    return res.status(200).json({ message: "No Campaigns at this moment" });
  } catch (err: any) {
    console.error("Error Processing Cashback", err.message);
    res.status(500).json({ error: "Error Processing Cashback" });
  }
});

const qtySelector = (
  filteredProducts: {
    product: ProductType;
    quantity: number;
  }[],
  qtyRule: QtyType,
  isInclude: boolean
) => {
  const { qtyOption, compOperators, qty } = qtyRule;
  if (qtyOption === "UNIQUE") {
    const productQty = filteredProducts.length;
    if (compOperators === "GTE") {
      return isInclude ? productQty >= qty : productQty <= qty;
    } else if (compOperators === "LTE") {
      return isInclude ? productQty <= qty : productQty >= qty;
    } else {
      return isInclude ? productQty === qty : productQty === qty;
    }
  } else if (qtyOption === "ALL") {
    const productQty = filteredProducts.reduce((a, b) => a + b.quantity, 0);
    if (compOperators === "GTE") {
      return isInclude ? productQty >= qty : productQty <= qty;
    } else if (compOperators === "LTE") {
      return isInclude ? productQty <= qty : productQty >= qty;
    } else {
      return isInclude ? productQty === qty : productQty === qty;
    }
  } else {
    const totalCost = filteredProducts.reduce(
      (a, b) =>
        a +
        currencyConverter(
          b.product!.value.amount,
          b.product!.value.currency,
          "USD"
        ) *
          b.quantity,
      0
    );
    if (compOperators === "GTE") {
      return isInclude ? totalCost >= qty : totalCost <= qty;
    } else if (compOperators === "LTE") {
      return isInclude ? totalCost <= qty : totalCost >= qty;
    } else {
      return isInclude ? totalCost === qty : totalCost === qty;
    }
  }
};

r.post("/placeOrder", async (req, res) => {
  const parsedOrder = OrderZ.safeParse(req.body);
  if (!parsedOrder.success) {
    return res.status(400).json({ error: parsedOrder.error });
  }
  try {
    const parsedOrderData = parsedOrder.data;
    const customerData = await Customer.findById(parsedOrderData.customerId);
    if (!customerData) {
      return res.status(404).json({ message: "Invalid Customer ID" });
    }
    const store = await Store.findById(parsedOrderData.storeId);
    if (!store) {
      return res.status(404).json({ message: "Invalid Store ID" });
    }
    customerData.customerLifeTimeSpent += currencyConverter(
      parsedOrderData.value.amount,
      parsedOrderData.value.currency,
      customerData.currency
    );
    // customer.customerLifeTimeCashback += currencyConverter();

    if (!parsedOrderData.campaignCashback) {
      return res.status(200).json({ message: "Order Placed Successfully" });
    }
    let cashbackValue = 0;
    for (const campaign of parsedOrderData.campaignCashback) {
      const value = currencyConverter(
        campaign.value.amount,
        campaign.value.currency,
        store.currency
      );
      let transactionObject: TransactionLogType = {
        storeId: parsedOrder.data.storeId,
        customerId: parsedOrderData.customerId,
        campaignId: campaign.campaignId,
        campaignName: campaign.campaignName,
        type: "CREDIT",
        value: {
          amount: value,
          currency: store.currency,
        },
        status: campaign.deliveryDaysTime ? "PENDING" : "ALLOTED",
      };
      if (!campaign.deliveryDaysTime) {
        cashbackValue += currencyConverter(
          campaign.value.amount,
          campaign.value.currency,
          customerData.currency
        );
      }
      if (campaign.expirationDaysTime) {
        const { days, time } = campaign.expirationDaysTime;
        let expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + days);
        const [hours, minutes] = time.split(":").map(Number);
        expiryDate.setUTCHours(hours, minutes, 0, 0);
        transactionObject.expiryDayTime = expiryDate;
      }
      if (campaign.deliveryDaysTime) {
        const { days, time } = campaign.deliveryDaysTime;
        let deliveryDaysTime = new Date();
        deliveryDaysTime.setDate(deliveryDaysTime.getDate() + days);
        const [hours, minutes] = time.split(":").map(Number);
        deliveryDaysTime.setUTCHours(hours, minutes, 0, 0);
        transactionObject.deliveryDayTime = deliveryDaysTime;
      }
      const transaction = await TransactionLog.create(transactionObject);
      if (transactionObject.deliveryDayTime) {
        const deliveryTime = transactionObject.deliveryDayTime;
        const delay = deliveryTime.getTime() - Date.now();
        if (delay > 0) {
          await ScheduledJob.create({
            type: "DELIVER_CASHBACK",
            category: "SCHEDULED",
            transactionId: transaction._id,
            scheduledFor: deliveryTime,
          });
        }
      }
      if (transactionObject.expiryDayTime) {
        const expiryTime = transactionObject.expiryDayTime;
        const delay = expiryTime.getTime() - Date.now();
        if (delay > 0) {
          await ScheduledJob.create({
            type: "EXPIRE_CASHBACK",
            category: "SCHEDULED",
            transactionId: transaction._id,
            scheduledFor: expiryTime,
          });
        }
      }
      customerData.customerLifeTimeCashback += cashbackValue;
      await Customer.findByIdAndUpdate(
        { _id: parsedOrderData.customerId },
        customerData
      );
      return res.status(200).json({ message: "Order Placed Successfully" });
    }
  } catch (err: any) {
    console.error("Error placing order: ", err.message);
  }
});

export default r;
