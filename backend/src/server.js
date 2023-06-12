import express from 'express'
import cors from 'cors'
import router from './iota/route'


const app = express()

app.use(cors());
app.use(express.json())

app.use('/', router)

const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`Server is up onport ${port}.`)
})