import express from "express";
import cors from "cors";
import router from "./iota/route";
import { Client, hexToUtf8, initLogger, utf8ToHex } from "@iota/client";
import counting from "./iota/coutingVotes";
import voting from "./iota/voting";
import { createPoll, modifyLastID, getPoll } from "./data";

// import { Tag } from "@iota/core";
require("dotenv").config({ path: "../.env" });

// async function testVoting() {
//   console.log("start voting");
//   const poll = getPoll(1);
//   console.log(poll.lastBlockID);
//   await voting(1, "a");
//   await voting(1, "b");
//   await voting(1, "a");
//   await voting(1, "a");
//   await voting(1, "b");
//   await voting(1, "a");
//   console.log("start counting");
//   await counting(1);
// }
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", router);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is up onport ${port}.`);
  // modifyLastID(1, 3);
  // console.log(getPoll(1));
  // testVoting();
});
