import express from 'express'
import { mapOrder } from './utilities/sort.js'

const app = express()

const hostName = 'localhost'
const port = 8080

app.get('/', (req, res) =>{
    res.end('<h1>Hello world!</h1> <br/>')
})

app.listen(port, hostName, (err, res) => {
    console.log('RESTful API server started on: ' + port)
})
