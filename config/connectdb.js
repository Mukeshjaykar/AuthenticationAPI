import mongoose from "mongoose";
const ConnectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTION = {
      dbname: "API",
    };
    await mongoose.connect(DATABASE_URL, DB_OPTION);
    console.log("Mongodb  Connected");
  } catch (error) {
    console.log(error);
  }
};
export default ConnectDB;
