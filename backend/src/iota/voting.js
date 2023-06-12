import { Client, hexToUtf8, initLogger, utf8ToHex } from "@iota/client";

require("dotenv").config({ path: "../../../.env" });

async function voting(poll_ID, prevBlockID, choice) {
  initLogger();
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
      prevID: prevBlockID, // Previous vote's ID in string,
      vote: choice, // "choices in int",
    })
  );
  const options = {
    // tag: utf8ToHex("TEST web VOTING"),
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
    return blockIdAndBlock[0];
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
