import { Link } from 'react-router-dom'
import Loading from '../system/Loading';

const OrderTeaser = ({ order }) => {

  const url = '/signed-in/orders/' + order.uuid;
  return (
    order ?
      <div>
        <div className={'uk-card uk-card-default uk-padding-small uk-visible-toggle'}>
          <div className='uk-height-medium uk-background-blend-color-soft-light uk-background-default uk-background-cover uk-position-relative'
            style={{ backgroundImage: 'url(' + order.img + ')' }}
          >
            {order.date ?
              <div className={'uk-background-secondary uk-padding-small uk-padding-remove-vertical uk-position-top-right'}>
                {order.date}
              </div>
              : ''}
            <Link to={url}
              className={'uk-overlay uk-overlay-default bold-font uk-position-cover uk-invisible-hover'}
            >
              <div className='uk-position-center'>View</div>
            </Link>
            <div className={'uk-background-default uk-text-center uk-position-bottom'}>
              <div className={'uk-text-bolder'}>
                <Link to={url}>
                  {order.title}
                </Link>
                {order.multiItems ?
                  <div className='uk-text-muted'>
                    {' + ' + order.multiItems + ' more'}
                  </div> : ''}
              </div>
              <div>
                Paid: {order.price ? order.price : 'nil'}
              </div>
            </div>
          </div>
        </div >
      </div>
      : <Loading />
  )
}


export default OrderTeaser;