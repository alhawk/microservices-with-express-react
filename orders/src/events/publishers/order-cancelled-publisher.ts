import {Publisher, Subjects, OrderCancelledEvent} from '@hawkab/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}