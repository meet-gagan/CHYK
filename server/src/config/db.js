import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/anti_drug_marathon_2026';
    
    mongoose.connection.on('connected', () => {
      console.log('[MongoDB] Connection established successfully.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB Error]:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB Warning] Disconnected from MongoDB cluster.');
    });

    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      autoIndex: true,
    });

    console.log(`[MongoDB] Connected to host: ${conn.connection.host}`);

    // Drop stale/legacy email_1 index from users collection if present to prevent duplicate null errors
    try {
      const usersCol = conn.connection.collection('users');
      const indexes = await usersCol.indexes();
      const emailIdx = indexes.find((i) => i.name === 'email_1' || (i.key && i.key.email));
      if (emailIdx) {
        await usersCol.dropIndex(emailIdx.name);
        console.log(`[MongoDB] Cleaned up legacy '${emailIdx.name}' index on users collection.`);
      }
    } catch (idxErr) {
      // Ignore if collection doesn't exist yet or index is already absent
    }

    // Ensure marathonsitesettings document exists in DB
    try {
      const marathonCol = conn.connection.collection('marathonsitesettings');
      const existing = await marathonCol.findOne({ key: 'marathon' });
      if (!existing) {
        await marathonCol.insertOne({
          key: 'marathon',
          isLive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log('[MongoDB] Initialized marathonsitesettings collection (isLive: true).');
      }
    } catch (mErr) {
      // Ignore if collection error
    }

    // Ensure sitesettings (Chinmaya Mission website) document exists and is live in DB
    try {
      const siteCol = conn.connection.collection('sitesettings');
      const existingSite = await siteCol.findOne({ key: 'global' });
      if (!existingSite) {
        await siteCol.insertOne({
          key: 'global',
          isLive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log('[MongoDB] Initialized sitesettings collection (isLive: true).');
      } else if (!existingSite.isLive) {
        await siteCol.updateOne({ key: 'global' }, { $set: { isLive: true } });
        console.log('[MongoDB] Updated sitesettings collection to (isLive: true).');
      }
    } catch (sErr) {
      // Ignore if collection error
    }

    return true;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      console.error('[MongoDB Fatal] Database connection required in production mode.');
    }
    return false;
  }
};

export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};
