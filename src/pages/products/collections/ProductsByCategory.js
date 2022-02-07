import { useState, useEffect } from 'react';
import { withRouter, useLocation } from 'react-router-dom';
import Loading from '../../../system/Loading';
import { config } from '../../../DrupalUrl';
import PageTitle from '../../../layout/PageTitle';
import Pager, { PagerFilter } from '../../../components/Pager';
import ProductTeaser from '../../../teasers/ProductTeaser';
import { JsonLd } from 'react-schemaorg';
import pluralize from 'pluralize/pluralize.js';

const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const ProductsByCategory = (props) => {
  //console.log(props)
  const location = useLocation();
  //console.log(location);
  const pageUrl = location.pathname;
  const basegroup = props.match.params.baseCategory;
  const categoryGroup = pageUrl.split('/' + basegroup + '/')[1];
  let productGroup = '';
  let itemGroup = '';
  let pageTitle = '';
  if (categoryGroup && categoryGroup.length > 0) {
    productGroup = categoryGroup.split('/')[0];
  }
  if (categoryGroup && categoryGroup.length > 1) {
    itemGroup = categoryGroup.split('/')[1];
  }

  let alias = '';
  let aliasSuffix = '';

  if (itemGroup && productGroup) {
    const makeTitle = itemGroup.split('-');
    pageTitle = makeTitle.join(' ');
    alias = 'products/' + productGroup;
    aliasSuffix = '?filter[term--category][condition][path]=field_category.name&filter[term--category][condition][operator]=IN&filter[term--category][condition][value]=' + itemGroup + '&filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&include=field_category,field_product_brand,field_quality,field_tags,variations';
  } else if (productGroup) {
    const makeTitle = productGroup.split('-');
    pageTitle = makeTitle.join(' ');
    alias = 'products/' + productGroup;
    aliasSuffix = '?filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&include=field_category,field_product_brand,field_quality,field_tags,variations';
  } else if (['fashion', 'beauty', 'clothing-material', 'style', 'makeover'].includes(basegroup)) {
    const makeTitle = basegroup.split('-');
    pageTitle = makeTitle.join(' ');
    alias = 'products';
    aliasSuffix = '?filter[term--category-ref][condition][path]=field_category_ref.parent.name&filter[term--category-ref][condition][operator]=IN&filter[term--category-ref][condition][value]=' + basegroup + '&filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&include=field_category,field_product_brand,field_quality,field_tags,variations';
  } else {
    pageTitle = 'In Stock';
    alias = 'products';
    aliasSuffix = '?filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&include=field_category,field_product_brand,field_quality,field_tags,variations';
  }
  //console.log(aliasSuffix)
  let attributeAddOn = '';

  if (
    ['exfoliant', 'jewellery', 'moisturizer', 'smart_wear'].includes(productGroup)) {
    attributeAddOn = attributeAddOn + ',variations.attribute_age'
  }
  if (
    ['accessory', 'bedding', 'clothing', 'curtain', 'floor', 'footwear', 'interior', 'jewellery', 'light', 'material', 'smart_wear'].includes(productGroup)) {
    attributeAddOn = attributeAddOn + ',variations.attribute_colour'
  }
  if (
    ['accessory', 'clothing', 'exfoliant', 'footwear', 'fragrance', 'jewellery', 'material', 'moisturizer', 'smart_wear'].includes(productGroup)) {
    attributeAddOn = attributeAddOn + ',variations.attribute_sex'
  }
  if (
    ['clothing', 'footwear'].includes(productGroup)) {
    attributeAddOn = attributeAddOn + ',variations.attribute_size'
  }
  const dataUrl = siteJsonUrl + alias + aliasSuffix + attributeAddOn;

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
          "@type": "ProductCollection",
          name: products && products.length ? pluralize(pageTitle, products.length) : 'Items in stock',
          description: 'Product collections in stock',
          url: siteUrl + pageUrl.substring('1'),
          category: basegroup ? basegroup : '' + productGroup ? ' ' + productGroup : '' + itemGroup ? ' ' + itemGroup : '',
          brand: 'Multiple brands available',
          keywords: pageTitle
        }}
      />
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: products && products.length ? pluralize(pageTitle, products.length) : 'Items in stock',
          description: 'Product collections in stock',
          url: siteUrl + pageUrl.substring('1'),
          author: 'StyleUpEasy',
          keywords: ['product', 'style', 'fashion', 'makeover', 'beauty']
        }}
      />
      <PageTitle title={products && products.length ? pluralize(pageTitle, products.length) : 'Loading Items'} className={'uk-text-capitalize'} />
      {products && products.length > 0 ?
        <>
          <PagerFilter />
          <div className={'uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@xl uk-flex uk-flex-center'}
            data-uk-grid={'masonry: true'}>
            {products.map((product) => {
              return (
                <ProductTeaser productContent={product} key={product.data.id} />
              )
            })}
          </div>
        </>
        :
        <Loading />}
      {dataUrl ?
        <Pager pageContents={importPageContent} url={dataUrl}
          reset={filterReset} authentication={false}
          pagination={6}
        />
        : ''}
    </>
  )
}

export default withRouter(ProductsByCategory);