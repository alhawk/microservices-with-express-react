import {Ticket} from '../ticket'

it('implements optimistic concurreny control', async () => {
  // create ticket
  const ticket = Ticket.build({
    title: 'concert padi',
    price: 500,
    userId: '12233'
  })

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  firstInstance!.set({price: 300})
  secondInstance!.set({price: 200})

  await firstInstance!.save()
  
  try {
    await secondInstance!.save()
  } catch (err) {
    return
  }

  throw new Error('should not reach here')
})

it('increments version number on multiple save', async () => {
  const ticket = Ticket.build({
    title: 'concert padi',
    price: 500,
    userId: '12233'
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)

})