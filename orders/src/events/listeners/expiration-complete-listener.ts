import { Listener, ExpirationCompleteEvent, Subjects, OrderStatus } from "@hawkab/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
  queueGroupName = queueGroupName

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    console.log(data, '<S<<S<S<')
    const order = await Order.findById(data.orderId).populate('ticket')

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status === OrderStatus.Complete) {
      msg.ack()
    }

    order.set({
      status: OrderStatus.Cancelled
    })
    await order.save()

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: order.ticket.id
    })

    msg.ack()
  }
}