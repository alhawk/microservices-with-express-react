import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import {NotFoundError, errorHandler, currentUser} from '@hawkab/common'

import {createTicketRouter} from './routes/new'
import {indexTicketRouter} from './routes/index'
import {showTicketRouter} from './routes/show'
import {updateTicketRouter} from './routes/update'

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

app.use(createTicketRouter)
app.use(indexTicketRouter)
app.use(showTicketRouter)
app.use(updateTicketRouter)


app.all('*', async () => {  
  throw new NotFoundError()
})
app.use(errorHandler)

export {app}