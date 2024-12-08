import db from "../shared/firebase.js";
import { COLLECTION_THREADS, COLLECTION_TAKERS } from "../shared/constants.js";
import { BatchManager } from "../shared/batch-utils.js";
import { deleteThreadAndMessages } from "../shared/utils.js";

export default async ({ res, log, error }) => {
  const batchManager = new BatchManager();
  let deletedCount = 0;
  try {
    const threadsRef = db.collection(COLLECTION_THREADS);
    const snapshot = await threadsRef.get();

    for (const threadDoc of snapshot.docs) {
      try {
        const thread = threadDoc.data();
        const shouldDelete = await (async () => {
          const itemSnapshot = await thread.item.get();
          if (!itemSnapshot.exists) {
            log(`poistetaan thread ${threadDoc.id} - itemiä ei ole olemassa`);
            return true;
          }

          const participantSnapshots = await Promise.all(
            thread.participants.map((ref) => ref.get())
          );
          if (!participantSnapshots.every((snap) => snap.exists)) {
            log(
              `poistetaan thread ${threadDoc.id} - osallistuja ei ole olemassa`
            );
            return true;
          }

          const takersQuery = await threadDoc
            .get("item")
            .collection(COLLECTION_TAKERS)
            .where(
              "takerId",
              "in",
              participantSnapshots.map((snap) => snap.ref)
            )
            .get();

          if (takersQuery.empty) {
            log(
              `poistetaan ${threadDoc.id} - osallistuja ei varaajana itemille`
            );
            return true;
          }

          return false;
        })();

        if (shouldDelete) {
          await deleteThreadAndMessages(threadDoc, batchManager);
          deletedCount++;
        }
      } catch (threadError) {
        error(`virhe käsiteltäessä threadia ${threadDoc.id}`, threadError);
      }
    }

    await batchManager.commit();

    log(`poistettu ${deletedCount} threadia`);
    return res.json(
      {
        success: true,
        deletedCount,
        message: "Puutteelliset threadit poistettu onnistuneesti",
      },
      200
    );
  } catch (e) {
    error("virhe threadien poistossa: ", e);
    return res.json(
      {
        success: false,
        error: e.message,
        message: "Virhe threadien poistossa",
      },
      500
    );
  }
};
