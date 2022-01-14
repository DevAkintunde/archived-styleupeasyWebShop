import { Link } from 'react-router-dom';
import { useContext } from "react";
import { useLocation } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import uikitMin from 'uikit/dist/js/uikit.min';
import { FaLuggageCart, FaUserPlus } from 'react-icons/fa';
import { LoggedStatus } from '../App';

const MainNavigation = () => {
  const location = useLocation();
  const { loggedIn } = useContext(LoggedStatus);

  const closeDropdown = () => {
    const dropMenu = document.getElementById('mainNavDropdown');
    uikitMin.dropdown(dropMenu).hide(0);
  }

  return (
    <nav className={'uk-navbar-container uk-margin-top'} data-uk-navbar>
      <button href='/#' className={'uk-navbar-toggle uk-hidden@m'}
        data-uk-toggle={'target: #offcanvas-main-nav'}
        data-uk-navbar-toggle-icon><span className='uk-margin-small-left uk-visible@s'>Menu</span></button>
      <div id='offcanvas-main-nav'
        data-uk-offcanvas={'overlay: true; flip: true'}>
        <div className={'uk-offcanvas-bar uk-flex uk-flex-column'}>
          <button className={'uk-offcanvas-close'}
            data-uk-close></button>
          <ul
            className='uk-nav-center uk-margin-auto-vertical uk-nav-divider uk-nav-parent-icon'
            data-uk-nav>
            <li className={location.pathname === '/' ? 'uk-active' : ''}>
              <Link to='/'
                data-uk-toggle={'target: #offcanvas-main-nav; cls: uk-open'}
              >Home</Link>
            </li>

            <li className={'uk-parent' + (location.pathname === '/category/in-stock' ? ' uk-active' : '')}
            >
              <Link to='/category/in-stock'
                style={{ marginRight: '-24px' }}
              >In Stock</Link>
              <ul className='uk-nav-sub uk-nav-default'>
                <li className={location.pathname === '/new-arrivals' ? 'uk-active' : ''}>
                  <Link to='/new-arrivals'
                    data-uk-toggle={'target: #offcanvas-main-nav; cls: uk-open'}
                  >New Arrivals</Link>
                </li>
                <li className={location.pathname === '/trending' ? 'uk-active' : ''}>
                  <Link to='/trending'
                    data-uk-toggle={'target: #offcanvas-main-nav; cls: uk-open'}
                  >Trending</Link>
                </li>

                <li className={location.pathname === '/category/in-stock' ? 'uk-active' : ''}>
                  <Link to='/category/in-stock'
                    data-uk-toggle={'target: #offcanvas-main-nav; cls: uk-open'}
                  >In Stock</Link>
                </li>
                <li className={location.pathname === '/search' ? 'uk-active' : ''}>
                  <Link to='/search'
                    data-uk-toggle={'target: #offcanvas-main-nav; cls: uk-open'}
                  >Search</Link>
                </li>
              </ul>
            </li>
            <li className={location.pathname === '/track-an-order' ? 'uk-active' : ''}>
              <Link to='/track-an-order'
                data-uk-toggle={'target: #offcanvas-main-nav; cls: uk-open'}
              >Track Order</Link>
            </li>
            <li className={location.pathname === '/about' ? 'uk-active' : ''}>
              <Link to='/about'
                data-uk-toggle={'target: #offcanvas-main-nav; cls: uk-open'}
              >About</Link>
            </li>
            <li className={location.pathname === '/blog' ? 'uk-active' : ''}>
              <Link to='/blog'
                data-uk-toggle={'target: #offcanvas-main-nav; cls: uk-open'}
              >Blog</Link>
            </li>
            {!loggedIn ?
              <li className={location.pathname === '/sign-in/register' ? 'uk-active' : ''}>
                <Link to='/sign-in/register'
                  data-uk-toggle={'target: #offcanvas-main-nav; cls: uk-open'}
                ><FaUserPlus /><span>Sign Up</span></Link>
              </li>
              : ''}
            <li className={location.pathname === '/cart' ? 'uk-active' : ''}>
              <Link to='/cart'
                data-uk-toggle={'target: #offcanvas-main-nav; cls: uk-open'}
              ><FaLuggageCart /><span>Cart</span></Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={'uk-navbar-left uk-visible@m'}>
        <ul className='uk-navbar-nav'>
          <li className={location.pathname === '/' ? 'uk-active' : ''}>
            <Link to='/'>Home</Link>
          </li>

          <li className={location.pathname === '/category/in-stock' ? 'uk-active' : ''}
          >
            <Link to='#'>In Stock</Link>
            <div
              id='mainNavDropdown'
              className={'uk-navbar-dropdown'}
            >
              <ul className='uk-nav uk-navbar-dropdown-nav'>
                <li className={location.pathname === '/new-arrivals' ? 'uk-active' : ''}>
                  <Link to='/new-arrivals' onClick={closeDropdown}>New Arrivals</Link>
                </li>
                <li className={location.pathname === '/trending' ? 'uk-active' : ''}>
                  <Link to='/trending' onClick={closeDropdown}>Trending</Link>
                </li>

                <li className={location.pathname === '/category/in-stock' ? 'uk-active' : ''}>
                  <Link to='/category/in-stock' onClick={closeDropdown}>In Stock</Link>
                </li>
                <li className={location.pathname === '/search' ? 'uk-active' : ''}>
                  <Link to='/search' onClick={closeDropdown}>Search</Link>
                </li>
              </ul>
            </div>
          </li>
          <li className={location.pathname === '/track-an-order' ? 'uk-active' : ''}>
            <Link to='/track-an-order'>Track Order</Link>
          </li>
          <li className={location.pathname === '/about' ? 'uk-active' : ''}>
            <Link to='/about'>About</Link>
          </li>
          <li className={location.pathname === '/blog' ? 'uk-active' : ''}>
            <Link to='/blog'>Blog</Link>
          </li>
          {!loggedIn ?
            <li className={location.pathname === '/sign-in/register' ? 'uk-active' : ''}>
              <Link to='/sign-in/register'><FaUserPlus /><span>Sign Up</span></Link>
            </li>
            : ''}
          <li className={location.pathname === '/cart' ? 'uk-active' : ''}>
            <Link to='/cart'><FaLuggageCart /><span>Cart</span></Link>
          </li>
        </ul>
      </div>
      <div
        className={'uk-navbar-right'}>
        <div
          className={'uk-navbar-item'}
          style={{ minHeight: '50px' }}
        >
          <SearchForm />
        </div>
      </div>
    </nav>
  );
}

export default MainNavigation
