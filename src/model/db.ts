import mongoose from 'mongoose';
 
export default function connectDB() {
  const url = process.env.DB_URL || 'mongodb://localhost:27017/perspective-test-task';
  
  try {
    mongoose.connect(url);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }

  const dbConnection = mongoose.connection;

  dbConnection.once('open', () => {
    console.log(`Database connected: ${url}`);
  });
 
  dbConnection.on('error', (err) => {
    console.error(`Db connection error: ${err}`);
  });
}