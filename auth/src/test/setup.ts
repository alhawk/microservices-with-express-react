import {app} from '../app'
import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'

declare global {
  var signin: () => Promise<string[]>;
}


let mongo: any
beforeAll(async() => {
  process.env.JWT_KEY = 'testsecret'

  mongo = await MongoMemoryServer.create()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri)
})

beforeEach(async() => {
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})


global.signin = async () => {
  const email = 'alimul@test.com'
  const password = 'password'

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email, 
      password
    })

  const cookie = response.get('Set-Cookie')
  console.log(cookie, '>>>>>')
  return cookie 
}
