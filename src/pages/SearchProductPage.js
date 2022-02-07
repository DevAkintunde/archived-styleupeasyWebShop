import { withRouter, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import { config } from '../DrupalUrl';
import SearchProductPageAsyncFetcher from '../components/SearchProductPageAsyncFetcher';
import { JsonLd } from 'react-schemaorg';
import Pager from '../components/Pager';
import PageTitle from '../layout/PageTitle';
import { FaSearch } from 'react-icons/fa';
import Loading from '../system/Loading';

const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const SearchProductPage = () => {
  const location = useLocation();
  const [searchPath, setSearchPath] = useState();
  const [searchWord, setSearchWord] = useState('');
  const [submitSearch, setSubmitSearch] = useState();
  const [pagerData, setPagerData] = useState();
  let thisSearchPath = siteJsonUrl + 'index/products?filter[fulltext]=' + encodeURI(searchWord.trim());

  useEffect(() => {
    if (location && location.search) {
      setSearchWord(location.search.split('?')[1]);
      setSearchPath(siteJsonUrl + 'index/products?filter[fulltext]=' + encodeURI(location.search.split('?')[1].trim()));
      const locationRedirectInput = document.querySelector('#searchPageInput');
      if (locationRedirectInput) {
        locationRedirectInput.value = location.search.split('?')[1];
      }
    }
  }, [location, location.key]);

  const [thisSearchPathRenderer, setThisSearchPathRenderer] = useState();
  useEffect(() => {
    if (submitSearch && thisSearchPathRenderer !== thisSearchPath) {
      setPagerData();
      setSubmitSearch();
      setSearchPath(thisSearchPath);
      setThisSearchPathRenderer(thisSearchPath);
    }
  }, [submitSearch, thisSearchPath, thisSearchPathRenderer]);

  const clearNavSearchBoxText = document.querySelectorAll('#searchNavBox input');
  if (clearNavSearchBoxText && clearNavSearchBoxText.length > 0) {
    clearNavSearchBoxText.forEach((input) => {
      input.value = '';
    })
  }

  const importPageContent = (pageContent) => {
    if (pageContent && pageContent.current) {
      setPagerData(pageContent.current);
    } else {
      setPagerData();
    }
  }
  const filterReset = () => {
    setPagerData();
  }
  const submitNewSearch = (e) => {
    e.preventDefault();
    setSubmitSearch(Date.now());
  }

  return (
    <>
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "ProductCollection",
          name: 'Product search',
          description: 'Search through our product collections in stock',
          url: siteUrl + 'search',
          category: '',
          brand: 'Multiple brands available',
          keywords: 'search'
        }}
      />
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: '',
          description: 'Product collections in stock',
          url: siteUrl + 'search',
          author: 'StyleUpEasy',
          keywords: ['product', 'style', 'fashion', 'makeover', 'beauty']
        }}
      />
      <PageTitle title={pagerData ? 'Search Results' : 'Search'} />
      <form onSubmit={submitNewSearch}
        className='uk-width-1-1 uk-grid-collapse uk-padding uk-flex uk-flex-center'
        style={{ maxWidth: '600px', margin: 'auto' }}
        data-uk-grid>
        <input
          className={'uk-input uk-width-expand'}
          style={{ paddingLeft: '10px' }}
          type="text"
          id='searchPageInput'
          placeholder='Search'
          onChange={(e) => { setSearchWord(e.target.value) }}
        />
        <button
          type='submit'
          className={'uk-button'}
          style={{ padding: '0 20px', backgroundColor: '#612e35', color: '#fff' }}
        ><FaSearch /></button>
      </form>

      {searchPath ?
        pagerData && pagerData.data && pagerData.data.length > 0 ?
          <div className={'uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@xl uk-flex uk-flex-center'}
            data-uk-grid={'masonry: true'}>
            {pagerData.data.map((product) => {
              return (
                <SearchProductPageAsyncFetcher product={product} key={product.id} />
              )
            })}
          </div>
          : <div className='uk-padding'>
            <Loading message={'Oops! Seems your search word cannot be found on any of our item'} />
          </div>
        :
        <div className='uk-padding'>
          <div className={'uk-card uk-card-body uk-card-default uk-margin uk-text-lead uk-text-center'}
          >
            Enter a search word to browse our collection here!
          </div>
        </div>
      }
      {searchPath ?
        <Pager pageContents={importPageContent} url={searchPath}
          reset={filterReset} authentication={false}
          pagination={12}
        />
        : ''}
    </>
  )
}

export default withRouter(SearchProductPage)