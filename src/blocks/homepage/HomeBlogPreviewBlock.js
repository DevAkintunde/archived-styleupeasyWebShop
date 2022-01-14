import { config } from "../../DrupalUrl";
import { useState, useEffect } from 'react';
import Loading from "../../system/Loading";
import NodeTeaser from "../../teasers/NodeTeaser";
import MoreButton from "../../components/MoreButton";

const siteJsonUrl = config.url.SITE_JSON_URL
const HomeBlogPreviewBlock = () => {

  const [articleContent, setArticleContent] = useState();
  const alias = 'node/article?filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&include=field_tags,field_image,field_article&page[limit]=2';
  useEffect(() => {
    let isMounted = true;
    const getArticleContent = async () => {
      const response = await fetch(siteJsonUrl + alias, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json'
        }
      })
      const outputData = await response.json();
      //console.log(outputData);
      if (isMounted) {
        let articleData = [];
        outputData && outputData.data && outputData.data.forEach((article) => {
          let thisTags = [];
          let thisImage = '';
          let thisParagraphs = [];
          if (outputData.included) {
            article.relationships.field_tags && article.relationships.field_tags.data
              && article.relationships.field_tags.data.forEach((tag) => {
                outputData.included.forEach((term) => {
                  if (term.type === 'taxonomy_term--tags' && tag.id === term.id) {
                    thisTags.push(term);
                  }
                })
              })
            article.relationships.field_article && article.relationships.field_article.data
              && article.relationships.field_article.data.forEach((paragraph) => {
                outputData.included.forEach((paragraphIncluded) => {
                  if (paragraphIncluded.type.includes('paragraph--') && paragraph.id === paragraphIncluded.id) {
                    thisParagraphs.push(paragraphIncluded);
                  }
                })
              })
            outputData.included.forEach((image) => {
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
        setArticleContent(articleData);
      }
    }
    getArticleContent();

    return () => {
      isMounted = false;
    };
  }, [alias])

  //console.log(articleContent)

  return (
    <div className={'uk-margin'}>
      {articleContent && articleContent.length > 0 ?
        <>
          <header className={'uk-text-lead uk-heading-bullet uk-margin-medium-top'}
            style={{ fontSize: '4.5vw', textAlign: 'center', }}
          >
            Be Inspired
            <hr className={'uk-divider-small'} />
          </header>
          {articleContent.map((entity) => {
            return (
              <NodeTeaser entity={entity} key={entity.data.id} />
            )
          })}
          <MoreButton text={'See our Blog'} type={'secondary'} link={'/blog'} />
        </> : <Loading />}
    </div>
  )
}

export default HomeBlogPreviewBlock