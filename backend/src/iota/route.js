import express from 'express'
const multer = require('multer');
const upload = multer();

import {createVC, login} from './iota'
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


export default router;