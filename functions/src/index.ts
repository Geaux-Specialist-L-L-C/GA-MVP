/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Initialize Firebase Admin
admin.initializeApp();

// Export an empty object to make this a module
export {};

// Example HTTP function with proper TypeScript types
export const api = onRequest({ cors: true }, async (request, response) => {
  try {
    logger.info("API request received", { path: request.path });
    
    // Basic health check endpoint
    if (request.path === "/health") {
      response.json({ status: "ok", timestamp: new Date().toISOString() });
      return;
    }
    
    response.status(404).json({ error: "Not found" });
  } catch (error) {
    logger.error("API error", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

// Add your Cloud Functions here
export const helloWorld = functions.https.onRequest((request, response) => {
  response.json({ message: "Hello from Firebase!" });
});
