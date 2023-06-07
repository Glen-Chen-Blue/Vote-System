import express from 'express'
// import {genNumber, getTarget} from '../core/getNumber.js'
import {createIdentity} from './iota'
const router = express.Router()

router.get('/createDid', (req, res) => {
    //set storage massage in req
    const did = createIdentity(localStorage);
    console.log("creage did");

})


export default router;