import { Link } from 'react-router-dom';
import { FaTags } from 'react-icons/fa';
import Loading from '../system/Loading';

const NodeTeaser = ({ entity }) => {
  //console.log(entity)
  return (
    <article className='uk-margin uk-card uk-card-default'>
      <div className='uk-child-width-1-1 uk-child-width-1-2@s uk-grid-small uk-flex-middle uk-grid-divider' data-uk-grid>
        <div>
          <div className='uk-text-center uk-position-relative'>
            {entity.data && entity.data.attributes.path.alias ?
              <>
                <Link to={entity.data.attributes.path.alias}>
                  <img src={entity.image} alt={entity.data.attributes.title} />
                </Link>
                {entity.data && entity.data.attributes.title ?
                  <h2 className='uk-text-lead uk-text-break uk-text-capitalize uk-margin-remove uk-padding-small uk-padding-remove-vertical uk-hidden@s'
                  >
                    <Link to={entity.data.attributes.path.alias}
                      className={'uk-text-bold'}
                    >
                      {entity.data.attributes.title}
                    </Link>
                  </h2>
                  : ''}
              </>
              : <Loading />}
          </div>
        </div>
        <div className='uk-grid-item-match uk-visible@s'>
          <div className='uk-padding-small'>

            {entity.data && entity.data.attributes.title ?
              <h2 className='uk-text-lead uk-margin-small-top uk-text-break uk-text-capitalize'>
                <Link to={entity.data.attributes.path.alias}>
                  {entity.data.attributes.title}
                </Link>
              </h2>
              : ''}

            {entity.data && entity.data.attributes.path.alias ?
              <div className='uk-margin' dangerouslySetInnerHTML={{
                __html: entity.data.attributes.body.processed
                  && entity.data.attributes.body.processed.length > 150 ?
                  entity.data.attributes.body.processed.substr(0, 150).trim() + '...'
                  : entity.data.attributes.body.processed.substr(0, 150)
              }}>
              </div>
              : <Loading />}

            {entity.tags && entity.tags.length > 0 ?
              <div className='uk-flex uk-flex-left'>
                <ul className='uk-subnav uk-margin uk-margin-remove-bottom'>
                  <li className='uk-flex uk-flex-middle'><FaTags /></li>
                  {entity.tags.map((term) => {
                    return (
                      <li key={term.id}>
                        <Link to={term.attributes.path.alias} className=''>
                          {term.attributes.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
              : ''}

            {entity.data && entity.data.attributes.path ?
              <ul className='uk-subnav uk-subnav-pill'>
                <li className=''><Link to={entity.data.attributes.path.alias}>
                  {'Read More'}
                </Link>
                </li>
              </ul>
              : ''}

          </div>
        </div>
      </div>
    </article>
  )
}
export default NodeTeaser;