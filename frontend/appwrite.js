import {
  Client,
  Account,
  Databases,
  Storage,
  Functions,
  Messaging,
} from "react-native-appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setPlatform(process.env.APPWRITE_PLATFORM);

const account = new Account(client);

const databases = new Databases(client);

const storage = new Storage(client);

const functions = new Functions(client);

const messaging = new Messaging(client);

export default { client, account, databases, storage, functions, messaging };
