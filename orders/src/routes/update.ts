import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@hawkab/common'
import { Order } from '../models/order'
// import {OrderUpdatedPublisher} from '../events/publisher/order-updated-publisher'
import {natsWrapper} from '../nats-wrapper'

const router = express.Router()

router.put('/api/orders/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.set({
      title: req.body.title,
      price: req.body.price,
    })
    await order.save()

    res.send(order)
  }
)

export { router as updateOrderRouter }
