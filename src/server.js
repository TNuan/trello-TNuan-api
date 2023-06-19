import express from 'express'
import cors from 'cors'
import { corsOptions } from '*/config/cors'
import { connectDB } from '*/config/mongodb'
import { env } from '*/config/environment'
import { apiV1 } from '*/routes/v1'

connectDB()
  .then(() => console.log('Connected successfully to database server !'))
  .then(() => bootServer())
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

const bootServer = () => {
  const app = express()

  app.use(cors(corsOptions))

  // Enable req.body data
  app.use(express.json())

  app.use('/v1', apiV1)

  app.get('/test', async (req, res) => {
    res.end('<h1>Hello world! Nuan dev</h1> <br/>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log('RESTful API server started on: ' + env.APP_PORT )
  })
}

