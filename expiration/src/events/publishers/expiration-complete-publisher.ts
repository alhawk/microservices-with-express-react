import { ExpirationCompleteEvent, Publisher, Subjects } from "@hawkab/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
  
}