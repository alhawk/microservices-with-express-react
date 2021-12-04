import request  from "supertest"
import {app} from '../../app'


it ('should return 400 when sign in with invalid email', async() => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'invalid@srlabs.id',
      password: 'password'
    })
    .expect(400)
})

it ('should return 400 on successful sign in', async() => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'alimul@srlabs.id',
      password: 'Abcde_12345'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'alimul@srlabs.id',
      password: 'invalidpassword'
    })
    .expect(400)
})


it ('should return 200 on successful sign in', async() => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'alimul@srlabs.id',
      password: 'Abcde_12345'
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'alimul@srlabs.id',
      password: 'Abcde_12345'
    })
    .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})