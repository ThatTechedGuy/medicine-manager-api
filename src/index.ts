import "reflect-metadata";
import { createConnection } from "typeorm";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import express from "express";
import bodyParser from "body-parser";
import { VendorResolver } from "./resolvers/VendorResolver";
import { MedicineResolver } from "./resolvers/MedicineResolver";
import { SaleResolver } from "./resolvers/SaleResolver";
import { OrderResolver } from "./resolvers/OrderResolver";

(async () => {
  await createConnection();
  //await seedDb();

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [VendorResolver, MedicineResolver, SaleResolver, OrderResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(5000, () => console.log("Server running."));
})();
