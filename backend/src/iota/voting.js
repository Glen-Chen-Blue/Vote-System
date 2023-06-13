import { Client, hexToUtf8, initLogger, utf8ToHex } from "@iota/client";
import { modifyLastID, getPoll } from "../data";
require("dotenv").config({ path: "../../../.env" });

async function voting(poll_ID, choice) {
  // initLogger();
  const poll = getPoll(poll_ID);
  if (!process.env.NODE_URL) {
    throw new Error(".env NODE_URL is undefined, see .env.example");
  }

  const client = new Client({
    // Insert your node URL in the .env.
    nodes: [process.env.NODE_URL],
  });

  const data = utf8ToHex(
    JSON.stringify({
      poll_ID: poll_ID, //"WEB_VOTING_0",
      prevID: poll.lastBlockID, // Previous vote's ID in string,
      vote: choice, // "choices in int",
    })
  );
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
    console.log("success vote for: ", choice);
    console.log(blockIdAndBlock[0]);
    modifyLastID(poll_ID, blockIdAndBlock[0]);
    // let newData = data.map((d.id == poll_ID) => {d.lastBlockID = blockIdAndBlock[0])
    // retern blockIdAndBlock[0];
    // console.log("Block:", blockIdAndBlock, "\n");

    // console.log(
    //   `Block sent: ${process.env.EXPLORER_URL}/block/${blockIdAndBlock[0]}\n`
    // );
  } catch (error) {
    console.error("Error: ", error);
  }
}

// run().then(() => process.exit());

export default voting;
