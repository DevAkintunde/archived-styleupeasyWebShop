import { useState, useEffect } from 'react'
import { config } from "../../DrupalUrl";
import { Link } from 'react-router-dom'
import { FaTags } from 'react-icons/fa'
import Loading from '../../system/Loading';

const siteJsonUrl = config.url.SITE_JSON_URL
const NodeTeaser = (props) => {

  const destination = siteJsonUrl + props.entityBundle + '/' + props.uuid + '?' + props.includeSuffix;

  const [entity, setEntity] = useState({})

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

  }, [props.entityBundle, props.uuid, props.includeSuffix, destination])

  return (
    <article className='uk-article uk-card uk-card-default uk-card-body'>
      <div className='uk-child-width-expand@s uk-child-width-1-1 uk-card uk-card-default uk-grid-small uk-flex-middle uk-grid'>
        <div className='uk-first-column'>

          <div className='uk-text-center'>
            {entity.data && entity.data.path.alias ?
              <Link to={entity.data.path.alias}>
                <img src={entity.data.field_image.image_style_uri.header} alt={entity.data.field_image.meta.alt} />
              </Link>
              : <Loading />}
          </div>

          {entity.data && entity.data.field_tags ?
            <div className='uk-padding-small uk-flex uk-flex-center uk-visible@s'>
              <ul className='uk-subnav uk-margin uk-margin-remove-bottom'>
                <li className='uk-flex uk-flex-middle'><FaTags /></li>
                {entity.data.field_tags.map((contentTags) => {
                  return (
                    <li key={contentTags.id}>
                      <Link to={contentTags.path.alias} className=''>
                        {contentTags.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
            : ''}

        </div>
        <div className='uk-grid-item-match'>
          <div className='uk-padding-small uk-padding-remove-vertical'>

            {entity.data && entity.data.title ?
              <h2 className='uk-text-lead uk-margin-small-top uk-margin-remove-bottom uk-text-truncate uk-text-capitalize'>
                <Link to={entity.data.path.alias}>
                  {entity.data.title}
                </Link>
              </h2>
              : ''}

            {entity.data && entity.data.path.alias ?
              <div className='uk-margin' dangerouslySetInnerHTML={{ __html: entity.data.body.processed.substr(0, 250) + ' ...' }}>
              </div>
              : <Loading />}

            {entity.data && entity.data.field_tags ?
              <div className='uk-padding-small uk-flex uk-flex-left uk-hidden@s'>
                <ul className='uk-subnav uk-margin uk-margin-remove-bottom'>
                  <li className='uk-flex uk-flex-middle'><FaTags /></li>
                  {entity.data.field_tags.map((contentTags) => {
                    return (
                      <li key={contentTags.id}>
                        <Link to={contentTags.path.alias} className=''>
                          {contentTags.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
              : ''}

            {entity.data && entity.data.path ?
              <ul className='links inline uk-subnav uk-subnav-pill'>
                <li className='node-readmore'><Link to={entity.data.path.alias}>
                  {'Read More'}
                </Link>
                </li>
              </ul>
              : ''}

          </div>
        </div>
      </div>
    </article>
  )
}


export default NodeTeaser;