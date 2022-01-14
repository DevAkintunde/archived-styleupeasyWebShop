import { useState, useEffect } from 'react';
import { config } from '../../DrupalUrl';
import Loading from '../../system/Loading';
import PageTitle from '../../layout/PageTitle';
import { FaInstagram, FaTwitter } from 'react-icons/fa';
import { JsonLd } from 'react-schemaorg';

const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const BasicPage = (props) => {

  const pageUuid = props.uuid;
  const pageUrl = siteJsonUrl + 'node/page/' + pageUuid;

  const [entity, setEntity] = useState({})

  useEffect(() => {
    let isMounted = true;
    const getEntity = async () => {
      const response = await fetch(pageUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json'
        }
      })
      const outputData = await response.json();
      if (isMounted) {
        setEntity(outputData);
      }
    }
    getEntity();

    return () => {
      isMounted = false;
    }
  }, [pageUrl])

  //console.log(entity)
  return (
    <>
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: entity && entity.data ? entity.data.attributes.title : 'StyleUpEasy',
          description: entity && entity.data ? entity.data.attributes.body.summary : 'A basic page on https://styleupeasy.com',
          url: entity && entity.data ? siteUrl + entity.data.attributes.path.alias.substring(1) : siteUrl,
          author: 'StyleUpEasy',
          keywords: ['product', 'style', 'fashion', 'makeover', 'beauty', entity && entity.data ? entity.data.attributes.title : '']
        }}
      />
      {entity && entity.data ?
        <>
          <PageTitle title={entity.data.attributes.title} />
          <article className='uk-article uk-card uk-card-default uk-card-body'>
            <div className='uk-padding-medium uk-margin-small-bottom'>
              <div dangerouslySetInnerHTML={{ __html: entity.data.attributes.body.value }}>
              </div>

              <div className='uk-padding-small'
                style={{ paddingLeft: '0' }}>
                <a href='https://instagram.com/shopstyleupeasy' target='_blank' rel="noreferrer"
                  className='uk-margin-right'
                  data-uk-tooltip={'title: Follow on Instagram; pos: bottom'}>
                  <FaInstagram />
                  Instagram
                </a>
                <a href='https://twitter.com/shopstyleupeasy' target='_blank' rel="noreferrer"
                  className='uk-margin-right'
                  data-uk-tooltip={'title: Follow on Twitter; pos: bottom'}>
                  <FaTwitter />
                  Twitter
                </a>
              </div>
            </div>

          </article>
        </>
        : <Loading />}
    </>
  )
}

export default BasicPage