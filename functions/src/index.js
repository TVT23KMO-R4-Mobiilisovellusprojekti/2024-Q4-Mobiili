import handleInvalidThreads from "./handlers/handle-invalid-threads.js";
import handleExpiredTakers from "./handlers/handle-expired-takers.js";
import deleteExpiredItems from "./handlers/handle-expired-items.js";
import handleTakerCreation from "./handlers/handle-taker-creation.js";

export default async ({ req, res, log, error }) => {
  const functionId = process.env.APPWRITE_FUNCTION_ID;

  switch (functionId) {
    case "handle-invalid-threads":
      return await handleInvalidThreads({ req, res, log, error });
    case "handle-expired-takers":
      return await handleExpiredTakers({ req, res, log, error });
    case "handle-expired-items":
      return await deleteExpiredItems({ req, res, log, error });
    case "handle-taker-creation":
      return await handleTakerCreation({ req, res, log, error });
    default:
      return res.json({ error: "Unknown function" }, 400);
  }
};
