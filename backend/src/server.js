import express from 'express'
import cors from 'cors'
import router from './iota/route'
// import initial from './iota/issuer'


const app = express()

app.use(cors())

app.use('/', router)
// initial()

const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`Server is up onport ${port}.`)
})