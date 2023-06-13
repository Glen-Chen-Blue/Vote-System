import { createIssuer, getIssuer } from "./iota/issuer";
import express from "express";
import cors from "cors";
import router from "./iota/route";
import counting from "./iota/coutingVotes";
import voting from "./iota/voting";
import {
  createPoll,
  modifyLastID,
  getPoll,
  getAllPoll,
  getLatest,
  initializeLatest,
  endPoll,
} from "./data";

// import { Tag } from "@iota/core";
require("dotenv").config({ path: "../.env" });
async function testVoting() {
  // console.log("start voting");
  // const poll = getPoll("POLL_1VOTING_");
  // console.log(poll.lastBlockID);
  // await voting("POLL_1VOTING_", "a");
  // await voting("POLL_1VOTING_", "b");
  // await voting("POLL_1VOTING_", "a");
  // await voting("POLL_1VOTING_", "a");
  // await voting("POLL_1VOTING_", "b");
  // await voting("POLL_1VOTING_", "a");
  // console.log("start counting");
  // await counting("POLL_1VOTING_");
  // console.log(getPoll("POLL_1VOTING_"));
  let poll_ID = createPoll(
    "TEST1",
    "======",
    ["yes", "no"],
    "2023-06-14T04:17:30"
  );
  await voting(poll_ID, { option: "yes", vote: -1 });
  await voting(poll_ID, { option: "no", vote: -1 });
  await voting(poll_ID, { option: "yes", vote: -1 });
  await voting(poll_ID, { option: "yes", vote: -1 });
  // await counting(poll_ID);
  // console.log(getPoll(poll_ID));
  poll_ID = createPoll("TEST2", "======", ["yes", "no"], "2023-06-14T04:17:30");
  await voting(poll_ID, { option: "yes", vote: -1 });
  await voting(poll_ID, { option: "no", vote: -1 });
  await voting(poll_ID, { option: "yes", vote: -1 });
  await voting(poll_ID, { option: "yes", vote: -1 });
}
// const polls = getAllPoll();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);

async function startServer() {
  await createIssuer();
  const issuer = getIssuer();
  console.log(issuer);
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
  });
  initializeLatest();
  setInterval(() => {
    endPoll();
  }, 1000);
  testVoting();
}
startServer();
