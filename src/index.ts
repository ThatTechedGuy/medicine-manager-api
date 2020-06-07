import "reflect-metadata";
import { createConnection } from "typeorm";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import express from "express";
import bodyParser from "body-parser";
import { HelloWorldResolver } from "./resolvers/HelloWorld";
import { VendorResolver } from "./resolvers/VendorResolver";
import { seedDb } from "./seedDb";
import { MedicineResolver } from "./resolvers/MedicineResolver";

(async () => {
  await createConnection();
  //await seedDb();

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloWorldResolver, VendorResolver, MedicineResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(5000, () => console.log("Server running."));
})();
