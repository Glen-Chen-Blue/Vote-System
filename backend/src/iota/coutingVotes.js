import { Client, hexToUtf8, initLogger, utf8ToHex } from "@iota/client";
import { getPoll } from "../data";
// require("dotenv").config({ path: "../../.env" });

async function getVote(lastBlockID) {
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

async function coutingVotes(poll_ID) {
  const poll = getPoll(poll_ID);
  const result = {};
  const choices = poll.options;
  let lastBlockID = poll.lastBlockID;
  choices.forEach((choice) => (result[choice.option] = 0));
  console.log("ALL CHOICE:", result);
  console.log(lastBlockID);
  while (lastBlockID !== 0) {
    const { blockID, choice } = await getVote(lastBlockID);
    while ((!blockID && blockID !== 0) || !choice) {
      let i = 1;
      // console.log("stuck here", blockID, choice);
    }
    console.log("vote for: ", choice);
    result[choice] += 1;
    lastBlockID = blockID;
  }
  console.log("voting result:", result);
  let countingResult = choices.map((choice) => {
    choice.votes = result[choice.option];
    return choice;
  });
  return countingResult;
}
// run().then(() => process.exit());

export default coutingVotes;
