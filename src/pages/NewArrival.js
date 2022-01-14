import { config } from '../DrupalUrl';
import { useState, useEffect } from 'react';
import Loading from "../system/Loading";
import PageTitle from '../layout/PageTitle';
import Pager from '../components/Pager';
import ProductVariationTeaser from '../teasers/ProductVariationTeaser';
import { JsonLd } from 'react-schemaorg';

const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const NewArrival = () => {

  const [variations, setVariations] = useState();
  const [pagerdata, setPagerData] = useState();
  const alias = 'products?&filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&page[limit]=3&include=default_variation,default_variation.field_product_images';
  const fetchUrl = siteJsonUrl + alias;
  //console.log(pagerdata)
  useEffect(() => {
    let isMounted = true;

    if (isMounted && pagerdata && pagerdata.data && pagerdata.included) {
      let variants = [];
      pagerdata.data.forEach((product) => {
        const parentProductUrl = product.attributes.path.alias;
        //product.relationships.pagerdata.data.forEach((variationRef) => {
        const variationRef = product.relationships.default_variation.data;
        pagerdata.included.forEach((variation) => {
          if (variation.type.includes('product-variation--')) {
            if (variationRef.id === variation.id
              //&& variation.attributes.status && variation.attributes.status === true
            ) {
              if (variation.attributes.commerce_stock_always_in_stock === true
                || variation.attributes.field_stock_level.available_stock > 0) {
                let variationImagesUrl = [];
                const variationImages = variation.relationships.field_product_images.data;
                variationImages.forEach((image) => {
                  pagerdata.included.forEach((fileImage) => {
                    if (fileImage.type === 'file--file' && fileImage.id === image.id) {
                      variationImagesUrl.push(fileImage.attributes.image_style_uri.squared_mobile);
                    }
                  })
                })

                const variationProps = {
                  'images': variationImagesUrl,
                  //'url': variationUrl,
                  //'price': variation.attributes.price.formatted,
                  //'title': variation.attributes.title,
                  'parent_url': parentProductUrl,
                  'id': variation.id,
                  'data': variation,
                };
                variants.push(variationProps);
              }
            }
          }
        })
        //})
      })
      setVariations(variants);
    } else { setVariations(); }

    return () => {
      isMounted = false;
    };
  }, [pagerdata])

  const importPageContent = (pageContent) => {
    if (pageContent && pageContent.current) {
      setPagerData(pageContent.current);
    } else {
      setPagerData('');
    }
  }
  const filterReset = () => {
    setPagerData();
  }

  //console.log(pagerdata)
  //console.log(variations)

  return (
    <>
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "ProductCollection",
          name: 'New Arrivals',
          description: 'New Arrivals in stock',
          url: siteUrl + 'new-arrivals',
          category: 'New Arrivals',
          brand: 'Multiple brands available',
          keywords: 'New Arrivals'
        }}
      />
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: 'New Arrivals',
          description: 'New Arrivals in stock',
          url: siteUrl + 'new-arrivals',
          author: 'StyleUpEasy',
          keywords: ['product', 'style', 'fashion', 'makeover', 'beauty']
        }}
      />
      <PageTitle title={'New Arrivals'} />
      <div className={'uk-margin'}>
        {variations && variations.length > 0 ?
          <div
            className={'uk-flex uk-flex-center uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@m'}
            data-uk-grid='masonry: true'
          >
            {variations.map((entity) => {
              return (
                <div key={entity.data.id}>
                  <ProductVariationTeaser entity={entity} />
                </div>
              )
            })}
          </div> : <Loading />}
      </div>
      {fetchUrl ?
        <Pager pageContents={importPageContent} url={fetchUrl}
          reset={filterReset} authentication={false}
        />
        : ''}
    </>
  )
}

export default NewArrival