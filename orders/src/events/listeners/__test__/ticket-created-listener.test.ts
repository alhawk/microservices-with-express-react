import mongoose from 'mongoose'
import {TicketCreatedEvent} from '@hawkab/common'
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  // Create an instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client)

  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'test concert',
    price: 1000,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // Create a fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, data, msg}
}

it('creates and save a ticket', async () => {
  const {listener, data,  msg} = await setup()

  // call onMessage function
  await listener.onMessage(data, msg)

  // check if ticket is created
  const ticket = await Ticket.findById(data.id)
  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
})


it('act the message', async() => {
  const {listener, data, msg} = await setup()

  // call onMessage function
  await listener.onMessage(data, msg)

  // check if act function is called
  expect(msg.ack).toHaveBeenCalled()

})