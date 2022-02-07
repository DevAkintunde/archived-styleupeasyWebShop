import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { config } from '../DrupalUrl';

const GoogleAnalytics = () => {
  const location = useLocation();
  const measurementID = config.analytics && config.analytics.google_measurement_id
    ? config.analytics.google_measurement_id : null;
  if (measurementID) {
    ReactGA.initialize(measurementID);
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
    // console.log(location.pathname);
  }
  return null
}
export default GoogleAnalytics
