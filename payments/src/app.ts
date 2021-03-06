import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import {NotFoundError, errorHandler, currentUser} from '@hawkab/common'
import { createPaymentRouter } from './routes/new'

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

app.use(currentUser)

app.use(createPaymentRouter)

app.all('*', async () => {  
  throw new NotFoundError()
})
app.use(errorHandler)

export {app}