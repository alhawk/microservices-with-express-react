import { useState } from "react"
import axios from 'axios'
import Router from 'next/router'
import useRequest from "../../hooks/useRequest"

const signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {doRequest, errors} = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    doRequest()
  }

  return (
    <div>
      <form>
        <h1>Sign Up</h1>
        {errors}
        <div>
          <div>
            <label>Email Address</label>
          </div>
          <div>
            <input className="py-2 px-3 border-2 rounded" onChange={(e) => setEmail(e.target.value)}/>
          </div>
        </div>
        <div>
          <div>
            <label>Password</label>
          </div>
          <div>
            <input className="py-2 px-3 border-2 rounded" onChange={(e) => setPassword(e.target.value)}/>
          </div>
        </div>
        <button className="font-semibold bg-blue-700 py-2 px-3 text-white" onClick={(e) => onSubmit(e)}>Submit</button>
      </form>
    </div>
  )
}

export default signup;