import {Publisher, Subjects, TicketCreatedEvent} from '@hawkab/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}