import mongoose from "mongoose";

let connection: typeof mongoose;

const url =
  "mongodb+srv://we-tube:RVQLhqXCgQuTTVE5@cluster0.nvyrvu7.mongodb.net/next-ecom";

const startDB = async () => {
  try {
    if (!connection) {
      connection = await mongoose.connect(url);
    }
    return connection;
  } catch (error) {
    throw new Error(error as any).message;
  }
};

export default startDB;
