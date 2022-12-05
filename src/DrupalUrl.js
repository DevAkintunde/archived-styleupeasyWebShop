//control dev and production variables
//Alias Filter.... for JSon api fetch should be as constructed below, relative to the base path; using 'Entity Router' module as Drupal Json api does not support fetch by alias at the moment.
//'entity/router?path=<PATH>&format=<FORMAT>' or 
//'entity/router?format=<FORMAT>&path=<PATH>'

const siteUri = '/'
const siteWebUri = 'https://shop.styleupeasy.com/'
const siteLocalUri = 'https://localhost/styleupeasy/'


const prod = {
  url: {
    HOME_INDEX: siteUri,
    SITE_URL: siteWebUri,
    SITE_JSON_URL: siteWebUri + 'jsonapi/',
    SITE_ENTITY_ROUTER_URL: siteWebUri + 'entity/router?format=jsonapi&path=/',
  },
  payment: {
    paystack: 'pk_live_',
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
    SITE_URL: siteLocalUri,
    SITE_JSON_URL: siteLocalUri + 'jsonapi/',
    SITE_ENTITY_ROUTER_URL: siteLocalUri + 'entity/router?format=jsonapi&path=/',
  },
  payment: {
    paystack: 'pk_test_',
    coinbase: '',
  }
}

export const config = process.env.NODE_ENV === 'development' ?
  dev
  :
  prod
