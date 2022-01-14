import { useState, useEffect, useContext } from 'react';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import { LoggedStatus, LoggedUserName } from "../../App";
import ShippingTrack from '../../components/ShippingTrack';
//import { config } from '../../DrupalUrl';
import PageTitle from '../../layout/PageTitle';
import LoginForm from '../usersForm/LoginForm';
import DashboardOrders from './order/DashboardOrders';
import OrdersPage from './order/OrdersPage';
import PerOrder from './order/PerOrder';
import UserProfile from './UserProfile';

//const siteJsonUrl = config.url.SITE_JSON_URL;
const Dashboard = () => {
  const { loggedIn } = useContext(LoggedStatus);
  const { thisName } = useContext(LoggedUserName);

  const [step, setStep] = useState();

  useEffect(() => {
    if (loggedIn) {
      setStep('dashboard');
    }
  }, [loggedIn])

  const switchOnLogged = () => {
    setStep('dashboard');
  }

  switch (step) {
    default:
      return (
        <>
          <PageTitle title={'Sign In'} />
          <LoginForm destination={switchOnLogged} isFunction={true} />
        </>
      );
    case 'dashboard':
      return (
        loggedIn === true ?
          <>
            <Switch>
              <Route path='/signed-in' exact>
                <PageTitle title={'Wall'} />
                {thisName ?
                  <div className={'uk-padding uk-padding-remove-bottom'}>
                    Hello {thisName}... Howdy!
                  </div>
                  : ''}
                <div className={'uk-card-body uk-card-default uk-margin'}>
                  <ShippingTrack />
                </div>
                <DashboardOrders />
              </Route>

              <Route path='/signed-in/orders' exact>
                <OrdersPage />
              </Route>
              <Route path='/signed-in/orders/:order'>
                <PerOrder />
              </Route>
              <Route path='/signed-in/profile'>
                <UserProfile />
              </Route>
            </Switch>
          </>
          : setStep()
      );
  }
}

export default Dashboard