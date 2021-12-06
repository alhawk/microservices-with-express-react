import mongoose from 'mongoose'
import { OrderStatus } from '@hawkab/common'
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

interface OrderAttrs {
  id: string
  userId: string
  price: number
  status: OrderStatus
  version: number
}

interface OrderDoc extends mongoose.Document {
  userId: string
  price: number
  status: OrderStatus
  version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const ticketSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status
  })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Ticket', ticketSchema)

export {Order}