import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import {NotFoundError, errorHandler, currentUser} from '@hawkab/common'

import {createOrderRouter} from './routes/new'
import {indexOrderRouter} from './routes/index'
import {showOrderRouter} from './routes/show'
import {updateOrderRouter} from './routes/update'
import {deleteOrderRouter} from './routes/delete'

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

app.use(createOrderRouter)
app.use(indexOrderRouter)
app.use(showOrderRouter)
app.use(updateOrderRouter)
app.use(deleteOrderRouter)

app.all('*', async () => {  
  throw new NotFoundError()
})
app.use(errorHandler)

export {app}