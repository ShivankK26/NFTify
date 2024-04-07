import mongoose from "mongoose";
import { DB_NAME } from "utils/constants";

const ConnectDB = async () => {
  try {
    const connectionInstance = mongoose.connect(
      `${process.env.DATABASE_URL}/${DB_NAME}`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
    );
    console.log(`\n MongoDB Connected!!`);
  } catch (error) {
    console.log("MongoDB Connection failed", error);
  }
};

export default ConnectDB;
