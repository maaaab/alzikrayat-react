import express from "express";
import accountRoutes from "./routes/authRoutes.js"
import pictureRoutes from "./routes/photoRoutes.js"
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo"
import { errorHandler } from "./middleware/errorHandler.js";
dotenv.config();


const serverPort = process.env.port;
const databaseUrl=process.env.MONGODB_URI
const sessionSecret = process.env.SESSION_SECRET

const serverApp = express();
serverApp.use(express.json());
serverApp.use("/uploads", express.static("uploads"));
serverApp.use(session({
  secret: sessionSecret,
  store: MongoStore.create({
    mongoUrl: databaseUrl
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false
  }

}))

//Routes
serverApp.use("/api/auth", accountRoutes)
serverApp.use("/api/photos",pictureRoutes)
serverApp.use(errorHandler);


const startApplication = async () => {
  await connectDatabase();

  serverApp.listen(serverPort, () => {
    console.log(`Example app listening on port ${serverPort}`);
  });
};

//mongoose
const connectDatabase = async () => {
  try {

    const connection = await mongoose.connect(databaseUrl);
    // await mongoose.connection.dropDatabase();
    console.log("MongoDB Connected");
  } catch (problem) {
    console.error(`Database connection error: ${problem.message}`);
    process.exit(1);
  }
};



startApplication();
