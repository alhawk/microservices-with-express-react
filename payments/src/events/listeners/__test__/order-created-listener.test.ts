import mongoose from 'mongoose'
import { OrderCreatedEvent, OrderStatus } from "@hawkab/common"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'aaa',
    expiresAt: 'aaa',
    ticket: {
      id: 'aaa',
      price: 10200
    }
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, data, msg}
}

it('should replica the order info', async () => {
  const {listener, data, msg} = await setup()

  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)
  expect(order!.price).toEqual(data.ticket.price)
})

it('should ack', async () => {
  const {listener, data, msg} = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})