//import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Loading from '../../blocks/Loading'
import { config } from '../../DrupalUrl'

const siteJsonUrl = config.url.SITE_JSON_URL

const FieldFeaturedImage = (props) => {

  const [featuredImage, setFeaturedImage] = useState({})
  useEffect(() => {
    const getFeaturedImage = async () => {
      const response = await fetch(siteJsonUrl + + props.uuid, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
        },
      })
      const outputFeaturedImage = await response.json()
      setFeaturedImage(outputFeaturedImage)
    }
    getFeaturedImage()
  }, [props.uuid])

  console.log(featuredImage)

  return (
    featuredImage && featuredImage.data ?
      <div className='uk-width-1-1'>
        {'featuredImage.data'}
      </div>
      :
      <Loading />
  )
}


export default FieldFeaturedImage;