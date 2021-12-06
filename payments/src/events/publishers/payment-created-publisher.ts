import { Publisher, PaymentCreatedEvent, Subjects } from "@hawkab/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}