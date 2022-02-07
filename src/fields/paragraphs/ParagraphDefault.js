import { useState, useEffect, useContext } from 'react';
import Loading from '../../system/Loading';
import { config } from '../../DrupalUrl';
import { JwtToken } from '../../App';

const siteJsonUrl = config.url.SITE_JSON_URL;
const ParagraphDefault = ({ type, uuid, authentication }) => {
  //remove paragraph entity prefix
  const paragraphType = type.slice(11);
  let paragraphUrl = '';
  if (paragraphType === 'images') {
    paragraphUrl = siteJsonUrl + 'paragraph/' + uuid + '?include=field_images';
  } else if (paragraphType === 'image') {
    paragraphUrl = siteJsonUrl + 'paragraph/' + uuid + '?include=field_image';
  } else if (paragraphType === 'text') {
    paragraphUrl = siteJsonUrl + 'paragraph/' + uuid;
  }

  const { jwtTokenBearer } = useContext(JwtToken);
  const [token, setToken] = useState('');
  if (authentication === true) {
    setToken(jwtTokenBearer);
  }

  const [paragraph, setParagraph] = useState({});
  useEffect(() => {
    let isMounted = true;
    const getParagraphIncludedContent = async () => {
      const response = await fetch(paragraphUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
          'Authorization': 'Bearer ' + token,
        },
      })
      const outputParagraph = await response.json();
      if (isMounted) {
        setParagraph(outputParagraph);
      }
    }
    getParagraphIncludedContent();
    return () => {
      isMounted = false;
    };
  }, [paragraphUrl, token])
  // console.log(paragraph);

  if (paragraphType === 'images') {
    return (
      paragraph && paragraph.data && paragraph.included ?
        <div className='uk-grid-small uk-flex uk-flex-center uk-flex-middle uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-3@l uk-margin'>
          {paragraph.included.map((apiRes, index) => {
            return (
              <div key={apiRes.id}>
                <img src={apiRes.attributes.image_style_uri.large} alt={paragraph.data.relationships.field_images.data[index].meta.alt} />
                {paragraph.data.relationships.field_images && paragraph.data.relationships.field_images.data.length > 0 &&
                  paragraph.data.relationships.field_images.data[index].meta.alt ?
                  <div className='uk-text-small'>{paragraph.data.relationships.field_images.data[index].meta.alt}</div>
                  : ''}
              </div>
            )
          }
          )}
        </div>
        :
        <Loading message='Loading Images...' />
    )
  } else if (paragraphType === 'image') {
    return (
      paragraph && paragraph.data && paragraph.included ?
        <div className='uk-flex uk-flex-center uk-margin'>
          <div>
            <img src={paragraph.included[0].attributes.image_style_uri.large} alt={paragraph.data.relationships.field_image.data.meta.alt} />
            {paragraph.data.relationships.field_image &&
              paragraph.data.relationships.field_image.data.meta.alt ?
              <div className='uk-text-small'>{paragraph.data.relationships.field_image.data.meta.alt}</div>
              : ''}
          </div>
        </div>
        :
        <Loading message='Loading Image...' />
    )
  } else if (paragraphType === 'text') {
    return (
      paragraph && paragraph.data && paragraph.data.attributes.field_text
        && paragraph.data.attributes.field_text.processed ?
        <div className='uk-card uk-card-default uk-card-body uk-padding-small'>
          <div className='uk-margin'
            dangerouslySetInnerHTML={{ __html: paragraph.data.attributes.field_text.processed }}>
          </div>
        </div>
        :
        <Loading message='Loading content...' />
    )
  } else {
    return (
      <Loading message='Loading...' />
    )
  }

}
export default ParagraphDefault;