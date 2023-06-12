import express from 'express'
// import {genNumber, getTarget} from '../core/getNumber.js'
import {createVC, login} from './iota'
const router = express.Router()

router.get('/createDid', (req, res) => {
    //set storage massage in req
    const name = req.body.name;
    const age = req.body.age;
    const vc = createVC(name, age);
    console.log("create did");

    res.send(vc);

})

router.get('/login', (req, res) => {
    login(res.body);
})


export default router;