import express, {Request, Response, NextFunction} from 'express'
import {requireAuth, validateRequest} from '@hawkab/common'
const router = express.Router()
import {Order} from '../models/order'

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
     const orders = await Order.find({
       userId: req.currentUser!.id
     }).populate('ticket')
     
    res.status(200).send(orders)
  }
)

export {router as indexOrderRouter}