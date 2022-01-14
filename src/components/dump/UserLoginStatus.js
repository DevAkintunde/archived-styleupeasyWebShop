//import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

//const DrupalUrl = '/'
const DrupalUrl = 'http://localhost/styleupeasy/'
//const DrupalJsonSuffix = DrupalUrl + 'jsonapi/'

function UserLoginStatus() {
    const [output, setOutput] = useState({})

    useEffect(() => {
        const getJsonDBCall = async () => {
            const response = await fetch(DrupalUrl + 'user/login_status?_format=json', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    //'X-CSRF-Token': $token,
                },
                //cookie: 'cookie.txt',
                //redirect: 'follow',
            })
            const outputData = await response.json()
            setOutput(outputData)
        }

        getJsonDBCall()
    }, [])

    console.log(output)
    return (
        output && output.length > 0 ? 'loggedIn' : 'Anonymous'
    )
}

export default UserLoginStatus
