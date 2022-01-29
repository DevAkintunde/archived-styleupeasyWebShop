import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { config } from '../DrupalUrl';
import Loading from '../system/Loading';

const siteJsonUrl = config.url.SITE_JSON_URL
const ProductTeaserVariation = (props) => {
  const variantProperties = props.variantProperties;
  const variationUuid = props.uuid;
  const variationType = props.type;
  //console.log(props);
  let attributeAddOn = '';
  if (
    ['exfoliant', 'jewellery', 'moisturizer', 'smart_wear'].includes(variationType)) {
    attributeAddOn = attributeAddOn + ',attribute_age'
  }
  if (
    ['accessory', 'bedding', 'clothing', 'curtain', 'floor', 'footwear', 'interior', 'jewellery', 'light', 'material', 'smart_wear'].includes(variationType)) {
    attributeAddOn = attributeAddOn + ',attribute_colour'
  }
  if (
    ['accessory', 'clothing', 'exfoliant', 'footwear', 'fragrance', 'jewellery', 'material', 'moisturizer', 'smart_wear'].includes(variationType)) {
    attributeAddOn = attributeAddOn + ',attribute_sex'
  }
  if (
    ['clothing', 'footwear'].includes(variationType)) {
    attributeAddOn = attributeAddOn + ',attribute_size'
  }

  const thisComExtraSuffix = '?include=field_product_images,field_shipment_origin' + attributeAddOn;

  const variationUrl = siteJsonUrl + 'product-variations/' + variationType + '/' + variationUuid + thisComExtraSuffix;

  const [entity, setEntity] = useState();

  useEffect(() => {
    let isMounted = true;
    const getEntity = async () => {
      const response = await fetch(variationUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
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
    };
  }, [variationUrl])

  useEffect(() => {
    if (entity && entity.data) {
      variantProperties(entity);
    }
  }, [entity, variantProperties])

  let variationImages = [];
  entity && entity.data && entity.data.relationships && entity.included
    && entity.data.relationships.field_product_images &&
    entity.data.relationships.field_product_images.data.forEach((image) => {
      entity.included.forEach((includedRel) => {
        if (includedRel.type === 'file--file' && includedRel.id === image.id) {
          variationImages.push(includedRel.attributes.image_style_uri.squared_medium);
        }
      })
    })
  // let variationOrigin = '';
  // entity && entity.data && entity.data.relationships
  //   && entity.data.relationships.field_shipment_origin.data &&
  //   entity.included.forEach((includedRel) => {
  //     if (includedRel.type === 'taxonomy_term--shipment_origin'
  //       && includedRel.id === entity.data.relationships.field_shipment_origin.data.id) {
  //       variationOrigin = includedRel.attributes.name;
  //     }
  //   })

  //console.log(entity);

  return (
    entity && entity.data ?
      <>
        <div className='uk-margin-small uk-padding-small'>
          <div className={'uk-position-relative'}>
            <div data-uk-slideshow={'autoplay: true; ratio: 1:1'}>
              <ul className='uk-slideshow-items'>
                {variationImages ?
                  variationImages.map((image, index) => {
                    return (
                      <Link to={props.productUrl} key={index}>
                        <img style={{ minHeight: '100px' }} src={image} alt={entity.data.attributes.title} />
                      </Link>
                    )
                  })
                  : <Loading />}
              </ul>
              <button className={'uk-position-center-left uk-position-small uk-hidden-hover'}
                data-uk-slidenav-previous data-uk-slideshow-item={'previous'}></button>
              <button className={'uk-position-center-right uk-position-small uk-hidden-hover'}
                data-uk-slidenav-next data-uk-slideshow-item={'next'}></button>
            </div>
            <div className='uk-margin-top uk-position-top-left'>

              <div style={{
                backgroundColor: '#BA6B57', color: '#fff',
                padding: '3px 7px', fontWeight: 'bold',
                border: '2px solid #ffffffa3', borderLeft: 'none',
              }}>{props.brand}
              </div>
              <div style={{
                borderRadius: '100px', border: '2px solid #ffffffa3',
                textAlign: 'center', margin: '10px 0 0 5px',
                color: '#fefefe', fontWeight: 'bold', padding: '4px 10px', display: 'inline-block',
                backgroundColor: props.quality === 'New' ? '#309506' : props.quality === 'Used' ? '#956206' : '#082e50eb'
              }}>{props.quality}
              </div>
            </div>

            <div
              className={'uk-overlay uk-overlay-default uk-position-bottom'}
              style={{
                fontWeight: 'bold', textAlign: 'center',
                fontSize: '1.5em', lineHeight: '.5', padding: '15px'
              }}>
              {entity.data.attributes && entity.data.attributes.resolved_price ?
                entity.data.attributes.resolved_price.formatted : ''}
            </div>
          </div>
        </div>
      </>
      : <Loading />
  )
}

export default ProductTeaserVariation