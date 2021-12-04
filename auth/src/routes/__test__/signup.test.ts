import request  from "supertest"
import {app} from '../../app'


it ('should return 201 on successful signup', async() => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'alimul@srlabs.id',
      password: 'Abcde_12345'
    })
    .expect(201)
})

it ('should return 400 with invalid email', async() => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'alimul',
      password: 'Abcde_12345'
    })
    .expect(400)
})

it ('should return 400 with invalid password', async() => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'alimul123@srlabs.id',
      password: ''
    })
    .expect(400)
})


it ('should return 400 with invalid password', async() => {
  return request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400)
})

it ('should disallow duplicate email', async() => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'alimul2@srlabs.id',
      password: 'Abcde_12345'
    })
    .expect(201)
  
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'alimul2@srlabs.id',
      password: 'Abcde_12345'
    })
    .expect(400)
})

it ('should set a cookie after successful signup', async() => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'alimul3@srlabs.id',
      password: 'Abcde_12345'
    })
    .expect(201)
  
  expect(response.get('Set-Cookie')).toBeDefined()
})