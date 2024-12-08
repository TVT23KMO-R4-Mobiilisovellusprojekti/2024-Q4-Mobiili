import { handleExpiredTaker } from "../shared/utils.js";
import { COLLECTION_TAKERS } from "../shared/constants.js";
import db from "../shared/firebase.js";
import { Timestamp } from "firebase-admin/firestore";

export default async ({ res, log, error }) => {
  try {
    const currentTime = Timestamp.now();

    const takersSnapshot = await db
      .collectionGroup(COLLECTION_TAKERS)
      .where("expiration", "<", currentTime)
      .get();

    const expiredTakers = takersSnapshot.docs;

    if (expiredTakers.length === 0) {
      log("vanhentuneita varauksia ei löytynyt");
      return res.json(
        { message: "Vanhentuneita varauksia ei löytynyt.", processedCount: 0 },
        200
      );
    }

    log(`${expiredTakers.length} vanhentunutta varausta löydetty: `);
    await Promise.all(
      expiredTakers.map(async (takerDoc) => {
        try {
          await handleExpiredTaker(takerDoc);
          log(`\t${takerDoc.id} - ${takerDoc.data().expiration?.toDate()}`);
        } catch (err) {
          error(`virhe varauksen ${takerDoc.id} käsittelyssä: `, err);
        }
      })
    );

    log("vanhentuneet varaukset käsitelty");
    return res.json(
      {
        message: "Vanhentuneet varaukset poistettu onnistuneesti.",
        processedCount: expiredTakers.length,
      },
      200
    );
  } catch (e) {
    error("virhe vanhentuneiden varausten käsittelyssä: ", e);
    return res.json(
      {
        message: "Virhe vanhentuneiden varausten käsittelyssä.",
        error: e.message,
      },
      500
    );
  }
};
