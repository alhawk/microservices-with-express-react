import request  from "supertest"
import {app} from '../../app'


it ('should set a cookie after successful signup', async() => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'alimul3@srlabs.id',
      password: 'Abcde_12345'
    })
    .expect(201)
  
  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200)
  
  
  expect(response.get('Set-Cookie')).toBeDefined()
})