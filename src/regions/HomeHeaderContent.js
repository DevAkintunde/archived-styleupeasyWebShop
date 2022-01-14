import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomeHeaderProductImport from '../blocks/homepage/HomeHeaderProductImport';
import Loading from '../system/Loading';
import { config } from '../DrupalUrl';

//const siteUrl = config.url.SITE_URL
const siteJsonUrl = config.url.SITE_JSON_URL

const HomeHeaderContent = () => {

  const [headerContent, setHeaderContent] = useState({})

  const aliasSuffix = 'node/article?filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&page[limit]=3&include=field_image';
  useEffect(() => {
    let isMounted = true;
    const getHeaderContent = async () => {
      const response = await fetch(siteJsonUrl + aliasSuffix, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json'
        }
      })
      const outputData = await response.json();
      //console.log(outputData);
      if (isMounted) {
        let contentData = []
        outputData && outputData.data && outputData.data.forEach((article) => {
          let imageUrl = '';
          outputData.included && outputData.included.forEach((included) => {
            if (article.relationships.field_image.data.id === included.id) {
              imageUrl = included.attributes.image_style_uri.header;
            }
          })
          const perArticle = {
            'article': article,
            'image': imageUrl
          };
          contentData.push(perArticle);
        })
        if (contentData.length > 0) {
          setHeaderContent(contentData);
        }
      }
    }
    getHeaderContent()

    return () => {
      isMounted = false;
    };
  }, [])

  //console.log(headerContent)
  return (
    headerContent && headerContent.length > 0 ?
      <div data-uk-slideshow={'autoplay: true; ratio: 9:4'}>
        <ul className='uk-slideshow-items'>
          {headerContent.map((thisArticle) => {
            return (
              <li key={thisArticle.article.id}>
                <div>
                  <HomeHeaderProductImport />
                  <div className='uk-position-center-right uk-position-medium uk-padding-small uk-card-default-light uk-width-percentage-45'>
                    <h2 className="bold-font uk-visible@s">
                      {thisArticle.article.attributes.title &&
                        thisArticle.article.attributes.title.length > 30 ?
                        thisArticle.article.attributes.title.substr(0, 30) + '...'
                        : thisArticle.article.attributes.title}
                    </h2>
                    <h4 className="uk-visible@s uk-margin-remove"
                      dangerouslySetInnerHTML={{
                        __html: thisArticle.article.attributes.body.processed
                          && thisArticle.article.attributes.body.processed.length > 80 ?
                          thisArticle.article.attributes.body.processed.substr(0, 80).trim() + '...'
                          : thisArticle.article.attributes.body.processed
                      }}></h4>
                    <div className="uk-visible@s">
                      <Link to={thisArticle.article.attributes.path.alias} className='uk-button uk-button-secondary'>Read More</Link>
                    </div>
                    <div className="uk-hidden@s uk-text-center">
                      <Link to='/category/in-stock' className='bold-font uk-text-primary' title='Shop & Buy'>Let's shop</Link>
                    </div>
                  </div>
                  {thisArticle.image ?
                    <img src={thisArticle.image} alt={thisArticle.article.attributes.title} />
                    : ''}
                </div>
              </li>
            )
          })}
        </ul>
        <button className={'uk-position-center-left uk-position-small uk-hidden-hover'}
          data-uk-slidenav-previous data-uk-slideshow-item={'previous'}></button>
        <button className={'uk-position-center-right uk-position-small uk-hidden-hover'}
          data-uk-slidenav-next data-uk-slideshow-item={'next'}></button>
      </div> :
      <Loading />
  );
}

export default HomeHeaderContent
