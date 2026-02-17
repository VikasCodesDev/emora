import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // FIX: Validate URI exists before attempting connect
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error('❌ MONGO_URI environment variable is not set!');
      console.error('   Add MONGO_URI to your Render environment variables.');
      process.exit(1);
    }

    // FIX: Add connection options for production stability
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout instead of default 30s
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Connected:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB Disconnected — attempting reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Error:', err);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});

export default connectDB;
