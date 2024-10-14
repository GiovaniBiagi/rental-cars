import cors from "cors";
import express from "express";
import dotenv from "dotenv";

import routes from "./routes";

import { envs } from "./envs";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(`/api/${envs.API_VERSION}`, routes);

const port = envs.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port 3000");
});
