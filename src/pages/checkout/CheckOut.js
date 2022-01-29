import { useState, useEffect, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { config } from '../../DrupalUrl';
import { JwtToken, LoggedStatus } from "../../App";
import toast, { Toaster } from 'react-hot-toast';
//import validator from "validator";
import Loading from '../../system/Loading';
import PageTitle from '../../layout/PageTitle';
import CheckOutProcessor from './CheckOutProcessor';

const siteJsonUrl = config.url.SITE_JSON_URL;
const CheckOut = (props) => {
  const { jwtTokenBearer } = useContext(JwtToken);
  const { loggedIn } = useContext(LoggedStatus);
  const [orderContent, setOrderContent] = useState({});

  const cartToken = localStorage.getItem('cartToken')
  let headerAuthorization = 'Bearer ' + jwtTokenBearer;
  if (!jwtTokenBearer) {
    headerAuthorization = '';
  }
  // let getPageTitleById = document.getElementById('pageTitle');

  // useEffect(() => {
  //   if (getPageTitleById) {
  //     setTimeout(() => {
  //       getPageTitleById.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'start',
  //         inline: 'start'
  //       });
  //     }, 1000);

  //   };
  // }, [getPageTitleById]);

  const order = props.match.params.order;
  const alias = 'checkout/' + order;
  useEffect(() => {
    let isMounted = true;
    if (cartToken || loggedIn) {
      const getOrderContent = async () => {
        const response = await fetch(siteJsonUrl + alias, {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.api+json',
            'Content-type': 'application/vnd.api+json',
            'Commerce-Cart-Token': cartToken,
            'Authorization': headerAuthorization,
          },
        })
        const outputData = await response.json();
        if (response.status === 404) {
          if (response.statusText === 'Not Found') {
            toast('Oops! Seems your cart is empty');
          }
        }
        if (outputData && isMounted) {
          setOrderContent(outputData);
        }
        // console.log(response);
        // console.log(outputData);
      }
      getOrderContent();
    }

    return () => {
      isMounted = false;
    };
  }, [alias, headerAuthorization, loggedIn, cartToken])

  // console.log(orderContent);
  return (
    <>
      <PageTitle title={'Check out'} />
      <Toaster />
      {
        orderContent && orderContent.data ?
          <section id='checkoutPage'
            style={{ paddingTop: '40px' }}>
            <CheckOutProcessor order={order} />
          </section>
          :
          <>
            <Loading message={
              <>
                <div className='uk-text-center'>Oops! Can't seem to find anything in your cart.</div>
                <div className='uk-text-center uk-margin'>
                  <Link to='/sign-in?destination=/cart'>
                    <button className='uk-button uk-button-primary uk-margin-large-top'>Sign In</button>
                  </Link>
                  <div className='uk-margin-small'> ...to check your saved Cart.</div>
                </div>
              </>
            } />
          </>
      }
    </>
  )
}
export default withRouter(CheckOut);