import { Link } from 'react-router-dom';
import Loading from '../system/Loading';

const ProductVariationTeaser = ({ entity }) => {

  //console.log(entity)
  return (
    <div className='uk-card uk-card-default uk-align-center'
      style={{ maxWidth: '300px' }}>
      <div className={'uk-position-relative'}>
        <div className='uk-text-center'>
          {entity.data && entity.parent_url ?
            <Link to={entity.parent_url}>
              <img src={entity.images[0]} alt={entity.data.attributes.title} />
            </Link>
            : <Loading />}
        </div>
        <div className={'uk-text-lead uk-text-center uk-padding-remove bold-font uk-overlay uk-overlay-primary uk-position-bottom'}>
          {entity.data.attributes.price.formatted}
        </div>
      </div>
      <h2 className='uk-text-lead uk-text-center uk-text-capitalize uk-margin-remove uk-padding-small'>
        <Link to={entity.parent_url}>
          {entity.data.attributes.title.split(' - ')[0]}
        </Link>
      </h2>
    </div >
  )
}


export default ProductVariationTeaser;