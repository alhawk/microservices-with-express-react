import express, {Request, Response} from 'express'
const router = express.Router()
import {Ticket} from '../models/ticket'
import {NotFoundError} from '@hawkab/common'

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket) {
      throw new NotFoundError()
    }

    res.status(200).send(ticket)
  }
);

export {router as showTicketRouter}