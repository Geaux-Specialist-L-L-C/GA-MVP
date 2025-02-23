const { exec } = require("child_process");

if (process.env.NODE_ENV !== "development") {
  console.log("Starting Firebase emulators...");
  exec("firebase emulators:start --only auth,firestore,functions &");
} else {
  console.log("Skipping Firebase emulators in development mode.");
}