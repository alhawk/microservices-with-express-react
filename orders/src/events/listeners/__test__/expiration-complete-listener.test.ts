import { ExpirationCompleteEvent } from '@hawkab/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order, OrderStatus } from '../../../models/order'
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'test concert',
    price: 20020
  })
  await ticket.save()

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'ssss',
    expiresAt: new Date(),
    ticket
  })

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, ticket, order, data, msg}
}

it('updates the order status to cancelled', async () => {
  const {listener, ticket, order, data, msg} = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

})

it('emit an order cancelled event', async () => {
  const {listener, ticket, order, data, msg} = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
  expect(eventData.id).toEqual(order.id)

})

it('acks', async () => {
  const {listener, ticket, order, data, msg} = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
