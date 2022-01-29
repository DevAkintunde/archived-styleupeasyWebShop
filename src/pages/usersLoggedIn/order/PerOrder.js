import { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { config } from "../../../DrupalUrl";
import { JwtToken } from "../../../App";
import Loading from "../../../system/Loading";
import PageTitle from "../../../layout/PageTitle";

const siteJsonUrl = config.url.SITE_JSON_URL;
const PerOrder = (props) => {
  const uuid = props.match.params.order;
  const { jwtTokenBearer } = useContext(JwtToken);
  const [orderContent, setOrderContent] = useState();

  const alias = 'commerce_order/' + uuid;
  const aliasExtraSuffix = '?include=order_items.purchased_entity.field_product_images,shipments.shipping_method,payment_method';
  useEffect(() => {
    let isMounted = true;
    const getOrder = async () => {
      const response = await fetch(siteJsonUrl + alias + aliasExtraSuffix, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
          'Authorization': 'Bearer ' + jwtTokenBearer,
        }
      })
      const outputData = await response.json();
      if (isMounted) {
        setOrderContent(outputData);
      }
    }
    getOrder();

    return () => {
      isMounted = false;
    };
  }, [alias, aliasExtraSuffix, jwtTokenBearer])

  // console.log(orderContent);
  let shippingMethod = '';
  let orderItems = [];

  orderContent && orderContent.included &&
    orderContent.included.forEach(element => {
      if (element.type === 'shipping-method') {
        if (element.attributes && element.attributes.plugin
          && element.attributes.plugin.target_plugin_configuration) {
          element.attributes.plugin.target_plugin_configuration.rate_label ?
            shippingMethod = element.attributes.plugin.target_plugin_configuration.rate_label
            : shippingMethod = element.attributes.name
        }
      }
    });

  orderContent && orderContent.included &&
    orderContent.included.forEach(orderItem => {
      if (orderItem.type.includes('order-item--')) {
        const itemTitle = orderItem.attributes.title;
        const qty = orderItem.attributes.quantity;
        const totalPrice = orderItem.attributes.total_price.formatted;
        let itemType = '';
        let images = [];
        orderContent.included.forEach(purchasedItem => {
          if (purchasedItem.type.includes('product-variation--')) {
            if (purchasedItem.id === orderItem.relationships.purchased_entity.data.id) {
              if (purchasedItem.relationships.product_variation_type
                && purchasedItem.relationships.product_variation_type.data) {
                itemType = purchasedItem.relationships.product_variation_type.data.meta.drupal_internal__target_id;
              }
              orderContent.included.forEach(image => {
                if (image.type === 'file--file') {
                  purchasedItem.relationships.field_product_images.data.forEach(productImage => {
                    if (image.id === productImage.id) {
                      images.push(image.attributes.image_style_uri.large);
                    }
                  })
                }
              });
            }
          }
        });
        const orderItemProps = {
          title: itemTitle,
          qty: qty * 1,
          totalPrice: totalPrice,
          type: itemType,
          images: images
        };
        orderItems.push(orderItemProps);
      }
    });

  let orderCreated = '';
  let orderCompleted = '';
  if (orderContent && orderContent.data && orderContent.data.attributes.created) {
    const date = new Date(orderContent.data.attributes.created);
    orderCreated = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
  }
  if (orderContent && orderContent.data && orderContent.data.attributes.completed) {
    const date = new Date(orderContent.data.attributes.completed);
    orderCompleted = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
  }
  // console.log(orderItems)

  return (
    <>
      <PageTitle title={orderContent && orderContent.data && orderContent.data.attributes.order_number ?
        'Order No. ' + orderContent.data.attributes.order_number : 'Order'} />
      <div className={'uk-article uk-card-body uk-padding-small'}>
        {
          orderContent && orderContent.data ?
            <div className={'uk-article uk-card-body uk-padding'}>
              <div>
                <label className='uk-heading-bullet uk-text-lead uk-margin-small uk-text-center'>
                  Order Information</label>
                <div className={'uk-margin-left'}>
                  <div>
                    <label style={{ fontSize: 'larger', marginRight: '20px' }}>Order No | </label>{orderContent.data.attributes.order_number ?
                      orderContent.data.attributes.order_number
                      : 'nil'}
                  </div>
                  <div>
                    <label style={{ fontSize: 'larger', marginRight: '20px' }}>Order Started | </label>
                    {orderCreated ?
                      orderCreated
                      : 'nil'}
                  </div>
                  <div>
                    <label style={{ fontSize: 'larger', marginRight: '20px' }}>Order Completed | </label>
                    {orderCompleted ?
                      orderCompleted
                      : 'nil'}
                  </div>
                  <div>
                    <label style={{ fontSize: 'larger', marginRight: '20px' }}>Contact Email | </label>{orderContent.data.attributes.email ?
                      orderContent.data.attributes.email
                      : 'nil'}
                  </div>
                </div>
              </div>
              <div>
                <label className='uk-heading-bullet uk-text-lead uk-margin-small uk-text-center'>
                  Shipping Information</label>
                <div className={'uk-margin-left'}>
                  {orderContent.data.attributes.shipping_information
                    && orderContent.data.attributes.shipping_information.address ?
                    <div>
                      <div>
                        <label style={{ fontSize: 'larger', marginRight: '20px' }}>Address | </label>{
                          orderContent.data.attributes.shipping_information.address.address_line1 + ', '
                          + orderContent.data.attributes.shipping_information.address.locality + ', '
                          + orderContent.data.attributes.shipping_information.address.administrative_area + ', '
                          + orderContent.data.attributes.shipping_information.address.country_code
                        }
                      </div>
                      <div>
                        <label style={{ fontSize: 'larger', marginRight: '20px' }}>Receiver | </label>{
                          orderContent.data.attributes.shipping_information.address.given_name + ' ' +
                          (orderContent.data.attributes.shipping_information.address.family_name ?
                            orderContent.data.attributes.shipping_information.address.family_name : '')
                        }
                      </div>
                    </div>
                    : 'nil'}
                </div>
              </div>
              <div>
                <label className='uk-heading-bullet uk-text-lead uk-margin-small uk-text-center'>
                  Shipment</label>
                <div className={'uk-margin-left'}>
                  {shippingMethod ? shippingMethod : 'In Progress'}
                </div>
              </div>

              <div>
                <label className='uk-heading-bullet uk-text-lead uk-margin-small uk-text-center'>
                  Order Items</label>
                <div className={'uk-margin-left uk-overflow-auto'}>
                  {orderItems ?
                    <table className={'uk-table uk-table-divider uk-table-small uk-table-middle uk-table-striped'}>
                      <thead>
                        <tr>
                          <th style={{ minWidth: '180px' }}>Item</th>
                          <th className={'uk-text-center'}>Qty</th>
                          <th className={'uk-text-center'}>Category</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <span>{item.title.split(' - ')[0]}</span>
                                <div className='uk-text-secondary uk-text-italic'>{item.title.split(' - ')[1]}</div>
                              </td>
                              <td className={'uk-text-center'}>{item.qty}</td>
                              <td className={'uk-text-center uk-text-capitalize'}>{item.type ? item.type : '-'}</td>
                              <td>{item.totalPrice}</td>
                              <td data-uk-lightbox>
                                {item.images.map((image, imageIndex) => {
                                  return (
                                    imageIndex === 0 ?
                                      <a href={image} key={imageIndex}><img src={item.images[0]} width='100px' height='100px' alt={item.title} data-uk-img></img></a>
                                      : <a href={image} key={imageIndex}> </a>
                                  )
                                })}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table> : ''
                  }
                </div>
              </div>
              <div className='uk-margin-top'>
                <label className='uk-heading-bullet uk-text-lead uk-margin-small uk-text-center'>
                  Payment Summary</label>
                <div className={'uk-margin-left'}>
                  {orderContent.data.attributes.order_total ?
                    <>
                      <div>
                        {orderContent.data.attributes.order_total.adjustments ?
                          orderContent.data.attributes.order_total.adjustments.map((adjustment, index) => {
                            return (
                              !adjustment.type.toLowerCase().includes('tax') ?
                                <div key={index} className={'uk-text-capitalize'}>
                                  <label style={{ fontSize: 'larger', marginRight: '20px' }}>{adjustment.type} | </label>{adjustment.total && adjustment.total.formatted ?
                                    adjustment.total.formatted : ''}
                                </div>
                                : ''
                            )
                          })
                          : ''}
                      </div>
                      <div>
                        <label style={{ fontSize: 'larger', marginRight: '20px' }}>Total Item Price | </label>{orderContent.data.attributes.order_total.subtotal.formatted}
                      </div>
                      <div>
                        <label style={{ fontSize: 'larger', marginRight: '20px' }}>Total Paid | </label>{orderContent.data.attributes.total_paid
                          && orderContent.data.attributes.total_paid.formatted ?
                          orderContent.data.attributes.total_paid.formatted
                          : 'Pending'}
                      </div>
                    </>
                    : 'nil'}
                </div>
              </div>
              <div>
                <label className='uk-heading-bullet uk-text-lead uk-margin-small uk-text-center uk-hidden'>
                  Compliant(s) | ---</label>
              </div>
            </div>
            : <Loading />
        }</div>
    </>
  )
}
export default withRouter(PerOrder)