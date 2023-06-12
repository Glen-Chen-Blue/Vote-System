import { Client, hexToUtf8, initLogger, utf8ToHex } from "@iota/client";

require("dotenv").config({ path: "../.env" });

async function getVote(lastBlockID) {
  initLogger();
  if (!process.env.NODE_URL) {
    throw new Error(".env NODE_URL is undefined, see .env.example");
  }

  const client = new Client({
    // Insert your node URL in the .env.
    nodes: [process.env.NODE_URL],
  });

  try {
    console.log("getBlock: ", lastBlockID);

    const fetchedBlock = await client.getBlock(lastBlockID);
    // console.log("Block data: ", lastBlockID);

    const payload = fetchedBlock.payload;
    if (payload && "data" in payload && payload.data) {
      const ans = JSON.parse(hexToUtf8(payload.data));
      // console.log("Decoded data:", ans.vote);
      // console.log(ans);
      return { blockID: ans.prevID, choice: ans.vote };
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function coutingVotes(choices, lastBlockID) {
  const result = {};
  choices.map((choice) => (result[choice] = 0));
  do {
    const { blockID, choice } = await getVote(lastBlockID);
    result[choice] += 0;
    lastBlockID = blockID;
  } while (lastBlockID);
  return result;
}
// run().then(() => process.exit());

export default coutingVotes;
