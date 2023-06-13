import express from 'express';
import cors from 'cors';
import router from './iota/route';
import { createIssuer, getIssuer } from './iota/issuer';
require("dotenv").config({ path: "../.env" });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);

async function startServer() {
    await createIssuer();
    const issuer=getIssuer()
    console.log(issuer)
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Server is up on port ${port}.`);
    });
}

startServer();
