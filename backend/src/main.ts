import express, { NextFunction, Request, Response } from "express";
import { env } from "process";
import cors from "cors";
import { connectionMongoDb } from "./utils/connectionMongodb";
import { UserError } from "./error";
import { userRoutes } from "./routes/userRoutes";
const app = express();
const PORT = env.PORT || 8001;

// connection to mongodb
connectionMongoDb().then(() => {
  console.log(`MonoDB connected ✅`);
});

// middleware

app.use(express.json());
app.use(cors());
//Routes
userRoutes(app);

//Globally error
app.use((error: UserError, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500).json({
    message: error.message,
    meta: error.meta,
  });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:/${PORT}🚀`);
});
