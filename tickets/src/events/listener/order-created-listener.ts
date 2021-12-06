import {Listener, OrderCreatedEvent, Subjects} from '@hawkab/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage (data: OrderCreatedEvent['data'], msg: Message) {
    // find the ticket
    const ticket = await Ticket.findById(data.ticket.id)
    
    // if not exist throw error
    if(!ticket) {
      throw new Error('ticket not found')
    }

    // reserve the ticket by adding orderId
    ticket.set({orderId: data.id})
    await ticket.save()

    // ack
    msg.ack()
  }
}
