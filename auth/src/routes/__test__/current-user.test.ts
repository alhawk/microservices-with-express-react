import request  from "supertest"
import {app} from '../../app'

it ('should return 200 on successful sign in', async() => {
  const cookie = await global.signin()
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200)
    
  expect(response.body.currentUser.email).toEqual('alimul@test.com')

})