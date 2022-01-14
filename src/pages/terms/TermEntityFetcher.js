import { useState, useEffect } from 'react';
import Loading from '../../system/Loading';
import NodeTeaser from '../../teasers/NodeTeaser';
import Pager from '../../components/Pager';

const TermEntityFetcher = ({ dataUrl }) => {

  const [entity, setEntity] = useState();
  const [pagerdata, setPagerData] = useState();

  const importPageContent = (pageContent) => {
    if (pageContent && pageContent.current) {
      setPagerData(pageContent.current);
    }
  }
  const filterReset = () => {
    setPagerData();
  }

  useEffect(() => {
    let isMounted = true;

    let articleData = [];
    pagerdata && pagerdata.data && pagerdata.data.forEach((article) => {
      let thisTags = [];
      let thisImage = '';
      let thisParagraphs = [];
      if (pagerdata.included) {
        article.relationships.field_tags && article.relationships.field_tags.data.forEach((tag) => {
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
      setEntity(articleData);
    }

    return () => {
      isMounted = false;
    };
  }, [pagerdata])

  // console.log(entity)
  // console.log(pagerdata)
  // console.log(dataUrl)
  return (
    <>
      {entity && entity.length > 0 ?
        entity.map((thisEntity) => {
          return (
            <NodeTeaser entity={thisEntity} key={thisEntity.data.id} />
          )
        })
        : <Loading />}
      {dataUrl ?
        <Pager pageContents={importPageContent} url={dataUrl}
          reset={filterReset} authentication={false}
        />
        : ''}
    </>
  )
}

export default TermEntityFetcher;