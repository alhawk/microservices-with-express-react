import mongoose from 'mongoose'
import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@hawkab/common"
import { natsWrapper } from "../../../nats-wrapper"
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'
import { OrderCancelledListener } from '../order-cancelled-listener'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 100,
    userId: 'aaa',
    version: 0
  })
  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'aaa',
    }
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, order, data, msg}
}

it('should update status of the order', async () => {
  const {listener, order, data, msg} = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('should ack', async () => {
  const {listener, data, msg} = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})