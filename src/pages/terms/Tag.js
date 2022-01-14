import { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Loading from '../../system/Loading'
import { config } from '../../DrupalUrl'
import PageTitle from '../../layout/PageTitle'
import TermEntityFetcher from './TermEntityFetcher'
import { JsonLd } from 'react-schemaorg'

const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const siteJsonEntityUrl = config.url.SITE_ENTITY_ROUTER_URL;
const Tag = (props) => {
  const [termContent, setTermContent] = useState();

  let alias = '/tags/' + props.match.params.alias;
  useEffect(() => {
    let isMounted = true;
    const getTermContent = async () => {
      const response = await fetch(siteJsonEntityUrl + alias, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json'
        }
      })
      const outputData = await response.json();
      if (isMounted) {
        setTermContent(outputData);
      }
    }
    getTermContent();
    return () => {
      isMounted = false;
    };
  }, [alias])

  // console.log(termContent)

  let fetcherUrlSuffix = '';
  if (termContent && termContent.data && termContent.data.id && termContent.data.type) {
    const termType = termContent.data.type
    //termType = termContent.data.type.slice(15)
    const fetcherFilterValue = termContent.data.id;
    const fetcherFilterLabel = 'field_tags.id';
    const fetcherSuffix = '&include=field_tags,field_image,field_article';
    fetcherUrlSuffix = siteJsonUrl + 'node/article?filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&filter[' + termType + '][condition][path]=' + fetcherFilterLabel + '&filter[' + termType + '][condition][operator]=%3D&filter[' + termType + '][condition][value]=' + fetcherFilterValue + fetcherSuffix;
  }


  return (
    <>
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: termContent && termContent.data ? termContent.data.attributes.name : 'Tag',
          //image: 'product image',
          description: termContent && termContent.data ? termContent.data.attributes.description : 'Tag description',
          url: siteUrl + alias,
          author: 'StyleUpEasy',
          keywords: ['product', 'style', 'fashion', 'makeover', 'beauty', termContent && termContent.data ? termContent.data.attributes.name : 'Tag']
        }}
      />
      {termContent && fetcherUrlSuffix ?
        <>
          <PageTitle title={termContent.data.attributes.name} />
          <TermEntityFetcher dataUrl={fetcherUrlSuffix} />
        </>
        :
        <Loading />}
    </>
  )
}


export default withRouter(Tag);