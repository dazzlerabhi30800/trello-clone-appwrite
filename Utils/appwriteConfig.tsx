import { Account, Client, Databases, Storage, ID } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID || "");

const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID!;

const collectionId = process.env.NEXT_PUBLIC_COLLECTION_ID!;

export { client, account, database, storage, ID, databaseId, collectionId };

