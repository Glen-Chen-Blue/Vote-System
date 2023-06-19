import coutingVotes from "./iota/coutingVotes";
import { Client, hexToUtf8, initLogger, utf8ToHex } from "@iota/client";

let polls = [
  {
    id: "POLL_0PresidentOfDepartment_",
    title: "DEPARTMENT PRESIDENT",
    description: "Choose next year's EE Department President",
    options: [
      { option: "TSAI", votes: 97 },
      { option: "LEE", votes: 101 },
    ],
    active: false,
    endTime: "2023-05-24T19:00",
    lastBlockID:
      "0xaed0ce4bc922cbc306d587f0be2b5154d50cd17fb96cc5410174522d2af4316a",
  },
];

let latestEnd = {
  latestID: 0,
  latestTime: 1000000000000000,
};

function createPoll(title, description, options, endTime) {
  let choices = [];
  options.forEach((option) => choices.push({ option, votes: -1 }));
  const newPoll = {
    id: "POLL_" + polls.length.toString() + title + "_",
    title,
    description,
    options: choices,
    active: true,
    endTime,
    lastBlockID: 0,
  };
  polls.push(newPoll);
  if (new Date(latestEnd.latestTime) > new Date(endTime)) {
    latestEnd = {
      latestID: newPoll.id,
      latestTime: endTime,
    };
  }
  return newPoll.id;
}

function modifyLastID(poll_ID, lastBlockID) {
  polls = polls.map((d) => {
    d.id === poll_ID
      ? (d.lastBlockID = lastBlockID)
      : (d.lastBlockID = d.lastBlockID);
    return d;
  });
  // console.log("modify: ", polls);
}

function getPoll(poll_ID) {
  // console.log("GET:", polls);
  return polls.filter((d) => d.id === poll_ID)[0];
}

function getAllPoll() {
  return polls;
}

function getLatest() {
  return latestEnd;
}

function initializeLatest() {
  latestEnd.latestTime = 1000000000000000;
  latestEnd.latestID = 0;
  polls.forEach((poll) => {
    if (poll.active) {
      if (latestEnd.latestTime > new Date(poll.endTime)) {
        latestEnd.latestID = poll.id;
        latestEnd.latestTime = new Date(poll.endTime);
      }
    }
  });
  console.log("next open:", latestEnd.latestID);
}

async function archivePoll(poll_ID) {
  // initLogger();
  const poll = getPoll(poll_ID);
  if (!process.env.NODE_URL) {
    throw new Error(".env NODE_URL is undefined, see .env.example");
  }

  const client = new Client({
    // Insert your node URL in the .env.
    nodes: [process.env.NODE_URL],
  });

  const data = utf8ToHex(JSON.stringify(poll));
  const options = {
    // tag: utf8ToHex("TEST web VOTING"),
    tag: utf8ToHex(Math.random().toString()),
    data,
  };

  try {
    const mnemonic = await client.generateMnemonic();
    const secretManager = { mnemonic: mnemonic };

    // Create block with tagged payload
    const blockIdAndBlock = await client.buildAndPostBlock(
      secretManager,
      options
    );
    modifyLastID(poll_ID, blockIdAndBlock[0]);
  } catch (error) {
    console.error("Error: ", error);
  }
  return "success";
}

async function endPoll() {
  // while (true) {
  //   console.log("currentTime:", new Date());
  //   setTimeout(endPoll(), 1000);
  // }
  let currentTime = new Date();
  console.log(currentTime);
  console.log(latestEnd.latestTime);
  if (
    new Date(latestEnd.latestTime) < new Date(currentTime) &&
    latestEnd.latestID
  ) {
    const poll_ID = latestEnd.latestID;
    polls = polls.map((d) => {
      if (d.id === poll_ID) {
        d.active = false;
      }
      return d;
    });
    // console.log(polls);
    initializeLatest();
    console.log("end", poll_ID);
    let result = await coutingVotes(poll_ID);
    polls = polls.map((d) => {
      if (d.id === poll_ID) {
        d.options = result;
      }
      return d;
    });
    archivePoll(poll_ID);

    console.log(poll_ID, getPoll(poll_ID).options);
  }
  // await sleep(1000);
}
export {
  createPoll,
  modifyLastID,
  getPoll,
  getAllPoll,
  getLatest,
  initializeLatest,
  endPoll,
};
