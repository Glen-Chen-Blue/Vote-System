import express from 'express'
const multer = require('multer');
const upload = multer();

import {createVC, login} from './iota'
import {createPoll, modifyLastID, getPoll, getAllPoll} from '../data'
import voting from './voting'
const router = express.Router()

router.post('/api/login', upload.none(),async (req, res) => {
    const VC = req.body.fileContent;
    const VCjson = JSON.parse(VC);
    console.log(typeof(VCjson))
    console.log(VCjson.privateKey)
    const response =await login(VCjson.privateKey, VCjson.vc);
    res.json(response);
  });

router.post('/api/register', upload.none(),async (req, res) => {
    const {name,age} = req.body;
    console.log(name)
    const response =await createVC(name, age);
    res.json(response);
  });

router.post('/api/createPoll', upload.none(),async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const options = req.body.options;
    const endTime = req.body.endTime;
    const JSoptions = JSON.parse(options);
    const response =createPoll(title,description,JSoptions,endTime);
    res.json(response);
});

router.get('/api/getAllPoll', upload.none(),async (req, res) => {
  const response =getAllPoll();
  res.json(response);
});

router.get('/api/getPoll/:id', upload.none(),async (req, res) => {
  const id = req.params.id;
  const response =getPoll(id);
  res.json(response);
});

router.post('/api/voting', upload.none(),async (req, res) => {
  const poll_ID = req.body.poll_ID;
  const choice = req.body.choice;
  const response =await voting(poll_ID,choice);
  res.json(response);
});



export default router;