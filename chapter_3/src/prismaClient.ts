
// rather then using the db entity like past to talk to the database, we will use the prisma client to talk to the database
import { PrismaClient } from "./generated/prisma/client.js"; // generated client entry point
import { PrismaPg} from "@prisma/adapter-pg";               // postgres adapter for prisma client

// 3. creating the adapter with my database connection string
const adapter =new PrismaPg({ connectionString: process.env["DATABASE_URL"]! }); // creating the adapter with my database connection string


// making prisma client entity/object available to the rest of the application
const prisma = new PrismaClient({ adapter }); // #4. creating the prisma client with the adapter

export default prisma;