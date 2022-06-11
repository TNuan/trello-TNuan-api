import express from 'express'
import { mapOrder } from '*/utilities/sort.js'
import { connectDB } from '*/config/mongodb'
import { env } from '*/config/environtment'

const app = express()

connectDB().catch(console.log)

app.get('/', (req, res) => {
  res.end('<h1>Hello world! Nuan dev</h1> <br/>')
})

app.listen(env.PORT, env.HOST_NAME, (err, res) => {
  console.log('RESTful API server started on: ' + env.PORT )
})
