import { createIssuer, getIssuer } from './iota/issuer';
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
app.use('/', router);

async function startServer() {
    await createIssuer();
    const issuer=getIssuer()
    console.log(issuer)
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Server is up on port ${port}.`);
    });
}

startServer();
