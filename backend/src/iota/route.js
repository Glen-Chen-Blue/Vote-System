import express from "express";
const multer = require("multer");
const upload = multer();

import { createVC, login, setNewVc } from "./iota";
import { createPoll, modifyLastID, getPoll, getAllPoll } from "../data";
import voting from "./voting";
import { ProofOptions } from "@iota/identity-wasm/node";
const router = express.Router();

router.post("/api/login", upload.none(), async (req, res) => {
  const VC = req.body.fileContent;
  const VCjson = JSON.parse(VC);
  console.log(typeof VCjson);
  console.log(VCjson.privateKey);
  const response = await login(VCjson.privateKey, VCjson.vc);
  res.json(response);
});

router.post("/api/register", upload.none(), async (req, res) => {
  const { name, age } = req.body;
  console.log(name);
  const response = await createVC(name, age);
  res.json(response);
});

router.post("/api/createPoll", upload.none(), async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const options = req.body.options;
  const endTime = req.body.endTime;
  const JSoptions = JSON.parse(options);
  const response = createPoll(title, description, JSoptions, endTime);
  res.json(response);
});

router.get("/api/getAllPoll", upload.none(), async (req, res) => {
  const response = getAllPoll();
  res.json(response);
});

router.get("/api/getPoll/:id", upload.none(), async (req, res) => {
  const id = req.params.id;
  const poll = getPoll(id);
  let response = poll;
  if (response["active"]) {
    response["lastBlockID"] = 0;
  }
  res.json(response);
});

router.post("/api/voting", upload.none(), async (req, res) => {
  const poll_ID = req.body.poll_ID;
  const choice = JSON.parse(req.body.choice);
  console.log();
  const vc = JSON.parse(req.body.vc).vc;
  console.log(vc.credentialSubject);
  const votedlist = vc.credentialSubject.voted;
  const voteYet = votedlist.filter((vote) => {
    if (vote === poll_ID) {
      return vote;
    }
  });
  console.log(voteYet);
  if (voteYet.length !== 1) {
    console.log("start voting");
    const response = await voting(poll_ID, choice);
    if (response === "success") {
      console.log("vote success");
      const newVc = await setNewVc(poll_ID, vc);
      const output = {
        vc: newVc,
        privateKey: JSON.parse(req.body.vc).privateKey,
      };
      console.log(output);
      res.json(output);
    } else {
      //set error
      res.json("error");
    }
  } else {
    //have voted
    console.log("have voted");
    res.json("voted");
  }
});

export default router;
