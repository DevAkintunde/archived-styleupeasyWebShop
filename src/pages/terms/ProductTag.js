import { useState, useEffect } from 'react';
import { withRouter, useLocation } from 'react-router-dom';
import Loading from '../../system/Loading';
import { config } from '../../DrupalUrl';
import PageTitle from '../../layout/PageTitle';
import { JsonLd } from 'react-schemaorg';
import ProductTeaser from '../../teasers/ProductTeaser';
import Pager from '../../components/Pager';

const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const siteJsonEntityUrl = config.url.SITE_ENTITY_ROUTER_URL;
const Tag = (props) => {
  const [termContent, setTermContent] = useState();
  const location = useLocation();
  const [products, setProducts] = useState();
  const [pagerdata, setPagerData] = useState();

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      setPagerData();
    }
    return () => {
      isMount = false
    }
  }, [location.key])

  let alias = '/product-tags/' + props.match.params.alias;
  useEffect(() => {
    let isMounted = true;
    const getTermContent = async () => {
      const response = await fetch(siteJsonEntityUrl + alias, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json'
        }
      })
      const outputData = await response.json();
      if (isMounted) {
        setTermContent(outputData);
      }
    }
    getTermContent();
    return () => {
      isMounted = false;
    };
  }, [alias])
  //console.log(termContent);

  let fetcherUrlSuffix = '';
  if (termContent && termContent.data && termContent.data.id && termContent.data.type) {
    const termType = termContent.data.type
    //termType = termContent.data.type.slice(15)
    const fetcherFilterValue = termContent.data.id;
    const fetcherFilterLabel = 'field_tags.id';
    const fetcherSuffix = '&include=field_category,field_category_ref,field_payment_options,field_product_brand,field_quality,field_tags,variations';
    fetcherUrlSuffix = siteJsonUrl + 'products?filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&filter[' + termType + '][condition][path]=' + fetcherFilterLabel + '&filter[' + termType + '][condition][operator]=%3D&filter[' + termType + '][condition][value]=' + fetcherFilterValue + fetcherSuffix;
  }
  //console.log(fetcherUrlSuffix)

  useEffect(() => {
    let isMounted = true;

    if (isMounted && pagerdata && pagerdata.data && pagerdata.included) {
      let productsBatch = [];
      pagerdata.data.forEach((product) => {
        let thisProductIncluded = [];
        let uniqueAttrID = [];
        pagerdata.included.forEach((included) => {
          if (included.type === 'taxonomy_term--category') {
            if (product.relationships.field_category && product.relationships.field_category.data
              && product.relationships.field_category.data.length > 0) {
              product.relationships.field_category.data.forEach((category) => {
                if (category.id === included.id) {
                  thisProductIncluded.push(included);
                }
              })
            }
          }
          else if (included.type === 'taxonomy_term--product_brand') {
            if (product.relationships.field_product_brand && product.relationships.field_product_brand.data
              && product.relationships.field_product_brand.data.id) {
              if (product.relationships.field_product_brand.data.id === included.id) {
                thisProductIncluded.push(included);
              }
            }
          }
          else if (included.type === 'taxonomy_term--quality') {
            if (product.relationships.field_quality && product.relationships.field_quality.data
              && product.relationships.field_quality.data.id) {
              if (product.relationships.field_quality.data.id === included.id) {
                thisProductIncluded.push(included);
              }
            }
          }
          else if (included.type === 'taxonomy_term--product_tags') {
            if (product.relationships.field_tags && product.relationships.field_tags.data
              && product.relationships.field_tags.data.length > 0) {
              product.relationships.field_tags.data.forEach((tag) => {
                if (tag.id === included.id) {
                  thisProductIncluded.push(included);
                }
              })
            }
          }
          else if (included.type.includes('product-variation--')) {
            if (product.relationships.variations && product.relationships.variations.data
              && product.relationships.variations.data.length > 0) {

              product.relationships.variations.data.forEach((variation) => {
                if (variation.id === included.id) {
                  thisProductIncluded.push(included);
                  //console.log(included)
                  pagerdata.included.forEach((attribute) => {
                    if (attribute.type.includes('product-attribute-value--')) {
                      if (attribute.type.includes('product-attribute-value--age') && included.relationships.attribute_age
                        && included.relationships.attribute_age.data && included.relationships.attribute_age.data.id) {
                        if (included.relationships.attribute_age.data.id === attribute.id) {
                          if (uniqueAttrID.includes(attribute.id) === false) {
                            thisProductIncluded.push(attribute);
                            uniqueAttrID.push(attribute.id);
                          }
                        }
                      }
                      if (attribute.type.includes('product-attribute-value--colour') && included.relationships.attribute_colour
                        && included.relationships.attribute_colour.data && included.relationships.attribute_colour.data.id) {
                        if (included.relationships.attribute_colour.data.id === attribute.id) {
                          if (uniqueAttrID.includes(attribute.id) === false) {
                            thisProductIncluded.push(attribute);
                            uniqueAttrID.push(attribute.id);
                          }
                        }
                      }
                      if (attribute.type.includes('product-attribute-value--sex') && included.relationships.attribute_sex
                        && included.relationships.attribute_sex.data && included.relationships.attribute_sex.data.id) {
                        if (included.relationships.attribute_sex.data.id === attribute.id) {
                          if (uniqueAttrID.includes(attribute.id) === false) {
                            thisProductIncluded.push(attribute);
                            uniqueAttrID.push(attribute.id);
                          }
                        }
                      }
                      if (attribute.type.includes('product-attribute-value--size') && included.relationships.attribute_size
                        && included.relationships.attribute_size.data && included.relationships.attribute_size.data.id) {
                        if (included.relationships.attribute_size.data.id === attribute.id) {
                          if (uniqueAttrID.includes(attribute.id) === false) {
                            thisProductIncluded.push(attribute);
                            uniqueAttrID.push(attribute.id);
                          }
                        }
                      }
                    }
                  })
                }
              })
            }
          }
        })
        productsBatch.push({
          'data': product,
          'included': thisProductIncluded
        })
      })
      setProducts(productsBatch);
    } else {
      setProducts();
    }

    return () => {
      isMounted = false;
    };
  }, [pagerdata])

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

  //console.log(products);
  //console.log(pagerdata);

  return (
    <>
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: termContent && termContent.data ? termContent.data.attributes.name : 'Tag',
          //image: 'product image',
          description: termContent && termContent.data ? termContent.data.attributes.description : 'Tag description',
          url: siteUrl + alias,
          author: 'StyleUpEasy',
          keywords: ['product', 'style', 'fashion', 'makeover', 'beauty', termContent && termContent.data ? termContent.data.attributes.name : 'Tag']
        }}
      />
      {termContent && fetcherUrlSuffix ?
        <>
          <PageTitle title={termContent.data.attributes.name + ' Items'} />
          {products && products.length > 0 ?
            <div className={'uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@xl uk-flex uk-flex-center'}
              data-uk-grid={'masonry: true'}>
              {products.map((product) => {
                return (
                  <ProductTeaser productContent={product} key={product.data.id} />
                )
              })}
            </div>
            :
            <Loading />}
          <Pager pageContents={importPageContent} url={fetcherUrlSuffix}
            reset={filterReset} authentication={false}
            pagination={6}
          />
        </>
        :
        <Loading />}
    </>
  )
}
export default withRouter(Tag);