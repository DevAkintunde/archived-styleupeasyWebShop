import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaYoutube, FaInstagram, FaTwitter, FaWhatsapp, FaFacebook, FaCreditCard, FaRss, FaQuestion, FaAddressBook, FaInfo } from 'react-icons/fa';

const Footer = ({ brandEmail, brandWhatsapp,
  brandPhoneNo, brandYoutube,
  brandInstagram, brandFacebook, brandTwitter
}) => {

  return (
    <footer className={'uk-background-secondary uk-padding'}
      style={{ paddingBottom: '10px' }}>
      <nav className='uk-grid-small uk-flex uk-flex-center uk-margin-bottom'
        data-uk-grid>
        <li>
          <Link to={'/how-to-pay'}
            style={{ color: '#fff' }}
          ><FaCreditCard style={{ marginRight: '2px' }} />
            How to Pay</Link>
        </li>
        <li>
          <Link to={'/blog'}
            style={{ color: '#fff' }}
          ><FaRss style={{ marginRight: '2px' }} />
            Blog</Link>
        </li>
        <li>
          <Link to={'/faq'}
            style={{ color: '#fff' }}
          ><FaQuestion style={{ marginRight: '2px' }} />
            Faq & Help</Link>
        </li>
        <li>
          <Link to={'/contact'}
            style={{ color: '#fff' }}
          ><FaAddressBook style={{ marginRight: '2px' }} />
            Contact</Link>
        </li>
        <li>
          <Link to={'/about'}
            style={{ color: '#fff' }}
          ><FaInfo style={{ marginRight: '2px' }} />
            About</Link>
        </li>
      </nav>

      <nav className='uk-margin-small uk-flex uk-flex-center'
        data-uk-grid>
        <div role='navigation'>
          <div className='uk-grid-divider uk-grid-small uk-margin-small' data-uk-grid>

            {brandEmail ?
              <li>
                <a href={'mailto: ' + brandEmail} target='_blank' rel="noreferrer"
                  style={{ fontSize: 'larger', color: '#fff' }}
                  data-uk-tooltip={'title: Send us an Email; pos: top'}
                ><FaEnvelope /></a>
              </li> :
              ''
            }
            {brandWhatsapp ?
              <li>
                <a href={'https://wa.me/' + brandWhatsapp} target='_blank' rel="noreferrer"
                  style={{ fontSize: 'larger', color: '#fff' }}
                  data-uk-tooltip={'title: Drop a Whatsapp message; pos: top'}
                ><FaWhatsapp /></a>
              </li> :
              ''
            }
            {brandYoutube ?
              <li>
                <a href={brandYoutube} target='_blank' rel="noreferrer"
                  style={{ fontSize: 'larger', color: '#fff' }}
                  data-uk-tooltip={'title: Subscribe to our YouTube channel; pos: top'}
                ><FaYoutube /></a>
              </li> :
              ''
            }
            {brandTwitter ?
              <li>
                <a href={'https://twitter.com/' + brandTwitter} target='_blank' rel="noreferrer"
                  style={{ fontSize: 'larger', color: '#fff' }}
                  data-uk-tooltip={'title: Follow on Twitter; pos: top'}
                ><FaTwitter /></a>
              </li> :
              ''
            }
            {brandInstagram ?
              <li>
                <a href={'https://instagram.com/' + brandInstagram} target='_blank' rel="noreferrer"
                  style={{ fontSize: 'larger', color: '#fff' }}
                  data-uk-tooltip={'title: Follow on Instagram; pos: top'}
                ><FaInstagram /></a>
              </li> :
              ''
            }
            {brandFacebook ?
              <li>
                <a href={'https://facebook.com/' + brandFacebook} target='_blank' rel="noreferrer"
                  style={{ fontSize: 'larger', color: '#fff' }}
                  data-uk-tooltip={'title: Like us on Facebook; pos: top'}
                ><FaFacebook /></a>
              </li> :
              ''
            }
          </div>
        </div>
      </nav>
      {brandPhoneNo ?
        <div className={'uk-text-center'}>
          <a href={'tel:+' + brandPhoneNo} target='_blank' rel="noreferrer"
            style={{ fontSize: 'larger', color: '#fff' }}><FaPhone className={'uk-margin-small-right'} />
            {'+' + brandPhoneNo}
          </a>
        </div> :
        ''
      }
      <div className={'uk-text-center uk-text-muted uk-margin'}>
        Powered by <a href={'https://instagram.com/studiomellywood'} target={'_blank'} rel='noreferrer' className={'uk-text-muted'}>Mellywood Media</a> © {new Date(Date.now()).getFullYear() === 2021 ? '' : '2021 - '}{new Date(Date.now()).getFullYear()}
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  brandEmail: 'hello@styleupeasy.com',
  brandPhoneNo: 2347062147858,
  brandWhatsapp: 2347062147858,
  brandYoutube: 'https://www.youtube.com/channel/UCG2EsNLXlbooFoCVSLr53Lw',
  brandFacebook: 'shopstyleupeasy',
  brandInstagram: 'shopstyleupeasy',
  brandTwitter: 'shopstyleupeasy'
}

Footer.propTypes = {
  brandEmail: PropTypes.string.isRequired,
  brandPhoneNo: PropTypes.number,
  brandWhatsapp: PropTypes.number,
}

export default Footer
