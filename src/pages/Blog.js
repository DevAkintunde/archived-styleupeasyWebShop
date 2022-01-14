import { config } from '../DrupalUrl';
import { useState, useEffect } from 'react';
import Loading from "../system/Loading";
import NodeTeaser from "../teasers/NodeTeaser";
import PageTitle from '../layout/PageTitle';
import Pager from '../components/Pager';
import { JsonLd } from 'react-schemaorg';

const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const Blog = () => {

  const [articleContent, setArticleContent] = useState();
  const [pagerdata, setPagerData] = useState();
  const alias = 'node/article?filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&include=field_tags,field_image,field_article&page[limit]=10';
  const fetchUrl = siteJsonUrl + alias;

  useEffect(() => {
    let isMounted = true;

    let articleData = [];
    pagerdata && pagerdata.data && pagerdata.data.forEach((article) => {
      let thisTags = [];
      let thisImage = '';
      let thisParagraphs = [];
      if (pagerdata.included) {
        article.relationships.field_tags && article.relationships.field_tags.data
          && article.relationships.field_tags.data.forEach((tag) => {
            pagerdata.included.forEach((term) => {
              if (term.type === 'taxonomy_term--tags' && tag.id === term.id) {
                thisTags.push(term);
              }
            })
          })
        article.relationships.field_article && article.relationships.field_article.data.forEach((paragraph) => {
          pagerdata.included.forEach((paragraphIncluded) => {
            if (paragraphIncluded.type.includes('paragraph--') && paragraph.id === paragraphIncluded.id) {
              thisParagraphs.push(paragraphIncluded);
            }
          })
        })
        pagerdata.included.forEach((image) => {
          if (image.type === 'file--file' && article.relationships.field_image.data.id === image.id
            && image.attributes.image_style_uri) {
            thisImage = image.attributes.image_style_uri.header;
          }
        })
      }
      const thisArticle = {
        'data': article,
        'tags': thisTags,
        'image': thisImage
      };
      articleData.push(thisArticle);
    })

    if (isMounted && articleData.length > 0) {
      setArticleContent(articleData);
    }

    return () => {
      isMounted = false;
    };
  }, [pagerdata])

  const importPageContent = (pageContent) => {
    if (pageContent && pageContent.current) {
      setPagerData(pageContent.current);
    }
  }
  const filterReset = () => {
    setPagerData();
  }

  //console.log(articleContent)

  return (
    <>
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: 'Styleupeasy Blog Page',
          description: 'Follow StyleUpEasy articles and newsletters',
          url: siteUrl + 'blog',
          author: 'StyleUpEasy',
          keywords: ['product', 'style', 'fashion', 'makeover', 'beauty', 'blog']
        }}
      />
      <PageTitle title={'Our Blog'} />
      <div className={'uk-margin'}>
        {articleContent && articleContent.length > 0 ?
          <>

            {articleContent.map((entity, index) => {
              return (
                <div key={entity.data.id} className={'uk-margin'}>
                  <NodeTeaser entity={entity} />
                  {articleContent.length > (index + 1) ?
                    <hr className={'uk-divider-icon'} />
                    : ''}
                </div>
              )
            })}
          </> : <Loading />}
      </div>
      {fetchUrl ?
        <Pager pageContents={importPageContent} url={fetchUrl}
          reset={filterReset} authentication={false}
        />
        : ''}
    </>
  )
}

export default Blog