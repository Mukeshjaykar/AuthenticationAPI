import express from "express";
import bcrypt from "bcrypt";
import router from "./routes/userroutes.js";
import ConnectDB from "./config/connectdb.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
const port = 3000;
const DATABASE_URL = process.env.DATABASE_URL;

// LOAD DATABASE
ConnectDB(DATABASE_URL);

app.use("/api/user", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
