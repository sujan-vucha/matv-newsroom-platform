import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB');

  // Delete only the "allvideos" collection
  const collectionName = 'livevideos'; // ⚠️ Mongoose lowercases model names and pluralizes them
  const collections = await mongoose.connection.db.listCollections().toArray();
  const exists = collections.some(col => col.name === collectionName);

  if (exists) {
    await mongoose.connection.db.dropCollection(collectionName);
    console.log(`✅ Collection '${collectionName}' cleared`);
  } else {
    console.log(`ℹ️ Collection '${collectionName}' does not exist`);
  }

  process.exit();
});
