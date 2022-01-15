import { useState, useEffect, useContext, Fragment } from 'react';
import { JwtToken, LoggedStatus, LoggedUID } from '../../../App';
import MoreButton from '../../../components/MoreButton';
import { config } from '../../../DrupalUrl';
import Loading from '../../../system/Loading';
import OrderTeaser from '../../../teasers/OrderTeaser';

const siteJsonUrl = config.url.SITE_JSON_URL
const DashboardOrders = () => {
  const { jwtTokenBearer } = useContext(JwtToken);
  const { loggedIn } = useContext(LoggedStatus);
  const { Uid } = useContext(LoggedUID);

  const [userOrders, setUserOrders] = useState([]);
  const [nonOrderMessage, setNonOrderMessage] = useState();

  const userOrdersFilter = 'orders?filter[uid.id][value]=' + Uid + '&filter[cart][value]=false&sort[sort-order][path]=completed&sort[sort-order][direction]=DESC&include=order_items.purchased_entity.field_product_images&page[limit]=6'
  useEffect(() => {
    let isMounted = true;
    const getOrders = async () => {
      const response = await fetch(siteJsonUrl + userOrdersFilter, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
          'Authorization': 'Bearer ' + jwtTokenBearer,
        }
      })
      const outputData = await response.json();
      // console.log(response);
      // console.log(outputData);
      let allOrders = [];
      if (isMounted) {
        if (outputData && outputData.data && outputData.data.length === 0) {
          setNonOrderMessage('Seems you do not have a recent order');
        } else {
          outputData && outputData.data.forEach((order) => {
            outputData.included.forEach((orderItem) => {
              if (orderItem.type.includes('order-item')) {
                if (order.id === orderItem.relationships.order_id.data.id) {
                  let imgUrl = ''
                  let itemTotalPaid = 0;
                  const orderUuid = order.id;
                  let orderCompleted = ''
                  if (order.attributes.total_paid && order.attributes.total_paid.formatted) {
                    itemTotalPaid = order.attributes.total_paid.formatted;
                  }
                  if (order.attributes.completed) {
                    const date = new Date(order.attributes.completed);
                    orderCompleted = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
                  }
                  outputData.included.forEach((purchasedItem) => {
                    if (purchasedItem.type.includes('product-variation')
                      && orderItem.relationships.purchased_entity.data.id ===
                      purchasedItem.id) {
                      outputData.included.forEach((purchaseItemImage) => {
                        if (purchaseItemImage.type.includes('file--file') &&
                          purchaseItemImage.id === purchasedItem.relationships.field_product_images.data[0].id) {
                          imgUrl = purchaseItemImage.attributes.image_style_uri.medium
                        }
                      })
                    }
                  })
                  const quantity = orderItem.attributes.quantity * 1
                  const itemTitle = orderItem.attributes.title

                  const eachOrder = {
                    'img': imgUrl,
                    'qty': quantity,
                    'title': itemTitle,
                    'price': itemTotalPaid,
                    'uuid': orderUuid,
                    'date': orderCompleted
                  }
                  allOrders.push(eachOrder)
                }
              }
            })
          });
          setUserOrders(allOrders);
        }
      }
    }
    getOrders();

    return () => {
      isMounted = false;
    };
  }, [loggedIn, Uid, userOrdersFilter, jwtTokenBearer])
  // console.log(Uid);
  // console.log(userOrders);

  return (
    <article className='uk-article uk-card-body uk-padding-small'>
      {
        userOrders ?
          <>
            <div className='uk-heading-bullet uk-text-lead uk-margin-small uk-text-center'>
              Recent Orders
            </div>
            <div className='uk-child-width-1-2 uk-child-width-1-3@m' data-uk-grid>
              {userOrders.length > 0 ?
                userOrders.map((order, index) => {
                  return (
                    order ?
                      <Fragment key={index} >
                        <OrderTeaser order={order} />
                      </Fragment>
                      : <div className={'uk-width-1-1'}><Loading /></div>
                  )
                })
                : <div className={'uk-width-1-1'}>
                  <Loading message={nonOrderMessage ?
                    nonOrderMessage : "Oops! We can't seem to get you existing cart"} />
                </div>
              }
            </div>
            {userOrders.length > 0 ?
              <MoreButton text={'All Orders'}
                link={'/signed-in/orders'} type={'primary'} />
              : ''}
          </>
          :
          <Loading />
      }
    </article>
  )
}


export default DashboardOrders;