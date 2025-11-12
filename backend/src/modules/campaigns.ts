import { Router } from "express";
import { Campaign, Store } from "../schema";
import { CampaignZ, TierType, TierZ } from "../zod-schema";
const r: Router = Router();

r.get("/:storeId/store", async (req, res) => {
  try {
    // Parse query parameters and ensure correct types
    const storeId = req.params.storeId;
    let { search, page = 1, limit = 25 } = req.query;
    page = typeof page === "string" ? parseInt(page) : 1;
    limit = typeof limit === "string" ? parseInt(limit) : 25;

    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
      query.storeId = storeId;
    }
    const campaigns = await Campaign.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const totalCount = await Campaign.countDocuments(query);
    const hasMore = page * limit < totalCount;
    res.status(200).json({ campaigns, hasMore });
  } catch (err) {
    console.error("Error Fetching Campaign", err);
    res.status(500).json({ error: "Error Fetching Campaign" });
  }
});

r.get("/:campaignId", async (req, res) => {
  const campaignId = req.params.campaignId;
  try {
    const campaign = await Campaign.findById(campaignId).populate("tierIds");
    return res.status(200).json(campaign);
  } catch (err) {
    console.error("Error Fetching Campaign", err);
    return res.status(500).json({ message: "Error Fetching Campaign" });
  }
});

r.post("/", async (req, res) => {
  let { name, storeId, ...data } = req.body;
  const parsedCampaignData = CampaignZ.safeParse(req.body);
  if (!parsedCampaignData.success) {
    return res.status(400).json({ error: parsedCampaignData.error });
  }
  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res
        .status(404)
        .json({ message: `No Store with ${storeId} exists` });
    }
    const existingCampaign = await Campaign.find({
      name: name,
      storeId: storeId,
    });
    if (existingCampaign) {
      return res.status(409).json({
        message: `Campaign with ${name} already exists for storeId:${storeId} `,
      });
    }
    await Campaign.create(parsedCampaignData.data);
    const campaigns = await Campaign.find().sort({ name: 1 }).limit(10);
    const totalCount = await Campaign.countDocuments();
    const hasMore = 10 < totalCount;
    return res.status(200).json({ campaigns, hasMore });
  } catch (err) {
    console.error("Error Creating Campaign", err);
    res.status(500).json({ error: "Error Creating Campaign" });
  }
});

r.put("/:campaignId", async (req, res) => {
  let { name: newName, storeId, ...data } = req.body;
  let campaignId = req.params.campaignId;
  const parsedCampaignData = CampaignZ.safeParse(req.body);
  if (!parsedCampaignData.success) {
    return res.status(400).json({ error: parsedCampaignData.error });
  }
  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res
        .status(404)
        .json({ message: `No Store with ${storeId} exists` });
    }
    const existingCampaign = await Campaign.find({
      name: newName,
      storeId: storeId,
    });
    if (existingCampaign) {
      return res.status(409).json({
        message: `Campaign with ${newName} already exists for storeId:${storeId} `,
      });
    }

    // const campaign = await Campaign.findById(campaignId);
    // if (!campaign) {
    //   return res
    //     .status(404)
    //     .json({ message: `No campaign for id: ${campaignId}` });
    // }
    // const oldTiers = campaign.tiers;
    // const tiers = await compareAndUpdateTiers(
    //   oldTiers,
    //   parsedCampaignData.data.tiers
    // );

    await Campaign.findByIdAndUpdate({ campaignId }, parsedCampaignData.data);
    const campaigns = await Campaign.find().sort({ name: 1 }).limit(10);
    const totalCount = await Campaign.countDocuments();
    const hasMore = 10 < totalCount;
    return res.status(200).json({ campaigns, hasMore });
  } catch (err) {
    console.error("Error Updating Campaign", err);
    res.status(500).json({ error: "Error Updating Campaign" });
  }
});

r.delete("/:campaignId", async (req, res) => {
  const campaignId = req.params.campaignId;
  try {
    await Campaign.deleteOne({ campaignId });
    const campaigns = await Campaign.find().sort({ name: 1 }).limit(10);
    const totalCount = await Campaign.countDocuments();
    const hasMore = 10 < totalCount;
    return res.status(200).json({ campaigns, hasMore });
  } catch (err) {
    console.error("Error Deleting Campaign", err);
    return res.status(500).json({ error: "Error Deleting Campaign" });
  }
});

// const compareAndUpdateTiers = async (
//   oldTiers: TierType[] | [],
//   newTiers: TierType[] | []
// ) => {
//   if (newTiers.length === 0) {
//     if (oldTiers.length > 0) {
//       await Promise.all(
//         oldTiers.map((oldTier: TierType) => Tier.findByIdAndDelete(oldTier._id))
//       );
//     }
//     return [];
//   } else {
//     if (oldTiers.length === 0) {
//       const createdTiers = await Promise.all(
//         newTiers.map((newTier: TierType) => Tier.create(newTier))
//       );
//       return createdTiers ? createdTiers.map((tier) => tier._id) : [];
//     } else {
//       const newTiersToCreate = newTiers.filter(
//         (newTier) =>
//           !oldTiers.some(
//             (oldTier) =>
//               newTier.tierPos !== oldTier.tierPos ||
//               newTier.tierName !== oldTier.tierName ||
//               newTier.value !== oldTier.value ||
//               newTier.eligibilityType !== oldTier.eligibilityType ||
//               JSON.stringify(newTier.eligibilityRules) !==
//                 JSON.stringify(oldTier.eligibilityRules)
//           )
//       );
//       const oldTiersToDelete = oldTiers.filter(
//         (oldTier) =>
//           !newTiers.some(
//             (newTier) =>
//               newTier.tierPos !== oldTier.tierPos ||
//               newTier.tierName !== oldTier.tierName ||
//               newTier.value !== oldTier.value ||
//               newTier.eligibilityType !== oldTier.eligibilityType ||
//               JSON.stringify(newTier.eligibilityRules) !==
//                 JSON.stringify(oldTier.eligibilityRules)
//           )
//       );
//       const intersectionTiers = oldTiers.filter((oldTier) =>
//         newTiers.some(
//           (newTier) =>
//             newTier.tierPos !== oldTier.tierPos ||
//             newTier.tierName !== oldTier.tierName ||
//             newTier.value !== oldTier.value ||
//             newTier.eligibilityType !== oldTier.eligibilityType ||
//             JSON.stringify(newTier.eligibilityRules) !==
//               JSON.stringify(oldTier.eligibilityRules)
//         )
//       );
//       await Promise.all(
//         oldTiersToDelete.map((tier) => Tier.findByIdAndDelete(tier._id))
//       );
//       let createdTiers = await Promise.all(
//         newTiersToCreate.map((tier) => Tier.create(tier))
//       );
//       const createdTierIds = createdTiers
//         ? createdTiers.map((tier) => tier._id)
//         : [];
//       return [...createdTierIds, ...intersectionTiers.map((tier) => tier._id)];
//     }
//   }
// };

export default r;
