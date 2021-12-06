import mongoose from 'mongoose'
import {OrderCreatedEvent, OrderStatus} from '@hawkab/common'
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import { Message } from 'node-nats-streaming'


const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  // create a ticket
  const ticket = Ticket.build({
    title: 'test concert',
    price: 1212,
    userId: 'ssjsjjsj'
  })
  await ticket.save()

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'aass',
    expiresAt: 'ssss',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, ticket, data, msg}
}

it('sets the userid of the ticket', async () => {
  const {listener,ticket, data, msg} = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.id).toEqual(data.id)
})

it('ack', async() => {
  const {listener, data, msg} = await setup()

  // call onMessage function
  await listener.onMessage(data, msg)

  // check if act function is called
  expect(msg.ack).toHaveBeenCalled()
})