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
async function VotingAddData() {
  let poll_ID = createPoll(
    "DESSERT",
    "Which dessert below do you like the most?",
    ["Scone", "Madeleine", "Kerilu", "Cheese Cake", "I don't like desserts."],
    "2023-06-14T16:00"
  );
  await voting(poll_ID, { option: "Madeleine", vote: -1 });
  await voting(poll_ID, { option: "Scone", vote: -1 });
  await voting(poll_ID, { option: "Kerilu", vote: -1 });
  await voting(poll_ID, { option: "Kerilu", vote: -1 });
  await voting(poll_ID, { option: "Cheese Cake", vote: -1 });
  await voting(poll_ID, { option: "Kerilu", vote: -1 });
  await voting(poll_ID, { option: "I don't like desserts.", vote: -1 });
  await voting(poll_ID, { option: "Madeleine", vote: -1 });
  await voting(poll_ID, { option: "Kerilu", vote: -1 });
  await voting(poll_ID, { option: "Cheese Cake", vote: -1 });
  await voting(poll_ID, { option: "Scone", vote: -1 });
  await voting(poll_ID, { option: "Scone", vote: -1 });

  // await counting(poll_ID);
  // console.log(getPoll(poll_ID));
  poll_ID = createPoll(
    "EE SUBJECT",
    "Which subject below is your least favorite?",
    [
      "Electromagnetism",
      "Electronics",
      "Probability And Statistics",
      "Logic Circuit",
      "Programing",
      "Signal And Systems",
      "General Physics",
      "Calculus",
      "I hate all of them",
      "I like all of them. I am a good EE student.",
    ],
    "2023-06-14T16:00"
  );
  await voting(poll_ID, { option: "Electronics", vote: -1 });
  await voting(poll_ID, { option: "Electromagnetism", vote: -1 });
  await voting(poll_ID, { option: "Electronics", vote: -1 });
  await voting(poll_ID, { option: "Electronics", vote: -1 });
  await voting(poll_ID, { option: "Electromagnetism", vote: -1 });
  await voting(poll_ID, { option: "Electronics", vote: -1 });
  await voting(poll_ID, { option: "I hate all of them", vote: -1 });
}
// const polls = getAllPoll();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);

async function startServer() {
  await VotingAddData();
  initializeLatest();
  console.log("Data init finshed");
  await createIssuer();
  const issuer = getIssuer();
  console.log(issuer);
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
  });
  setInterval(() => {
    endPoll();
  }, 1000);
}
startServer();
