import {Publisher, Subjects, TicketUpdatedEvent} from '@hawkab/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}