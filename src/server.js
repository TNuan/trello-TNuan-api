import express from 'express'
import { connectDB } from '*/config/mongodb'
import { env } from '*/config/environment'

connectDB()
  .then(() => console.log('Connected successfully to database server !'))
  .then(() => bootServer())
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

const bootServer = () => {
  const app = express()
  
  app.get('/test', async (req, res) => {
    res.end('<h1>Hello world! Nuan dev</h1> <br/>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, (err, res) => {
    console.log('RESTful API server started on: ' + env.APP_PORT )
  })
}

