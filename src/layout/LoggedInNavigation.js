import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { FaBlog, FaFolderPlus, FaIgloo, FaReceipt, FaSignOutAlt, FaStoreAlt, FaTruck, FaUserAstronaut, FaUserCircle } from 'react-icons/fa';
import { JwtToken } from '../App';
import uikitMin from 'uikit/dist/js/uikit.min';
//import { config } from '../DrupalUrl';

//const siteUrl = config.url.SITE_URL;
const LoggedInNavigation = () => {
  const location = useLocation();
  const { setJwtTokenBearer } = useContext(JwtToken);

  const closeNavigator = () => {
    const navigatorMenu = document.getElementById('loggedInNavigator');
    uikitMin.dropdown(navigatorMenu).hide(0);
  }
  const signOutUser = () => {
    localStorage.removeItem('signOnToken');
    setJwtTokenBearer();
    closeNavigator();
  }

  return (
    <>
      <div>
        <FaUserCircle
          style={{
            _float: 'right', cursor: 'pointer',
            fontSize: '30px', color: '#310b0b',
            display: 'block', minHeight: '30px'
          }}
        />
        <div id='loggedInNavigator'
          data-uk-dropdown='mode:click; pos:bottom-right'>
          <ul
            className={'uk-nav-divider uk-nav-parent-icon'}
            style={{
              _padding: '5px', cursor: 'pointer',
              _border: '2px solid #dda384',
              _clear: 'both'
            }}
            data-uk-nav>
            <li className={location.pathname === '/signed-in' ? 'uk-active' : ''}>
              <Link to='/signed-in' onClick={closeNavigator}>
                <FaIgloo /> Wall
              </Link>
            </li>
            <li className={'uk-parent'} >
              <Link to='#'>
                <FaStoreAlt /> Orders
              </Link>
              <ul className={'uk-nav-sub'} >
                <li className={location.pathname === '/track-an-order' ? 'uk-active' : ''}>
                  <Link to='/track-an-order' onClick={closeNavigator}>
                    <FaTruck />Track an Order
                  </Link>
                </li>
                <li className={location.pathname === '/signed-in/orders' ? 'uk-active' : ''}>
                  <Link to='/signed-in/orders' onClick={closeNavigator}>
                    <FaReceipt /> My Orders
                  </Link>
                </li>
              </ul>
            </li>
            <li className={location.pathname === '/new-arrivals' ? 'uk-active' : ''}>
              <Link to='/new-arrivals' onClick={closeNavigator}>
                <FaFolderPlus /> New Additions
              </Link>
            </li>
            <li className={location.pathname === '/blog' ? 'uk-active' : ''}>
              <Link to='/blog' onClick={closeNavigator}>
                <FaBlog /> Our Blog
              </Link>
            </li>
            <li className={location.pathname === '/signed-in/profile' ? 'uk-active' : ''}>
              <Link to='/signed-in/profile' onClick={closeNavigator}>
                <FaUserAstronaut /> Profile
              </Link>
            </li>
            <li>
              <Link to='/'
                onClick={signOutUser} >
                <FaSignOutAlt /> Sign Out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default LoggedInNavigation
