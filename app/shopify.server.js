import dotenv from "dotenv";
dotenv.config();

import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import prisma from "./db.server";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json()); // JSON support

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
sessionStorage: new SQLiteSessionStorage("database.sqlite"),
  distribution: AppDistribution.AppStore,
  future: {
    expiringOfflineAccessTokens: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

// --------------------
// SUBSCRIBE ROUTE
// --------------------
// app.post("/apps/subscribe", async (req, res) => {
//   const { email } = req.body;

//   if (!email) return res.status(400).json({ message: "Email required" });

//   try {
//     const session = await shopify.session.customAppSession(process.env.SHOPIFY_STORE_DOMAIN);
//     const customers = await shopify.api.rest.Customer.search({
//       session,
//       query: `email:${email}`,
//     });

//     if (customers.length > 0 && customers[0].accepts_marketing) {
//       return res.json({ status: "exists", message: "You are already subscribed 🎉" });
//     }

//     await shopify.api.rest.Customer.create({
//       session,
//       customer: { email, accepts_marketing: true },
//     });

//     return res.json({ status: "new", message: "Thanks for subscribing!" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });


export default shopify;
export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

