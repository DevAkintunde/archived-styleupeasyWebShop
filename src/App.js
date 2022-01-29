import { useState, useEffect, useMemo, createContext } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './layout/Header';
import PageWrapper from './layout/PageWrapper';
import SideBar from './layout/SideBar';
import { config } from './DrupalUrl';
import CartModal from './pages/products/CartModal';
import Footer from './layout/Footer';
import { JsonLd } from 'react-schemaorg';
import siteLogoImage from './images/logo.png';

export const JwtToken = createContext({
  jwtTokenBearer: '',
  setJwtTokenBearer: () => { },
})
export const LoggedStatus = createContext({
  loggedIn: '',
  setLoggedIn: () => { },
})
export const LoggedUID = createContext({
  Uid: '',
  setUid: () => { },
})
export const LoggedUserName = createContext({
  thisName: '',
  setThisName: () => { },
})
export const InCartCountTrigger = createContext({
  cartCountTrigger: '',
  setCartCountTrigger: () => { },
})

const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const App = () => {
  const location = useLocation();

  let pageLoaded = document.getElementById('page-wrapper');
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.key, pageLoaded]);
  // console.log(pageLoaded);
  // console.log(location.key);

  const [jwtTokenBearer, setJwtTokenBearer] = useState(localStorage.getItem('signOnToken'));
  const token = useMemo(() => (
    { jwtTokenBearer, setJwtTokenBearer }
  ), [jwtTokenBearer]);

  const [loggedIn, setLoggedIn] = useState(false);
  const loggedInStatus = useMemo(() => (
    { loggedIn, setLoggedIn }
  ), [loggedIn]);

  const [Uid, setUid] = useState();
  const loggedUserId = useMemo(() => (
    { Uid, setUid }
  ), [Uid]);

  const [thisName, setThisName] = useState();
  const userName = useMemo(() => (
    { thisName, setThisName }
  ), [thisName]);

  const [cartCountTrigger, setCartCountTrigger] = useState('default');
  const trigger = useMemo(() => (
    { cartCountTrigger, setCartCountTrigger }
  ), [cartCountTrigger]);

  useEffect(() => {
    const loggedInProfile = async () => {
      const response = await fetch(siteJsonUrl + 'user/user/' + Uid, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
          'Authorization': 'Bearer ' + jwtTokenBearer,
        }
      })
      const outputData = await response.json();
      // console.log(response);
      // console.log(outputData);
      if (outputData && outputData.data
        && outputData.data.attributes.display_name) {
        setThisName(outputData.data.attributes.display_name);
      }
    }
    if (Uid) {
      loggedInProfile();
    }
  }, [Uid, jwtTokenBearer, loggedIn])

  useEffect(() => {
    const getUserUUId = async () => {
      const response = await fetch(siteJsonUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
          'Authorization': 'Bearer ' + jwtTokenBearer,
        }
      })
      const outputData = await response.json();
      // console.log(response);
      // console.log(outputData);
      if (!Uid && outputData && outputData.meta && outputData.meta.links.me
        && outputData.meta.links.me.meta.id
        && Uid !== outputData.meta.links.me.meta.id) {
        setUid(outputData.meta.links.me.meta.id);
      }
    }
    if (loggedIn) {
      getUserUUId();
    }
  }, [Uid, setUid, loggedIn, jwtTokenBearer])
  // console.log(Uid);
  // console.log(jwtTokenBearer);
  useEffect(() => {
    const checkLoggedInStatus = async () => {
      const response = await fetch(siteUrl + 'user/login_status?_format=json', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Bearer ' + jwtTokenBearer,
        }
      })
      const outputData = await response.json()
      // console.log(response)
      // console.log(outputData)
      if (outputData !== 1) {
        setJwtTokenBearer();
        setLoggedIn(false);
        setUid();
      } else if (loggedIn === false) {
        setLoggedIn(true);
      }
    }
    checkLoggedInStatus();
  }, [jwtTokenBearer, loggedIn])

  const [cartCount, setCartCount] = useState(0);

  let headerAuthorization = 'Bearer ' + jwtTokenBearer
  if (!jwtTokenBearer || !loggedIn) {
    headerAuthorization = '';
  }

  const [cartToken, setCartToken] = useState(localStorage.getItem('cartToken'));
  const [cartModalItems, setCartModalItems] = useState();

  useEffect(() => {
    if (!loggedIn && !cartToken) {
      localStorage.setItem('cartToken', Math.random().toString(36).substr(2));
      setCartToken(localStorage.getItem('cartToken'));
    }
  }, [loggedIn, cartToken])

  useEffect(() => {
    const getCarts = async () => {
      let response = '';
      if (headerAuthorization) {
        response = await fetch(siteJsonUrl + 'carts?include=order_items.purchased_entity.field_product_images,order_items.purchased_entity.product_id', {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.api+json',
            'Content-type': 'application/vnd.api+json',
            'Authorization': headerAuthorization
          }
        });
      } else {
        response = await fetch(siteJsonUrl + 'carts?include=order_items.purchased_entity.field_product_images,order_items.purchased_entity.product_id', {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.api+json',
            'Content-type': 'application/vnd.api+json',
            'Commerce-Cart-Token': cartToken
          }
        });
      }
      const outputData = await response.json();
      // console.log(outputData);

      let quantity = 0;
      if (outputData && outputData.data && outputData.data[0]) {
        let items = [];
        const order = outputData.data[0];
        outputData && outputData.included && outputData.included.forEach((orderItem) => {
          if (orderItem.type.includes('order-item--')) {
            quantity = quantity + (orderItem.attributes.quantity * 1)
            if (order.id === orderItem.relationships.order_id.data.id) {
              let itemOrderProps = '';
              outputData && outputData.included.forEach((itemPurchased) => {
                if (itemPurchased.type.includes('product-variation')) {
                  if (itemPurchased.id === orderItem.relationships.purchased_entity.data.id) {

                    let itemImageFile = '';
                    let productUrl = '';
                    outputData && outputData.included.forEach((itemImage) => {
                      if (itemImage.type.includes('file--file')) {
                        if (itemImage.id === itemPurchased.relationships.field_product_images.data[0].id) {
                          itemImageFile = itemImage.attributes.image_style_uri.thumbnail;

                        }
                      } else if (itemImage.type.includes('product--')) {
                        if (itemImage.id === itemPurchased.relationships.product_id.data.id) {
                          productUrl = itemImage.attributes.path.alias + '/' + itemPurchased.id;
                        }
                      }
                    });
                    const itemProps = {
                      'purchased': itemPurchased,
                      'image': itemImageFile,
                      'product_url': productUrl
                    }
                    itemOrderProps = itemProps;
                  }
                }
              })
              const thisOrderProps = {
                item: orderItem,
                itemProps: itemOrderProps
              };
              items.unshift(thisOrderProps);
            }
          }
        })
        // if (!cartCount) {
        setCartCount(quantity);
        // }
        const thisOrderCarts = {
          order: order,
          items: items
        };
        setCartModalItems(thisOrderCarts);
      } else {
        setCartCount(quantity);
      }
    }
    if (cartCountTrigger) {
      getCarts();
    }
  }, [cartToken, headerAuthorization, cartCountTrigger])

  return (
    <>
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: 'Style Up Easy',
          image: siteLogoImage,
          description: 'Online shopping eCommerce website for fashion items and styles, and for home/office makeovers',
          url: 'https://styleupeasy.com',
          author: 'StyleUpEasy',
          keywords: ['product', 'style', 'fashion', 'makeover', 'beauty']
        }}
      />
      <JwtToken.Provider value={token}>
        <LoggedStatus.Provider value={loggedInStatus}>
          <LoggedUID.Provider value={loggedUserId}>
            <LoggedUserName.Provider value={userName}>
              <InCartCountTrigger.Provider value={trigger}>
                <div id='page-wrapper'
                  className='container uk-position-relative uk-margin-auto'
                  style={{ maxWidth: '1200px' }}
                >
                  <Header cartCount={cartCount} />
                  <section className={'uk-margin-medium-top uk-margin-medium-bottom'}
                    data-uk-grid>
                    <SideBar />
                    <PageWrapper />
                  </section>
                  <Footer />

                  <CartModal
                    cartModalItems={cartModalItems}
                    headerAuthorization={headerAuthorization}
                    cartToken={cartToken}
                    cartCount={cartCount}
                  />
                </div>
              </InCartCountTrigger.Provider>
            </LoggedUserName.Provider>
          </LoggedUID.Provider>
        </LoggedStatus.Provider>
      </JwtToken.Provider>
    </>
  )
}


export default App
