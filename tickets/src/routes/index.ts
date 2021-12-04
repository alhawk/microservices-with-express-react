import express, {Request, Response, NextFunction} from 'express'
import {requireAuth, validateRequest} from '@hawkab/common'
const router = express.Router()
import {Ticket} from '../models/ticket'

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});
    res.status(200).send(tickets)
  }
);

export {router as indexTicketRouter}