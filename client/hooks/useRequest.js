import axios from 'axios'
import { useState } from 'react'

const useRequest = ({url, method, body, onSuccess}) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axios[method](url, body)
      if(onSuccess) {
        onSuccess(response.data)
      }
      return response.data
    } catch (err) {
      console.log(err.response.data, '>>>>>>')
      setErrors(
        <div>
          <ul>
            {
              err.response.data.errors.map((error, index) =>{
                console.log(error.message, '<<<<<<<')
                return <li key={index}>{error.message}</li>
              })
            }
          </ul>
        </div>
      )
    }
  }

  return {doRequest, errors}
}

export default useRequest;