import express, {Request, Response} from 'express'
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from '@hawkab/common'
import {body} from 'express-validator'
import mongoose from 'mongoose'
const router = express.Router()
import {Order} from '../models/order'
import {OrderCreatedPublisher} from '../events/publishers/order-created-publisher'
import {natsWrapper} from '../nats-wrapper'
import { Ticket } from '../models/ticket'

const EXPIRATION_WINDOW_SECONDS = 1 * 60

router.post('/api/orders', requireAuth,
  [
    body('ticketId').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('Valid TicketId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {ticketId} = req.body

    // get ticket Id
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    const isReserved = await ticket.isReserved()
    if(isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    // calculate expiration
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)
    
    // create
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket 
    })
        
    await order.save() 

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      //@ts-ignore
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    })
    res.status(201).send(order)
  }
);

export {router as createOrderRouter}