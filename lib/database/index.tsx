import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if(!MONGODB_URI) throw new Error('MONGODB_URI is missing');

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: 'evently',
    bufferCommands: false,
  })

  cached.conn = await cached.promise;
x
  return cached.conn;
}
 

//  import mongoose from "mongoose";

//  let connected: boolean | undefined; // Declare the type of connected
 
//  const connectToDatabase = async (): Promise<void> => { // Specify return type as void (or any other type if needed)
//      mongoose.set('strictQuery', true);
 
//      if (connected) {
//          console.log('Already connected to the database');
//          return;
//      }
 
//      try {
//          await mongoose.connect(process.env.MONGODB_URI as string); // Ensure process.env.MONGO_URL is treated as string
//          console.log('Connected to MongoDB');
//          connected = true;
//      } catch (error) {
//          console.error(`Error connecting to the database: ${(error as Error).message}`); // Cast error to Error type
//      }
//  }
 
//  export default connectToDatabase;
 
