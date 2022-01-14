import { useState, useEffect } from 'react';
import { config } from '../../DrupalUrl';
import Loading from '../../system/Loading';
import { FaInstagram, FaTwitter } from 'react-icons/fa';

const siteJsonUrl = config.url.SITE_JSON_URL
const ProductAttribute = (props) => {

  const variationUuid = props.uuid
  const variationType = props.type
  const thisComExtraSuffix = '?include=field_product_images,field_shipment_origin'

  const variationUrl = siteJsonUrl + 'product-variations/' + variationType + '/' + variationUuid + thisComExtraSuffix

  const [entity, setEntity] = useState({})

  useEffect(() => {
    const getEntity = async () => {
      const response = await fetch(variationUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
        },
        //redirect: 'follow',
      })
      const outputData = await response.json()
      setEntity(outputData)
    }
    getEntity()

  }, [variationUrl])

  console.log(entity)
  return (
    entity && entity.data ?
      <>
        <article className='uk-article uk-card' >
          varaition issagoal

          <div className='uk-grid-divider uk-margin-small uk-padding-small uk-grid'>

            <div className='uk-width-1-1 uk-margin-auto uk-width-2-3@s'>
              <div className='uk-width-1-1 uk-position-relative'>
                variation image
                variation features highlight
              </div>
            </div>

            <div className='uk-width-1-1 uk-width-1-3@s'>
              <div className='uk-text-center'>
                hot pick
              </div>
              <h2 className='variation-title'>
                variation title
              </h2>
              <div className='uk-child-width-1-2 uk-grid-small uk-grid-divider uk-margin-remove uk-grid'>
                product rating
                product brand
              </div>
              <div className='uk-flex uk-flex-center bold-font uk-text-primary uk-text-center uk-child-width-1-2 uk-grid-small uk-grid'>
                product field_quality
                variation shipment origin
              </div>

              <h3 className='variation-price uk-text-center'>
                variation price
              </h3>
              <div className='uk-flex uk-flex-right add-to-cart-link'>
                variation add to cart link
              </div>
              <hr className='uk-divider-icon uk-margin-small' />
              product features highlight
              <hr className='uk-divider-icon uk-margin-small uk-margin-remove-bottom' />

              <div className='uk-child-width-1-2 uk-child-width-1-1@s uk-child-width-expand@m uk-grid-small uk-flex-middle uk-grid'>
                variation waranty
                <div className='uk-flex uk-flex-right'>
                  product field_category
                </div>
              </div>
              <hr className='uk-divider-icon uk-margin-remove' />
              product payment options

              <div className='uk-hidden@s'>
                <hr className='uk-divider-icon' />
                <div className='uk-child-width-auto uk-grid-small uk-flex-center uk-flex-middle uk-grid'>
                  <div className='product-favourite-border uk-text-center'>
                    flagging favourite
                  </div>
                  <div className='product-qrcode uk-text-center uk-text-right@s'>
                    varaition qr code
                  </div>
                  <div className='product-availability uk-text-right uk-text-lead uk-text-primary'>
                    variation avalability
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </>
      : <Loading />
  )
}

export default ProductAttribute