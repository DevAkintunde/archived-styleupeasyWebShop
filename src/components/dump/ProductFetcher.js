import { useState, useEffect } from 'react'
import Loading from '../../system/Loading'
import { config } from '../../DrupalUrl'
import ProductTeaser from '../../teasers/ProductTeaser'

const siteJsonUrl = config.url.SITE_JSON_URL

const ProductFetcher = (props) => {
  const pagingCount = props.fetcherPaging

  const fetcherDestination = siteJsonUrl + props.entityWithBundle + '?filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&filter[' + props.productType + '][condition][path]=' + props.fetcherFilterLabel + '&filter[' + props.productType + '][condition][operator]=%3D&filter[' + props.productType + '][condition][value]=' + props.fetcherFilterValue + '&page[limit]=' + pagingCount + '&page[offset]=';

  const [entity, setEntity] = useState({})
  const [firstPage, setFirstPage] = useState(true)
  const [offset, setOffset] = useState(0)
  const [nextPage, setNextPage] = useState({})
  const [destination, setDestination] = useState(fetcherDestination + 0)

  if (firstPage === true) {
    //setDestination(fetcherDestination)
    setOffset(offset + pagingCount)
    setFirstPage(false)
  }

  useEffect(() => {
    const getEntity = async () => {
      const response = await fetch(destination, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
        },
        //redirect: 'follow',
      })
      const outputData = await response.json()
      setEntity(outputData)
    }
    getEntity()

    const getNextPage = async () => {
      const response = await fetch(fetcherDestination + offset, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
        },
        //redirect: 'follow',
      })
      const outputData = await response.json()
      setNextPage(outputData.data)
    }
    getNextPage()

  }, [props.uuid, props.productType, props.entityWithBundle, props.fetcherFilterLabel, props.fetcherFilterValue, props.fetcherSuffix, props.fetcherPaging, fetcherDestination, offset, destination])

  const onNextPage = (e) => {
    setDestination(fetcherDestination + offset)
    setOffset(offset + pagingCount)
  }

  const onPreviousPage = (e) => {
    const previousOffset = offset - pagingCount * 2
    setDestination(fetcherDestination + previousOffset)
    setOffset(offset - pagingCount)
  }

  //console.log(entity.data)
  return (
    entity && entity.data ?
      <>
        {entity.data.map((apiRes) => {
          if (apiRes.type.includes('node--')) {
            return (
              <ProductTeaser uuid={apiRes.id} entityBundle={props.entityWithBundle} includeSuffix={props.fetcherSuffix} key={apiRes.id} />
            )
          } else {
            return ('')
          }
        })
        }
        <div className='uk-width-1-1 uk-child-width-1-3@s uk-flex uk-flex-center uk-padding-small'>

          {(offset - pagingCount) > 0 ?
            <button onClick={onPreviousPage} className='uk-button uk-button-primary uk-margin-small-top uk-margin-small-bottom uk-margin-small-right'>Previous</button>
            : ''
          }
          {nextPage.length > 0 ?
            <button onClick={onNextPage} className='uk-button uk-button-primary uk-margin-small-top uk-margin-small-bottom uk-margin-small-left'>Next</button>
            : ''
          }
        </div>
      </>
      :
      <Loading />
  )
}

export default ProductFetcher;