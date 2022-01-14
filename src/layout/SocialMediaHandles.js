import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaPhone, FaYoutube, FaInstagram, FaTwitter, FaWhatsapp, FaFacebook, FaShoppingBag, FaSignInAlt } from 'react-icons/fa'
import { useContext } from 'react';
import { LoggedStatus } from '../App';
import LoggedInNavigation from './LoggedInNavigation';
//import { config } from '../DrupalUrl';

const SocialMediaHandles = ({
  brandEmail, brandWhatsapp,
  brandPhoneNo, brandYoutube,
  brandInstagram, brandFacebook,
  brandTwitter, cartCount
}) => {
  const { loggedIn } = useContext(LoggedStatus);
  const fireInCartButton = () => {
    let cartButton = document.getElementById('inCartButton');
    if (cartButton) {
      cartButton.click();
    }
  }

  return (
    <nav className='uk-margin-small uk-background-default' uk-sticky='top: 200; animation: animation-slide-top; bottom: #main-content'
      style={{ _width: '100%', _margin: 'auto', right: '0' }}
      data-uk-grid>

      <div className='uk-visible@m' role='navigation'>
        <div className='uk-grid-divider uk-grid-small uk-margin-small' data-uk-grid>

          {brandEmail ?
            <li>
              <a href={'mailto: ' + brandEmail} target='_blank' rel="noreferrer" style={{ fontSize: 'larger' }}><FaEnvelope /></a>
            </li> :
            ''
          }
          {brandWhatsapp ?
            <li>
              <a href={'https://wa.me/' + brandWhatsapp} target='_blank' rel="noreferrer" style={{ fontSize: 'larger' }}><FaWhatsapp /></a>
            </li> :
            ''
          }
          {brandPhoneNo ?
            <li>
              <a href={'tel:+' + brandPhoneNo} target='_blank' rel="noreferrer" style={{ fontSize: 'larger' }}><FaPhone />
                {'+' + brandPhoneNo}
              </a>
            </li> :
            ''
          }
        </div>
      </div>
      <div className='uk-flex uk-flex-right uk-width-expand uk-margin-small-left uk-margin-small-right' role='navigation'>
        <div className='uk-grid-divider uk-flex uk-flex-center uk-grid-small uk-margin-small' data-uk-grid>
          <div><div className='uk-grid-divider uk-grid-small' data-uk-grid>
            {brandYoutube ?
              <li>
                <a href={brandYoutube} target='_blank' rel="noreferrer" style={{ fontSize: 'larger' }}><FaYoutube /></a>
              </li> :
              ''
            }
            {brandTwitter ?
              <li>
                <a href={'https://twitter.com/' + brandTwitter} target='_blank' rel="noreferrer" style={{ fontSize: 'larger' }}><FaTwitter /></a>
              </li> :
              ''
            }
            {brandInstagram ?
              <li>
                <a href={'https://instagram.com/' + brandInstagram} target='_blank' rel="noreferrer" style={{ fontSize: 'larger' }}><FaInstagram /></a>
              </li> :
              ''
            }
            {brandFacebook ?
              <li>
                <a href={'https://facebook.com/' + brandFacebook} target='_blank' rel="noreferrer" style={{ fontSize: 'larger' }}><FaFacebook /></a>
              </li> :
              ''
            }
          </div></div>
          <Link to='#' className='uk-visible@m'
            style={{ fontSize: 'larger' }}
            onClick={fireInCartButton}>
            <FaShoppingBag />
            <span style={{ fontSize: '15px', verticalAlign: 'sub' }}>{cartCount}</span>
          </Link>
          {loggedIn ?
            <LoggedInNavigation />
            :
            <div className=''>
              <Link to="/sign-in" title='Sign In' style={{ fontSize: 'larger' }}>
                <span style={{ fontSize: '15px', marginRight: '5px' }}>Sign In</span>
                <FaSignInAlt />
              </Link>
            </div>
          }
        </div>
      </div>
    </nav>
  );
}

SocialMediaHandles.defaultProps = {
  brandEmail: 'hello@styleupeasy.com',
  brandPhoneNo: 2347062147858,
  brandWhatsapp: 2347062147858,
  brandYoutube: 'https://www.youtube.com/channel/UCG2EsNLXlbooFoCVSLr53Lw',
  brandFacebook: 'shopstyleupeasy',
  brandInstagram: 'shopstyleupeasy',
  brandTwitter: 'shopstyleupeasy'
}

SocialMediaHandles.propTypes = {
  brandEmail: PropTypes.string.isRequired,
  brandPhoneNo: PropTypes.number,
  brandWhatsapp: PropTypes.number,
}

export default SocialMediaHandles
