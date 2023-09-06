import express from 'express'
import cors from 'cors'
import { corsOptions } from '*/config/cors'
import { connectDB } from '*/config/mongodb'
import { env } from '*/config/environment'
import { apiV1 } from '*/routes/v1'
import { Server } from 'socket.io'

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

  const server = app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log('RESTful API server started on: ' + env.APP_PORT )
  })

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  var usernames = {}
  var boards = []

  io.on('connection', (socket) => {

    socket.on('createUser', (username) => {
      socket.username = username
      usernames[username] = username
      console.log(usernames)
    })

    socket.on('sendMessage', (data) => {
      io.to(data.boardId).emit('updateBoards', socket.username, data)
    })

    socket.on('joinBoard', (boardId) => {
      if (boardId != null) {
        if (!boards.includes(boardId)) {
          boards.push(boardId)
        }
        socket.join(boardId)
      }
    })

    socket.on('leaveBoard', (boardId) => {
      socket.leave(boardId)
    })

    socket.on('disconnect', () => {
      delete usernames[socket.username]
    })

  })
}

