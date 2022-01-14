import { Link } from 'react-router-dom';

const MoreButton = ({ link, text, type }) => {

  return (
    <div
      className={'uk-width-1-1 uk-margin-small uk-text-center'}
    >
      <Link to={link}
        className={('uk-button uk-button-default') + (type === 'primary' ? ' uk-button-primary'
          : type === 'secondary' ? ' uk-button-secondary' :
            '')}
      >
        {text}</Link>
    </div>
  )
}

export default MoreButton