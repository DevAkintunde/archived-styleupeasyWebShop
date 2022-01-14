import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import siteLogoImage from '../images/logo.png';

const SiteBranding = ({ siteName, siteLogo, siteSlogan }) => {

  return (
    <section>
      {siteName && siteLogo ?
        <Link to='/' rel="home" className='uk-flex uk-flex-middle uk-flex-center'>
          <div className='uk-text-break uk-flex-left uk-text-bold uk-text-lead'>{siteName}</div>
          <div className='uk-flex-right'>
            <img src={siteLogo} alt={siteName} className='uk-logo uk-margin-small-left' />
          </div>
        </Link>
        :
        <Link to='/' rel="home">
          <div className='uk-child-width-auto uk-flex uk-flex-middle uk-text-center'>
            <img src={siteLogo} alt={siteName} className='uk-logo uk-float-left uk-padding-small uk-margin-small-right' />

            {siteName ?
              <span className='uk-text-break uk-grid uk-grid-small uk-margin-small-bottom@s uk-text-bold uk-text-lead'>{siteName}
              </span>
              : ''
            }
          </div>
        </Link>
      }
      {siteSlogan ?
        <div className='uk-text-right uk-card uk-card-default uk-padding-small uk-padding-remove-left uk-padding-remove-vertical'>
          {siteSlogan}
        </div> :
        ''
      }
    </section>
  );
}

SiteBranding.defaultProps = {
  siteName: 'StyleUpEasy',
  siteSlogan: 'for Fashion, Style & Makeovers',
  siteLogo: siteLogoImage,
}

SiteBranding.propTypes = {
  siteName: PropTypes.string.isRequired,
  siteSlogan: PropTypes.string,
}

export default SiteBranding
