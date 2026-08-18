import "../config/env.js";
import mongoose from "mongoose";
import User from "../models/User.js";

try {
  await mongoose.connect(process.env.MONGO_URI, { family: 4 });

  const result = await User.collection.updateMany(
    { favourites: { $exists: true } },
    [
      {
        $set: {
          favorites: {
            $setUnion: [
              { $ifNull: ["$favorites", []] },
              { $ifNull: ["$favourites", []] },
            ],
          },
        },
      },
      { $unset: "favourites" },
    ],
  );

  console.log(`Migrated ${result.modifiedCount} user record(s).`);
} finally {
  await mongoose.disconnect();
}