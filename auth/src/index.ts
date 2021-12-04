import mongoose from 'mongoose'
const PORT = 3000
import {app} from './app'

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined.')
  }

  if(!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined.')
  }

  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to Auth DB on mongoDB')
  } catch (err) {
    console.log(err)
  }
  app.listen(PORT, () => {
    console.log('Running on the port: ', PORT)
  })
}

start()

