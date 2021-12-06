import { useState } from "react"
import axios from 'axios'
import Router from 'next/router'
import useRequest from "../../hooks/useRequest"

const New = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const {doRequest, errors} = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price
    },
    onSuccess: () => Router.push('/')
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    doRequest()
  }

  const onBlur = () => {
    const value = parseFloat(price)

    if(!isNaN) {
      return
    }

    setPrice(value.toFixed(2))

  }

  return (
    <div>
      <form>
        <h1>Create a Ticket</h1>
        {errors}
        <div>
          <div>
            <label>Title</label>
          </div>
          <div>
            <input className="py-2 px-3 border-2 rounded" onChange={(e) => setTitle(e.target.value)}/>
          </div>
        </div>
        <div>
          <div>
            <label>Price</label>
          </div>
          <div>
            <input type="number" onBlur={onBlur} className="py-2 px-3 border-2 rounded" onChange={(e) => setPrice(e.target.value)}/>
          </div>
        </div>
        <button className="font-semibold bg-blue-700 py-2 px-3 text-white" onClick={(e) => onSubmit(e)}>Submit</button>
      </form>
    </div>
  )
}

export default New