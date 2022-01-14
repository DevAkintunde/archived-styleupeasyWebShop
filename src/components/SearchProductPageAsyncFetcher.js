import { useState, useEffect } from "react";
import { config } from "../DrupalUrl";
import Loading from "../system/Loading";
import ProductTeaser from "../teasers/ProductTeaser";

//const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const SearchProductPageAsyncFetcher = ({ product }) => {
  const productType = product.type.substring(9);
  //console.log(product);
  let attributeAddOn = '';
  if (
    ['exfoliant', 'jewellery', 'moisturizer', 'smart_wear'].includes(productType)) {
    attributeAddOn = attributeAddOn + ',variations.attribute_age'
  }
  if (
    ['accessory', 'bedding', 'clothing', 'curtain', 'floor', 'footwear', 'interior', 'jewellery', 'light', 'material', 'smart_wear'].includes(productType)) {
    attributeAddOn = attributeAddOn + ',variations.attribute_colour'
  }
  if (
    ['accessory', 'clothing', 'exfoliant', 'footwear', 'fragrance', 'jewellery', 'material', 'moisturizer', 'smart_wear'].includes(productType)) {
    attributeAddOn = attributeAddOn + ',variations.attribute_sex'
  }
  if (
    ['clothing', 'footwear'].includes(productType)) {
    attributeAddOn = attributeAddOn + ',variations.attribute_size'
  }

  const thisComExtraSuffix = '?filter[status][value]=1&include=field_category,field_category_ref,field_payment_options,field_product_brand,field_quality,field_tags,variations' + attributeAddOn;
  const [productContent, setProductContent] = useState();

  useEffect(() => {
    let isMounted = true;
    const getProductData = async () => {
      const response = await fetch(siteJsonUrl + 'products/' + productType + '/' + product.id + thisComExtraSuffix, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
        }
      })
      const outputData = await response.json();
      //console.log(outputData);
      if (isMounted && outputData.data) {
        setProductContent(outputData);
      }
    }
    if (product.id) {
      getProductData();
    }

    return () => {
      isMounted = false;
    }
  }, [product.id, productType, thisComExtraSuffix])

  //console.log(productContent);

  return (
    productContent && productContent.data ?
      <ProductTeaser productContent={productContent} key={productContent.data.id} />
      :
      <Loading />
  )
}

export default SearchProductPageAsyncFetcher