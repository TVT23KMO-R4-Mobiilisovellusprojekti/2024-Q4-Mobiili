import db from "./firebase.js";
import { MAX_BATCH_SIZE } from "./constants.js";

export class BatchManager {
  constructor() {
    this.batch = db.batch();
    this.operationCount = 0;
  }

  /**
   * @param {FirebaseFirestore.DocumentReference} ref
   */
  async delete(ref) {
    this.batch.delete(ref);
    this.operationCount++;

    if (this.operationCount >= MAX_BATCH_SIZE) {
      await this.commit();
    }
  }

  async commit() {
    if (this.operationCount > 0) {
      await this.batch.commit();
      this.batch = db.batch();
      this.operationCount = 0;
    }
  }
}

/**
 * @param {FirebaseFirestore.QuerySnapshot} snapshot
 * @param {BatchManager} batchManager
 */
export const deleteCollection = async (snapshot, batchManager) => {
  for (const doc of snapshot.docs) {
    await batchManager.delete(doc.ref);
  }
};

export default BatchManager;
