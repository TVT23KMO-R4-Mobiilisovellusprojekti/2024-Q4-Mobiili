import { getExpiredDocuments, handleExpiredItem } from "../shared/utils.js";
import { COLLECTION_ITEMS } from "../shared/constants.js";

export default async ({ res, log, error }) => {
  try {
    const querySnapshot = await getExpiredDocuments(COLLECTION_ITEMS);

    if (querySnapshot.empty) {
      log("ilmoitukset ovat ajan tasalla");
      return res.json({ message: "Ilmoitukset ovat ajan tasalla." }, 200);
    }

    log(`löydetty ${querySnapshot.size} vanhentunutta ilmoitusta:`);
    for (const itemDoc of querySnapshot.docs) {
      try {
        await handleExpiredItem(itemDoc);
        log(`\t${itemDoc.id} - ${itemDoc.data().expiration?.toDate()}`);
      } catch (err) {
        error(`virhe ilmoituksen ${itemDoc.id} käsittelyssä: `, err);
      }
    }

    return res.json(
      {
        message: "Vanhentuneet ilmoitukset poistettu onnistuneesti.",
      },
      200
    );
  } catch (e) {
    error("ilmoitusten poistossa tapahtui virhe: ", e);
    return res.json(
      {
        message: "Virhe ilmoitusten poistossa.",
        error: e.message,
      },
      500
    );
  }
};
