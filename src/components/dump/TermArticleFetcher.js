import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Loading from '../../blocks/Loading'
import { config } from '../../DrupalUrl'
import { FaTags } from 'react-icons/fa'

const siteJsonUrl = config.url.SITE_JSON_URL
//const siteJsonEntityUrl = config.url.SITE_ENTITY_ROUTER_URL

const TermArticleFetcher = (props) => {
  const [entity, setEntity] = useState({})

  const fetcherDestination = siteJsonUrl + props.entityWithBundle + '?filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&filter[' + props.termType + '][condition][path]=' + props.fetcherFilterLabel + '&filter[' + props.termType + '][condition][operator]=%3D&filter[' + props.termType + '][condition][value]=' + props.fetcherFilterValue + props.fetcherSuffix + '&page[limit]=' + props.fetcherPaging;

  useEffect(() => {
    const getEntity = async () => {
      const response = await fetch(fetcherDestination, {
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
  }, [props.uuid, props.termType, props.entityWithBundle, props.fetcherFilterLabel, props.fetcherFilterValue, props.fetcherSuffix, props.fetcherPaging, fetcherDestination])

  console.log(entity)

  return (
    entity && entity.data ?
      <>
        {entity.data.map((apiRes) => {
          var fieldBody = ''
          var fieldImage = ''
          var fieldTitle = ''
          var fieldReadMore = ''
          var fieldTags = ''

          apiRes.field_image ?
            fieldImage = <Link to={apiRes.path.alias} key={apiRes.id + 'alias'}>
              <img src={apiRes.field_image.image_style_uri.large} alt={apiRes.field_image.meta.alt} key={apiRes.id + 'image'} />
            </Link>
            :
            fieldImage = <Loading />

          apiRes.body && apiRes.body.processed ?
            fieldBody = <div className='uk-margin' dangerouslySetInnerHTML={{ __html: apiRes.body.processed }} key={apiRes.id + 'body'}>
            </div>
            :
            fieldBody = <Loading />

          apiRes.title ?
            fieldTitle = <h2 className='uk-text-lead uk-margin-small-top uk-margin-remove-bottom uk-text-truncate uk-text-capitalize' key={apiRes.id + 'title'}>
              <Link to={apiRes.path.alias}>
                {apiRes.title}
              </Link>
            </h2>
            :
            fieldTitle = <Loading />

          apiRes.path && apiRes.path.alias ?
            fieldReadMore = <li className='node-readmore'><Link to={apiRes.path.alias} key={apiRes.id + 'alias'}>
              {'Read More'}
            </Link>
            </li>
            :
            fieldReadMore = ''

          apiRes.field_tags ?
            fieldTags = <ul className='uk-subnav uk-margin uk-margin-remove-bottom' key={apiRes.id + 'tags'}>
              <li className='uk-flex uk-flex-middle'><FaTags /></li>
              {apiRes.field_tags.map((contentTags) => {
                return (
                  <li>
                    <Link to={contentTags.path.alias} className='' key={contentTags.id}>
                      {contentTags.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
            :
            fieldTags = ''

          return (
            <article className='uk-article uk-card uk-card-default uk-card-body'>
              <div className='uk-child-width-expand@s uk-child-width-1-1 uk-card uk-card-default uk-grid-small uk-flex-middle uk-grid'>
                <div className='uk-first-column'>
                  <div className='uk-text-center'>
                    {fieldImage}
                  </div>
                  <div className='uk-padding-small uk-flex uk-flex-center uk-visible@s'>
                    {fieldTags}
                  </div>
                </div>
                <div className='uk-grid-item-match'>
                  <div className='uk-padding-small uk-padding-remove-vertical'>
                    {fieldTitle}
                    {fieldBody}
                    <div className='uk-padding-small uk-flex uk-flex-left uk-hidden@s'>
                      {fieldTags}
                    </div>
                    <ul className='links inline uk-subnav uk-subnav-pill'>
                      {fieldReadMore}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          )

        })
        }
      </>

      :
      <Loading />
  )
}

export default TermArticleFetcher;