import {Message, Stan} from 'node-nats-streaming'
import {Subjects} from './subjects'

interface Event {
  subject: Subjects,
  data: any
}

abstract class Listener<T extends Event> {
  abstract subject: string
  abstract queueGroupName: string
  abstract onMessage(data: T['data'], msg: Message): void
  private client: Stan
  protected awkWait = 5 * 1000

  constructor(client: Stan) {
    this.client = client
  }

  subsctiptionOptions () {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.awkWait)
      .setDurableName(this.queueGroupName)
  }

  listen () {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subsctiptionOptions()
    )

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} /  ${this.queueGroupName}`)
      const parsedData = this.parseMessage(msg)
      this.onMessage (parsedData, msg)
    })   
  }

  parseMessage(msg: Message) {
    const data = msg.getData()
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'))
  }
}

export {Listener}