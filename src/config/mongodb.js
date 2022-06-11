import { MongoClient } from 'mongodb'
import { env } from '*/config/environtment'

export const connectDB = async () => {
  const client = new MongoClient(env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })

  try {
    // Connect to the client to the sever
    await client.connect()
    console.log('Connected successfully to server !!')
    // List databases
    await listDatabases(client)


  } finally {
    // Close the connection to the server
    await client.close()
    console.log('Closed successfully !')
  }
}

const listDatabases = async (client) => {
  const databasesList = await client.db().admin().listDatabases()
  console.log(databasesList)
  console.log('Your databases: ')
  databasesList.databases.forEach(db => console.log(` - ${db.name}`))
}
