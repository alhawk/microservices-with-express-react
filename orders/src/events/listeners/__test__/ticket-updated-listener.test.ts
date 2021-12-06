import mongoose from 'mongoose'
import {TicketUpdatedEvent} from '@hawkab/common'
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import { TicketUpdatedListener } from '../ticket-updated-listener'

const setup = async () => {
  // Create an instance of listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'test concert',
    price: 1111
  })

  await ticket.save()

  // Create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'test concert',
    price: 1000,
    userId: 'kkkk'
  }

  // Create a fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, data, ticket, msg}
}


it('find, update and save ticket', async () => {
  const {listener, data, ticket, msg} = await setup()
  
  // call onMessage function
  await listener.onMessage(data, msg)

  // check if ticket is updated
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it('call ack function', async () => {
  const {listener, data, ticket, msg} = await setup()

  // call onMessage function
  await listener.onMessage(data, msg)

  // check if act function is called
  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack function', async () => {
  const {listener, data, ticket, msg} = await setup()

  data.version = 1991

  // call onMessage function
  try {
    await listener.onMessage(data, msg)
  } catch (error) {
    
  }

  // check if act function is called
  expect(msg.ack).not.toHaveBeenCalled()
})

