import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

//const DrupalUrl = '/'
const DrupalUrl = 'http://localhost/styleupeasy/'
const DrupalJsonSuffix = DrupalUrl + 'jsonapi/'
////////check this line to monitor undoes coming

function JsonCall({ routeSuffix, iD, attributeS }) {
  const [output, setOutput] = useState({})

  useEffect(() => {
    const getJsonDBCall = async () => {
      const response = await fetch(DrupalJsonSuffix + routeSuffix, {
        method: 'GET',
        headers: {
          'Content-type': 'application/vnd.api+json',
        },
      })
      const jsonData = await response.json()
      const outputData = jsonData.data
      setOutput(outputData)
    }

    getJsonDBCall()
  }, [routeSuffix])

  const dataExport = output
  console.log(dataExport)
  return (
    dataExport && dataExport.length > 0 ? dataExport.map((apiRes, index) => {
      return (<li key={index}>
        [uuid = {apiRes.id}]
        [title = {apiRes.attributes.title}]
        [uri = {apiRes.attributes.url}]
        [decription = {apiRes.attributes.description}]
        [parent = {apiRes.attributes.parent}]
        [weight = {apiRes.attributes.weight}]
        [expandable = {apiRes.attributes.expanded ? 'true' : 'false'}]
      </li>)
    }) :
      null


  )
}

JsonCall.defaultProps = {
  routeSuffix: 'node',
}

JsonCall.propTypes = {
  routeSuffix: PropTypes.string,
  //onClick: PropTypes.func,
}

export default JsonCall
