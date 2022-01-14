import { useState, useEffect } from 'react';
import { FaBtc, FaCreditCard, FaGlobe, FaGlobeAfrica, FaGlobeAmericas, FaGlobeAsia, FaGlobeEurope } from 'react-icons/fa';
import { config } from '../../DrupalUrl';
import Loading from '../../system/Loading';
import QRCode from "react-qr-code";

const siteJsonUrl = config.url.SITE_JSON_URL
const ProductVariation = (props) => {
  const variantProperties = props.variantProperties;
  const variationUuid = props.uuid;
  const variationType = props.type;
  //console.log(variationType);
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
    const getEntity = async () => {
      const response = await fetch(variationUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
        }
      })
      const outputData = await response.json();
      setEntity(outputData);
    }
    getEntity();

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
  let variationOrigin = '';
  entity && entity.data && entity.data.relationships
    && entity.data.relationships.field_shipment_origin.data &&
    entity.included.forEach((includedRel) => {
      if (includedRel.type === 'taxonomy_term--shipment_origin'
        && includedRel.id === entity.data.relationships.field_shipment_origin.data.id) {
        variationOrigin = includedRel.attributes.name;
      }
    })

  //console.log(entity);

  return (
    entity && entity.data ?
      <>
        <article className='uk-article uk-card' >
          <div className='uk-grid-divider uk-margin-small uk-padding-small' data-uk-grid>

            <div className='uk-width-1-1 uk-margin-auto uk-width-2-3@s'>
              <div className='uk-position-relative'>
                <div data-uk-slideshow={'autoplay: true; ratio: 1:1'}>
                  <ul className='uk-slideshow-items' data-uk-lightbox>
                    {variationImages ?
                      variationImages.map((image, index) => {
                        return (
                          <a href={image} key={index}>
                            <img src={image} alt={entity.data.attributes.title}
                              data-uk-img></img>
                          </a>
                        )
                      })
                      : <Loading />}
                  </ul>
                  <button className={'uk-position-center-left uk-position-small uk-hidden-hover'}
                    data-uk-slidenav-previous data-uk-slideshow-item={'previous'}></button>
                  <button className={'uk-position-center-right uk-position-small uk-hidden-hover'}
                    data-uk-slidenav-next data-uk-slideshow-item={'next'}></button>
                </div>
                <div
                  style={{ padding: '5px', backgroundColor: '#fff' }}
                  className={'uk-position-top-right'}>
                  <QRCode value={props.qrCodeUrl} level='L' size={100}
                    className='uk-visible@s' />
                  <QRCode value={props.qrCodeUrl} level='L' size={75}
                    className='uk-hidden@s' />
                </div>
              </div>

              <div className={'uk-margin'}>
                <ul data-uk-accordion>
                  <li>
                    <label className={'uk-accordion-title'}
                      style={{ cursor: 'pointer' }}
                    >Extra Features</label>
                    <div className={'uk-accordion-content'}>
                      {entity.data.attributes &&
                        entity.data.attributes.field_features_highlight &&
                        entity.data.attributes.field_features_highlight.length > 0 &&
                        entity.data.attributes.field_features_highlight.map((features, index) => {
                          return (
                            <div key={index} className={'accordion-li'}>
                              {features}
                            </div>
                          )
                        })}
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className='uk-width-1-1 uk-width-1-3@s'>
              <h2 className='uk-text-bold uk-text-center'>
                {entity.data.attributes && entity.data.attributes.title ?
                  entity.data.attributes.title.split(' - ')[1]
                  : ''}
              </h2>
              <div className='uk-text-center'>
                <div style={{
                  backgroundColor: '#BA6B57', color: '#fff',
                  padding: '3px 7px', fontWeight: 'bold', display: 'inline-block'
                }}>{props.brand}
                </div>
              </div>
              <hr className='uk-divider-icon uk-margin-remove' />
              <div className='uk-flex uk-flex-center bold-font uk-text-primary uk-text-center uk-child-width-1-2 uk-grid-small' data-uk-grid>
                <div><span style={{
                  borderRadius: '100px', textAlign: 'center',
                  color: '#fefefe', fontWeight: 'bold', padding: '4px 14px',
                  backgroundColor: props.quality === 'New' ? '#309506' : props.quality === 'Used' ? '#956206' : '#082e50eb'
                }}>{props.quality}</span>
                </div>
                <div>
                  <div style={{ color: '#36a906' }}
                    data-uk-tooltip={variationOrigin === 'Local' ?
                      'shipped Locally'
                      : 'shipped from ' + variationOrigin}
                  >
                    {variationOrigin === 'Local' ?
                      <FaGlobeAfrica className={'uk-margin-small-right'} />
                      : variationOrigin === 'Asia' ?
                        <FaGlobeAsia className={'uk-margin-small-right'} />
                        : variationOrigin === 'Europe' ?
                          <FaGlobeEurope className={'uk-margin-small-right'} />
                          : variationOrigin === 'North A' ?
                            <FaGlobeAmericas className={'uk-margin-small-right'} />
                            : <FaGlobe className={'uk-margin-small-right'} />}
                    s. {variationOrigin}</div>
                </div>
              </div>
              <hr className='uk-divider-icon uk-margin-remove' />
              <div className={'uk-width-1-1 uk-flex uk-flex-center uk-flex-middle uk-margin-small'}>
                <div
                  style={{
                    fontWeight: 'bold', textAlign: 'center',
                    fontSize: '1.5rem', lineHeight: '1.4'
                  }}>
                  {entity.data.attributes && entity.data.attributes.resolved_price ?
                    entity.data.attributes.resolved_price.formatted : ''}
                </div>

              </div>
              <hr className='uk-divider-icon uk-margin-remove' />

              <ul className='uk-margin-remove' data-uk-accordion>
                <li className={'uk-open'}>
                  <label className={'uk-accordion-title'}
                    style={{ cursor: 'pointer' }}
                  >Features Highlight</label>
                  <div className={'uk-accordion-content'}>
                    {props.mainFeatures.map((feature, index) => {
                      return (
                        <div key={index} className={'accordion-li'}>
                          {feature}
                        </div>
                      )
                    })}
                  </div>
                </li>
              </ul>
              <hr className='uk-divider-icon uk-margin-small uk-margin-remove-bottom' />

              <div className='uk-child-width-1-2 uk-child-width-1-1@s uk-child-width-expand@m uk-grid-small uk-flex-middle' data-uk-grid>
                <div>{entity.data.field_warranty}</div>
                <div className='uk-flex uk-flex-right'>
                  {props.categories.sort(
                    (a, b) => a.term_depth < b.term_depth ? 1 : -1
                  ).map((category, index) => {
                    return (
                      <span key={category.term_depth}
                        style={{ marginRight: '5px', fontStyle: 'oblique', whiteSpace: 'nowrap' }}>
                        {category.name}
                        {props.categories.length === (index + 1) ?
                          '' : ','}</span>
                    )
                  })}
                </div>
              </div>
              <hr className='uk-divider-icon uk-margin-remove' />
              <div className={'uk-flex uk-flex-right uk-grid-small uk-grid-divider'} data-uk-grid>
                {props.payments.map((payment, index) => {
                  return (
                    <div key={index} style={{ verticalAlign: 'middle' }}>
                      {payment === 'Naira' ?
                        <FaCreditCard />
                        : payment === 'Cryptocurrency' ?
                          <FaBtc />
                          : ''}
                      {payment}</div>
                  )
                })}
              </div>
            </div>
          </div>

        </article>
      </>
      : <Loading />
  )
}

export default ProductVariation