import { useState, useContext, Fragment } from 'react';
import { LoggedUID } from '../../../App';
import Pager from '../../../components/Pager';
import { config } from '../../../DrupalUrl';
import PageTitle from '../../../layout/PageTitle';
import Loading from '../../../system/Loading';
import OrderTeaser from '../../../teasers/OrderTeaser';

const siteJsonUrl = config.url.SITE_JSON_URL;
const OrdersPage = () => {
  const { Uid } = useContext(LoggedUID);

  const fetchUrl = siteJsonUrl + 'orders?filter[uid.id][value]=' + Uid + '&filter[cart][value]=false&sort[sort-order][path]=completed&sort[sort-order][direction]=DESC&include=order_items.purchased_entity.field_product_images';

  const [orderContents, setOrderContents] = useState();
  let allOrders = [];
  orderContents && orderContents.current && orderContents.current.data && orderContents.current.data.forEach((order) => {
    orderContents.current.included.forEach((orderItem) => {
      if (orderItem.type.includes('order-item--')) {
        if (order.id === orderItem.relationships.order_id.data.id) {
          let imgUrl = '';
          let itemTotalPaid = 0;
          const orderUuid = order.id;
          let orderCompleted = '';
          if (order.attributes.total_paid && order.attributes.total_paid.formatted) {
            itemTotalPaid = order.attributes.total_paid.formatted;
          }
          if (order.attributes.completed) {
            const date = new Date(order.attributes.completed);
            orderCompleted = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
          }
          orderContents.current.included.forEach((purchasedItem) => {
            if (purchasedItem.type.includes('product-variation')
              && orderItem.relationships.purchased_entity.data.id ===
              purchasedItem.id) {
              orderContents.current.included.forEach((purchaseItemImage) => {
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
            'date': orderCompleted,
            'multiItems': 0
          }
          if (allOrders.some(thisUuid => thisUuid.uuid === eachOrder.uuid)) {
            allOrders.forEach((thisOrder) => {
              if (thisOrder.uuid === eachOrder.uuid) {
                thisOrder.multiItems++;
              }
            });
          } else {
            allOrders.push(eachOrder);
          }
        }
      }
    })
  });


  const importPageContent = (pageContent) => {
    setOrderContents(pageContent);
  }
  const filterReset = () => {
    setOrderContents();
  }
  // console.log(Uid);
  // console.log(fetchUrl)
  // console.log(orderContents)
  // console.log(allOrders)

  return (
    <>
      <PageTitle title={'Your Orders'} />
      <article className='uk-article uk-card-body uk-padding-small'>
        {
          allOrders ?
            <>
              <div className='uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@m uk-flex uk-flex-center'
                data-uk-grid>
                {allOrders && allOrders.length > 0 ?
                  <>
                    {allOrders && allOrders.map((order, index) => {
                      return (
                        order ?
                          <div key={index} style={{ maxWidth: '300px' }}>
                            <OrderTeaser order={order} />
                          </div>
                          : <div className={'uk-width-1-1'}><Loading /></div>
                      )
                    })}
                  </>
                  : <div className={'uk-width-1-1'}>
                    <Loading message='Seems you do not have a recent order' />
                  </div>
                }
              </div>
            </>
            :
            <Loading />
        }
      </article>
      {fetchUrl && Uid && Uid !== 0 ?
        <Pager pageContents={importPageContent} url={fetchUrl}
          reset={filterReset} />
        : ''}
    </>
  )
}


export default OrdersPage;