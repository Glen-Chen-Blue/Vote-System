import express from "express";
import cors from "cors";
import router from "./iota/route";
import { Client, hexToUtf8, initLogger, utf8ToHex } from "@iota/client";

// import { Tag } from "@iota/core";
require("dotenv").config({ path: "../.env" });

const app = express();

app.use(cors());

app.use("/", router);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is up onport ${port}.`);
  async function run() {
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
        vote: "Vote for Henning",
        prevID:
          "0x3fd81e6112007cc827967cbad42138b0ff652cf476419d134b69e89020568376",
      })
    );
    const options = {
      tag: utf8ToHex("TEST web VOTING"),
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
      console.log("Block:", blockIdAndBlock, "\n");

      console.log(
        `Block sent: ${process.env.EXPLORER_URL}/block/${blockIdAndBlock[0]}\n`
      );
      //   const provider = "https://nodes.iota.org";
      //   const iota = composeAPI({ provider });
      //   const tag = "Hello";
      //   iota
      //     .findTransactionObjects({ tags: [Tag(tag)] })
      //     .then((transactions) => {
      //       // Process the fetched data blocks
      //       transactions.forEach((transaction) => {
      //         console.log("Data:", transaction.signatureMessageFragment);
      //       });
      //     })
      //     .catch((error) => {
      //       console.error("Error:", error);
      //     });

      console.log("getBlock: ", blockIdAndBlock[0]);

      const fetchedBlock = await client.getBlock(blockIdAndBlock[0]);
      console.log("Block data: ", blockIdAndBlock[0]);

      const payload = fetchedBlock.payload;
      if (payload && "data" in payload && payload.data) {
        const ans = JSON.parse(hexToUtf8(payload.data));
        console.log("Decoded data:", ans.vote);
        console.log(ans);
        const prevBlock = await client.getBlock(ans.prevID);
        console.log("Prev data: ", prevBlock);
        console.log("Decoded data: ", hexToUtf8(prevBlock.payload.data));
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  run().then(() => process.exit());
});
