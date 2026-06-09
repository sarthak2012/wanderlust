const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    await initDB();

    mongoose.connection.close(); // ✅ close DB after seeding
    console.log("Database connection closed");

  } catch (err) {
    console.error(err);
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Existing listings cleared.");

    //to add an owner to the listing.
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "69f7fb27254b0f5c26b219d5" })); //using demo3 user's id as owner for all listings
    await Listing.insertMany(initData.data);
    console.log("Sample listings inserted.");

  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

main();
