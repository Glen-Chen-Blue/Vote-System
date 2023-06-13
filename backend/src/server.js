import express from "express";
import cors from "cors";
import router from "./iota/route";
import { Client, hexToUtf8, initLogger, utf8ToHex } from "@iota/client";
import voting from "./iota/voting";

// import { Tag } from "@iota/core";
require("dotenv").config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(express.json())

app.use("/", router);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is up onport ${port}.`);
  // voting(1, data[1].lastBlockID);
});
