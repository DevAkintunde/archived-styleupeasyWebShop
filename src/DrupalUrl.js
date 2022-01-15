//control dev and production variables
//Alias Filter.... for JSon api fetch should be as constructed below, relative to the base path; using 'Entity Router' module as Drupal Json api does not support fetch by alias at the moment.
//'entity/router?path=<PATH>&format=<FORMAT>' or 
//'entity/router?format=<FORMAT>&path=<PATH>'

const siteUri = '/';
const appDeployedUri = 'https://styleupeasy.com/';
const siteServerUri = 'https://shop.styleupeasy.com/';
const siteLocalUri = 'https://localhost/styleupeasy/';


const prod = {
  url: {
    HOME_INDEX: siteUri,
    APP_URL: appDeployedUri,
    SITE_URL: siteServerUri,
    SITE_JSON_URL: siteServerUri + 'jsonapi/',
    SITE_ENTITY_ROUTER_URL: siteServerUri + 'entity/router?format=jsonapi&path=/',
  },
  payment: {
    paystack: 'pk_live_723787f248647b8a37edb402b947dcd5427a1a1c',
    coinbase: '',
  }
  /***
  oauth: {
    oauth2Id: authorisationClientId,
    oauth2Secret: authorisationClientSecret,
  }**/
}
const dev = {
  url: {
    HOME_INDEX: siteUri,
    APP_URL: siteLocalUri,
    SITE_URL: siteLocalUri,
    SITE_JSON_URL: siteLocalUri + 'jsonapi/',
    SITE_ENTITY_ROUTER_URL: siteLocalUri + 'entity/router?format=jsonapi&path=/',
  },
  payment: {
    paystack: 'pk_test_a6ee68924b40af13e2e7973fc46eda04cb40049a',
    coinbase: '',
  }
}

export const config = process.env.NODE_ENV === 'development' ?
  dev
  :
  prod