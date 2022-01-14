import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'


const OnNextPage = (props) => {
  const offset = props.offset
  const [nextPage, setNextPage] = useState({})

  useEffect(() => {
    const getNextPage = async () => {
      const response = await fetch(props.destination + offset, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
          //'Authorisation': 'Basic'
          //'X-CSRF-Token': $token,
        },
        //cookie: 'cookie.txt',
        //redirect: 'follow',
      })
      const outputData = await response.json()
      setNextPage(outputData.data)
    }

    getNextPage()
  }, [])

  console.log(props.destination)
  console.log(props.offset)
  console.log(offset)
  console.log(nextPage)
  return (
    nextPage ?
      true :
      0
  )
}
const OnPreviousPage = 'pppppppp'

export { OnNextPage }
export { OnPreviousPage }