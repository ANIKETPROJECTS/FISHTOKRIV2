import { SubHubModel } from "./adminDb";
import { getHubModels } from "./hubConnections";

const SYNC_INTERVAL_MS = 60 * 60 * 1000; // every 1 hour

export function computeExpiryDate(entryDate: Date, shelfLifeDays: number): Date {
  return new Date(new Date(entryDate).getTime() + shelfLifeDays * 24 * 60 * 60 * 1000);
}

export function computeRemainingDays(expiryDate: Date): number {
  return parseFloat(((new Date(expiryDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000)).toFixed(2));
}

export async function syncAllHubInventory() {
  try {
    const subHubs = await SubHubModel.find({ status: "Active" }).lean();
    let totalBatchesUpdated = 0;

    for (const hub of subHubs as any[]) {
      if (!hub.dbName) continue;
      const { Product } = await getHubModels(hub.dbName);

      const products = await Product.find({
        "inventoryBatches.0": { $exists: true },
      }).lean();

      for (const product of products as any[]) {
        for (const batch of product.inventoryBatches ?? []) {
          const expiryDate = batch.expiryDate
            ? new Date(batch.expiryDate)
            : computeExpiryDate(batch.entryDate, batch.shelfLifeDays);

          const remainingDays = computeRemainingDays(expiryDate);

          await Product.findOneAndUpdate(
            { _id: product._id, "inventoryBatches._id": batch._id },
            {
              $set: {
                "inventoryBatches.$.expiryDate": expiryDate,
                "inventoryBatches.$.remainingDays": remainingDays,
              },
            }
          );
          totalBatchesUpdated++;
        }
      }
    }

    console.log(`[inventory sync] updated ${totalBatchesUpdated} batch(es) across ${subHubs.length} hub(s)`);
  } catch (err) {
    console.error("[inventory sync] error:", err);
  }
}

export function startInventorySyncScheduler() {
  syncAllHubInventory();
  setInterval(syncAllHubInventory, SYNC_INTERVAL_MS);
}
