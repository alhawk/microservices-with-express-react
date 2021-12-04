import express from 'express'
import 'express-async-errors'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

import {signUpRouter} from './routes/signup'
import {signInRouter} from './routes/signin'
import {signOutRouter} from './routes/signout'
import {currentUserRouter} from './routes/current-user'
import {NotFoundError, errorHandler} from '@hawkab/common'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('trust proxy', true)
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(currentUserRouter)

app.all('*', async () => {  
  throw new NotFoundError()
})
app.use(errorHandler)

export {app}