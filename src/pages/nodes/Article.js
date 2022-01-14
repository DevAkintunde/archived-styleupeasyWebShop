import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Loading from '../../system/Loading'
import ParagraphDefault from '../../fields/paragraphs/ParagraphDefault'
import { config } from '../../DrupalUrl'
import { FaTags } from 'react-icons/fa'
import PageTitle from '../../layout/PageTitle'
import { JsonLd } from 'react-schemaorg'

const siteUrl = config.url.SITE_URL;
//const siteJsonUrl = config.url.SITE_JSON_URL;
const siteJsonEntityUrl = config.url.SITE_ENTITY_ROUTER_URL;
const Article = (props) => {
  const [articleContent, setArticleContent] = useState();

  const alias = 'article/' + props.match.params.alias;
  const thisComExtraSuffix = '&include=field_image,field_product_tag,field_tags';
  useEffect(() => {
    let isMounted = true;
    const getArticleContent = async () => {
      const response = await fetch(siteJsonEntityUrl + alias + thisComExtraSuffix, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json'
        }
      })
      const outputData = await response.json();
      if (isMounted) {
        setArticleContent(outputData);
      }
    }
    getArticleContent();
    return () => {
      isMounted = false;
    };
  }, [alias])

  let formatedPublishedDate = '';
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Octr", "Nov", "Dec"
  ];
  let jsonLDdateCreated = '';
  let jsonLDlastReviewed = '';
  if (articleContent && articleContent.data && articleContent.data.attributes) {
    jsonLDdateCreated = articleContent.data.attributes.created;

    if (articleContent.data.attributes.changed) {
      jsonLDlastReviewed = articleContent.data.attributes.changed;
      const updatedDate = new Date(articleContent.data.attributes.changed);
      formatedPublishedDate = 'Updated ' + (updatedDate.getDate() + '/' + (monthNames[updatedDate.getMonth()]) + '/' + updatedDate.getFullYear());
    } else if (articleContent.data.attributes.created) {
      const createdDate = new Date(articleContent.data.attributes.created);
      formatedPublishedDate = 'Posted ' + (createdDate.getDate() + '/' + (monthNames[createdDate.getMonth()]) + '/' + createdDate.getFullYear());
    }
  }
  //console.log(articleContent);

  return (
    <>
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: articleContent && articleContent.data && articleContent.data.attributes ? articleContent.data.attributes.title : 'Article on styleupeasy.com',
          description: articleContent && articleContent.data && articleContent.data.attributes ? articleContent.data.attributes.body.summary : '',
          url: siteUrl + (articleContent && articleContent.data && articleContent.data.attributes ? articleContent.data.attributes.path.alias.substring(1) : ''),
          author: 'StyleUpEasy',
          dateCreated: jsonLDdateCreated,
          lastReviewed: jsonLDlastReviewed ? jsonLDlastReviewed : '',
          keywords: ['product', 'style', 'fashion', 'makeover', 'beauty']
        }}
      />
      <PageTitle title={articleContent && articleContent.data ? articleContent.data.attributes.title : ''} />
      <article className='uk-article'>
        {articleContent && articleContent.data ?
          <>
            {articleContent.data && articleContent.included ?
              articleContent.included.map((includedRel) => {
                if (includedRel.type === 'file--file' && includedRel.attributes.status === true) {
                  return (
                    <div className='uk-text-center uk-width-1-1' key={includedRel.id}>
                      <img src={includedRel.attributes.image_style_uri.header} alt={articleContent.data.attributes.title} />
                    </div>
                  )
                } else { return ('') }
              })
              : ''}

            {articleContent.data && articleContent.data.attributes.body.processed ?
              <div className='uk-padding-small uk-margin-small-bottom article-body' dangerouslySetInnerHTML={{ __html: articleContent.data.attributes.body.processed }}>
              </div> : ''}

            {formatedPublishedDate ?
              <footer>
                <div className='uk-article-meta uk-padding-small uk-padding-remove-top'>
                  {formatedPublishedDate}
                </div>
              </footer>
              : ''
            }

            {articleContent && articleContent.data ?
              articleContent.data.relationships.field_article.data.map((relatedParagraph) => {
                return (
                  <ParagraphDefault type={relatedParagraph.type} uuid={relatedParagraph.id}
                    key={relatedParagraph.id} authentication={false} />
                )
              })
              : <Loading />}

            {articleContent.data && articleContent.included ?
              <div className='uk-padding-small uk-width-1-1'>
                <ul className='uk-subnav uk-margin uk-margin-remove-bottom uk-flex-center'>
                  <li className='uk-flex uk-flex-middle'><FaTags /></li>
                  {articleContent.included.map((includedRel) => {
                    if (includedRel.type === 'taxonomy_term--tags') {
                      return (
                        <li key={includedRel.id}>
                          <Link to={includedRel.attributes.path.alias} className=''>
                            {includedRel.attributes.name}
                          </Link>
                        </li>
                      )
                    } else {
                      return (
                        ''
                      )
                    }
                  })}
                </ul>
              </div>
              : ''}
          </>
          : <Loading />}
      </article>
    </>
  )
}


export default withRouter(Article);