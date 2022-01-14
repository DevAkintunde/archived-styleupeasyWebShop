import { JsonLd } from 'react-schemaorg';
import { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Loading from '../../system/Loading';
import { config } from '../../DrupalUrl';
import PageTitle from '../../layout/PageTitle';
import ProductVariation from './ProductVariation';
import AddToCart from './AddToCart';
import { FaTag } from 'react-icons/fa';

const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const siteJsonEntityUrl = config.url.SITE_ENTITY_ROUTER_URL;
const ProductItem = (props) => {
  //console.log(props);
  //console.log(props.match.url);
  //console.log(props.location.pathname);
  const product = props.match.params.product;
  const aliasExt = props.match.url.substring(1);
  let attributeAddOn = '';

  if (
    ['exfoliant', 'jewellery', 'moisturizer', 'smart_wear'].includes(product)) {
    attributeAddOn = attributeAddOn + ',variations.attribute_age'
  }
  if (
    ['accessory', 'bedding', 'clothing', 'curtain', 'floor', 'footwear', 'interior', 'jewellery', 'light', 'material', 'smart_wear'].includes(product)) {
    attributeAddOn = attributeAddOn + ',variations.attribute_colour'
  }
  if (
    ['accessory', 'clothing', 'exfoliant', 'footwear', 'fragrance', 'jewellery', 'material', 'moisturizer', 'smart_wear'].includes(product)) {
    attributeAddOn = attributeAddOn + ',variations.attribute_sex'
  }
  if (
    ['clothing', 'footwear'].includes(product)) {
    attributeAddOn = attributeAddOn + ',variations.attribute_size'
  }

  const thisComExtraSuffix = '?filter[status][value]=1&include=field_category,field_category_ref,field_payment_options,field_product_brand,field_quality,field_tags,variations' + attributeAddOn;

  const [productUuid, setProductUuid] = useState();
  const [currentVariation, setCurrentVariation] = useState('');
  const [currentVariationProperties, setCurrentVariationProperties] = useState();
  const [productContent, setProductContent] = useState({});
  const [loadingMessage, setLoadingMessage] = useState();

  const [seoImageUrl, setSeoImageUrl] = useState();
  const [seoBrand, setSeoBrand] = useState();
  const [seocategory, setSeoCategory] = useState();
  const [seoQuality, setSeoQuality] = useState();

  useEffect(() => {
    let isMounted = true;
    if (props.location.pathname !== props.match.url) {
      const extendVariantProduct = props.location.pathname.split(props.match.url);
      const uuidFromUrl = extendVariantProduct[1].substring(1);
      if (uuidFromUrl.length === 36 && isMounted) {
        setCurrentVariation(uuidFromUrl);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [props])

  useEffect(() => {
    let isMounted = true;
    const getProductUuid = async () => {
      const response = await fetch(siteJsonEntityUrl + aliasExt, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
        }
      })
      const outputData = await response.json();
      if (isMounted) {
        if (response.status === 404) {
          setLoadingMessage("The page you're looking for cannot be found");
        } else {
          setProductUuid(outputData.data.id);
        }
      }
    }
    getProductUuid();

    return () => {
      isMounted = false;
    };
  }, [aliasExt])

  useEffect(() => {
    let isMounted = true;
    const getProductContent = async () => {
      const response = await fetch(siteJsonUrl + 'products/' + product + '/' + productUuid + thisComExtraSuffix, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
        }
      })
      const outputData = await response.json();
      if (isMounted) {
        if (response.status === 404) {
          setLoadingMessage("The page you're looking for cannot be found");
        } else {
          if (outputData.data) {
            if (outputData.data.relationships.default_variation && !currentVariation) {
              setCurrentVariation(outputData.data.relationships.default_variation.data.id);
            }
            setProductContent(outputData);
          }
        }
      }
    }
    if (productUuid) {
      getProductContent();
    }
    return () => {
      isMounted = false;
    };
  }, [productUuid, currentVariation, product, thisComExtraSuffix])

  // console.log(productContent);
  // console.log(currentVariationProperties)

  const [ageOptions, setAgeOptions] = useState();
  const [colourOptions, setColourOptions] = useState();
  const [sexOptions, setSexOptions] = useState();
  const [sizeOptions, setSizeOptions] = useState();
  const [variationListValues, setVariationListValues] = useState();

  useEffect(() => {
    let isMounted = true;
    productContent.data && productContent.included &&
      productContent.included.forEach((included) => {
        if (included.type === 'taxonomy_term--product_brand' && isMounted) {
          setSeoBrand(included.attributes.name);
        } else if (included.type === 'taxonomy_term--category' && isMounted) {
          setSeoCategory(previous => previous ? (previous + ',' + included.attributes.name) : included.attributes.name);
        } else if (included.type === 'taxonomy_term--quality' && isMounted) {
          setSeoQuality(included.attributes.name);
        }
      });

    let variationList = [];
    productContent.data && productContent.included.forEach((variation) => {
      if (variation.type.includes('product-variation--')) {
        const thisUuid = variation.id;
        let attributeCombo = [];

        if (variation.relationships.attribute_ + '*') {
          if (variation.relationships.attribute_age &&
            variation.relationships.attribute_age.data) {
            const attributeProperties = {
              'attrId': variation.relationships.attribute_age.data.id,
              'varId': thisUuid,
            }
            productContent.data && productContent.included.forEach((attribute) => {
              if (attribute.type.includes('product-attribute-value--age')) {
                if (attribute.id === attributeProperties.attrId) {
                  attributeCombo.push('age|' + attribute.attributes.name);
                }
              }
            })
          }

          if (variation.relationships.attribute_colour &&
            variation.relationships.attribute_colour.data) {
            const attributeProperties = {
              'attrId': variation.relationships.attribute_colour.data.id,
              'varId': thisUuid,
            }
            productContent.data && productContent.included.forEach((attribute) => {
              if (attribute.type.includes('product-attribute-value--colour')) {
                if (attribute.id === attributeProperties.attrId) {
                  attributeCombo.push('colour|' + attribute.attributes.name + '='
                    + attribute.attributes.field_colour.color + '&' + attribute.attributes.field_colour.opacity);
                }
              }
            })
          }

          if (variation.relationships.attribute_sex &&
            variation.relationships.attribute_sex.data) {
            const attributeProperties = {
              'attrId': variation.relationships.attribute_sex.data.id,
              'varId': thisUuid,
            }
            productContent.data && productContent.included.forEach((attribute) => {
              if (attribute.type.includes('product-attribute-value--sex')) {
                if (attribute.id === attributeProperties.attrId) {
                  attributeCombo.push('sex|' + attribute.attributes.name);
                }
              }
            })
          }

          if (variation.relationships.attribute_size &&
            variation.relationships.attribute_size.data) {
            const attributeProperties = {
              'attrId': variation.relationships.attribute_size.data.id,
              'varId': thisUuid,
            }
            productContent.data && productContent.included.forEach((attribute) => {
              if (attribute.type.includes('product-attribute-value--size')) {
                if (attribute.id === attributeProperties.attrId) {
                  attributeCombo.push('size|' + attribute.attributes.name);
                }
              }
            })
          }
        }

        attributeCombo.sort((a, b) => a > b ? 1 : -1)
        let staticAttributeCombo = '-';
        for (let index = 0; index < attributeCombo.length; index++) {
          staticAttributeCombo = staticAttributeCombo + attributeCombo[index] + '-';
        }
        variationList.push({
          [staticAttributeCombo]: thisUuid
        });
        setVariationListValues(variationList);
      }
    })
  }, [productContent])

  useEffect(() => {
    let isMounted = true;
    if (!seoImageUrl && currentVariationProperties && currentVariationProperties.included) {
      currentVariationProperties.included.forEach((included) => {
        if (included.type === 'file--file' && isMounted) {
          setSeoImageUrl(included.attributes.image_style_uri.thumbnail);
        }
      });
    }
    return () => {
      isMounted = false;
    }
  }, [seoImageUrl, currentVariationProperties])

  useEffect(() => {
    let isMounted = true;
    setAgeOptions('');
    setColourOptions('');
    setSexOptions('');
    setSizeOptions('');
    let attributeCombo = [];
    let attributeTypes = [];
    //console.log(currentVariationProperties);
    currentVariationProperties && currentVariationProperties.included
      && currentVariationProperties.included.forEach((attribute) => {
        if (attribute.type.includes('product-attribute-value--')) {
          const attributeType = attribute.type.split('--')[1];
          const attributelabel = attribute.attributes.name;
          attributeTypes.push(attributeType);
          if (attributeType === 'colour') {
            attributeCombo.push(attributeType + '|' + attributelabel + '='
              + attribute.attributes.field_colour.color + '&' + attribute.attributes.field_colour.opacity);
          } else {
            attributeCombo.push(attributeType + '|' + attributelabel);
          }
        }
      })
    attributeCombo.sort((a, b) => a > b ? 1 : -1);
    let defaultAttributes = '-';
    for (let index = 0; index < attributeCombo.length; index++) {
      defaultAttributes = defaultAttributes + attributeCombo[index] + '-';
    }

    let ages = { 'defaultValue': '', 'options': [] };
    let colours = [];
    let sexes = { 'defaultValue': '', 'options': [] };
    let sizes = { 'defaultValue': '', 'options': [] };
    if (defaultAttributes !== '-' || defaultAttributes === undefined) {
      attributeTypes.forEach((attributeType) => {

        variationListValues.forEach((variant) => {
          const thisVariantAttributes = JSON.stringify(variant).split('":"')[0].substring(2);
          const thisAttributeUuid = JSON.stringify(variant).split('":"')[1].substring(0, 36);
          const thisDefaultAttributeValue = defaultAttributes.split(attributeType + '|')[1].split('-')[0];

          if (thisVariantAttributes.includes('-' + attributeType + '|')
            && thisVariantAttributes === defaultAttributes) {
            let optionList = '';
            if (attributeType !== 'colour') {
              optionList =
                <option
                  value={thisDefaultAttributeValue}
                  key={thisAttributeUuid}
                //selected='selected'
                >
                  {thisDefaultAttributeValue}
                </option>
            }
            else {
              const colourColorExplode = thisDefaultAttributeValue.split('=');
              const colourColorLabel = colourColorExplode[0];
              const colourColorCode = colourColorExplode[1].split('&')[0];
              const colourColorOpacity = (colourColorExplode[1].split('&')[1]);
              optionList =
                <label
                  className='form-type-radio'
                  key={thisAttributeUuid}
                  title={colourColorLabel}
                  id={'active-attribute-label'}
                >
                  <input
                    type='radio'
                    name={productUuid}
                    value={colourColorLabel}
                    className='form-radio uk-radio'
                    style={{ display: 'none' }}
                  />
                  <span>
                    <div id={colourColorCode + '&' + colourColorOpacity}>
                      <div
                        style={{ backgroundColor: colourColorCode, opacity: colourColorOpacity !== null ? colourColorOpacity : '' }}
                        className='attribute-color-swatch'
                        id={'active-attribute-colour'}
                      ></div>
                    </div>
                  </span>
                </label>
            }
            if (attributeType === 'age') {
              ages.options.push(optionList);
              ages.defaultValue = thisDefaultAttributeValue;
            } else if (attributeType === 'colour') {
              colours.push(optionList);
            } else if (attributeType === 'sex') {
              sexes.options.push(optionList);
              sexes.defaultValue = thisDefaultAttributeValue;
            } else if (attributeType === 'size') {
              sizes.options.push(optionList);
              sizes.defaultValue = thisDefaultAttributeValue;
            }
          } else if (thisVariantAttributes.includes('-' + attributeType + '|') && thisVariantAttributes !== defaultAttributes) {
            const thisLoopedAttributeValue = thisVariantAttributes.split(attributeType + '|')[1].split('-')[0];
            if (thisLoopedAttributeValue !== thisDefaultAttributeValue) {
              let optionList = '';
              const disintegrateDefaultAttr = defaultAttributes.split('-');
              let validAttrs = [];
              disintegrateDefaultAttr.forEach((validAttr) => {
                if (!validAttr.includes(attributeType) && validAttr !== '') {
                  validAttrs.push(validAttr);
                }
              })
              const stringifiedVariant = JSON.stringify(variant);
              const allDoesEXist = validAttrs.every(validAttr =>
                stringifiedVariant.includes(validAttr));

              if (allDoesEXist === true) {

                if (attributeType !== 'colour') {
                  optionList =
                    <option
                      value={thisLoopedAttributeValue}
                      key={thisAttributeUuid}>
                      {thisLoopedAttributeValue}
                    </option>
                } else {
                  const colourColorExplode = thisLoopedAttributeValue.split('=');
                  const colourColorLabel = colourColorExplode[0];
                  const colourColorCode = colourColorExplode[1].split('&')[0];
                  const colourColorOpacity = (colourColorExplode[1].split('&')[1]);
                  optionList =
                    <label
                      className='form-type-radio'
                      key={thisAttributeUuid}
                      title={colourColorLabel}
                    //id={'active-attribute-label'}
                    >
                      <input
                        type='radio'
                        name={productUuid}
                        value={colourColorLabel}
                        className='form-radio uk-radio'
                        style={{ display: 'none' }}
                      />
                      <span>
                        <div id={colourColorCode + '&' + colourColorOpacity}>
                          <div
                            style={{ backgroundColor: colourColorCode, opacity: colourColorOpacity !== null ? colourColorOpacity : '' }}
                            className='attribute-color-swatch'
                          //id={'active-attribute-colour'}
                          ></div>
                        </div>
                      </span>
                    </label>
                }
              }

              if (attributeType === 'age') {
                ages.options.push(optionList);
              } else if (attributeType === 'colour') {
                colours.push(optionList);
              } else if (attributeType === 'sex') {
                sexes.options.push(optionList);
              } else if (attributeType === 'size') {
                sizes.options.push(optionList);
              }
            };
          }
        })
      })
      if (isMounted) {
        if (ages.options.length > 0) {
          setAgeOptions(ages);
        }
        if (colours.length > 0) {
          setColourOptions(colours);
        }
        if (sexes.options.length > 0) {
          setSexOptions(sexes);
        }
        if (sizes.options.length > 0) {
          setSizeOptions(sizes);
        }
      }
    }

    return () => {
      isMounted = false;
    };
  }, [currentVariationProperties, productUuid, variationListValues])

  const [updatedAttributed, setUpdatedAttributed] = useState();
  useEffect(() => {
    let isMounted = true;
    //console.log(updatedAttributed);
    if (updatedAttributed) {
      const splittedAttributed = updatedAttributed.split('-');
      let attributes = [];
      splittedAttributed.forEach((attributed) => {
        if (attributed.includes('age|')) {
          attributes.push(attributed);
        } else if (attributed.includes('colour|')) {
          attributes.push(attributed);
        } else if (attributed.includes('sex|')) {
          attributes.push(attributed);
        } else if (attributed.includes('size|')) {
          attributes.push(attributed);
        }
      })

      let bestVariantMatch = '';
      let bestVariantCount = 0;
      variationListValues.forEach((variant) => {
        const thisVariant = JSON.stringify(variant);

        if (!thisVariant.includes(currentVariation)) {
          let variantCount = 0;
          attributes.forEach((attribute) => {
            if (thisVariant.includes(attribute)) {
              variantCount++;
            }
          })
          if (variantCount > bestVariantCount) {
            const variantId = thisVariant.split('":"')[1].substring(0, 36);
            bestVariantMatch = variantId;
            bestVariantCount = variantCount;
            setUpdatedAttributed();
          }
        }
      })

      if (bestVariantMatch && isMounted) {
        setCurrentVariation(bestVariantMatch);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [updatedAttributed, currentVariation, variationListValues])

  var productBrand = '';
  var productPaymentOptions = [];
  var productCategories = [];
  var productTags = [];
  var ProductMainFeatures = [];
  var productQuality = '';

  productContent.data && productContent.included.forEach((brandTag) => {
    if (brandTag.type.includes('taxonomy_term--product_brand')) {
      productBrand = brandTag.attributes.name;
    }
  })
  productContent.data && productContent.included.forEach((paymentTag) => {
    if (paymentTag.type.includes('taxonomy_term--payment_options')) {
      productPaymentOptions.push(paymentTag.attributes.name);
    }
  })
  productContent.data && productContent.included.forEach((categoryTag) => {
    if (categoryTag.type.includes('taxonomy_term--category')) {
      productCategories.push({
        'name': categoryTag.attributes.name,
        'term_depth': categoryTag.attributes.depth_level
      });
    }
  })
  productContent.data && productContent.included.forEach((productTag) => {
    if (productTag.type.includes('taxonomy_term--product_tags')) {
      productTags.push({
        'name': productTag.attributes.name,
        'url': productTag.attributes.path ? productTag.attributes.path.alias : ''
      });
    }
  })
  productContent.data && productContent.data.attributes.field_features_highlight.forEach((productMainFeature) => {
    ProductMainFeatures.push(productMainFeature);
  })
  productContent.data && productContent.included.forEach((quality) => {
    if (quality.type.includes('taxonomy_term--quality')) {
      productQuality = quality.attributes.name;
    }
  })

  const ageChange = (e) => {
    //console.log(e.target)
    const otherAttributes = e.target.parentNode.parentNode.children;
    const allAttributeElements = e.target.parentNode.parentNode.children;

    var thisDisplayAttributes = [];
    var staticDisplayAttributes = '-';
    for (let i = 0; i < allAttributeElements.length; i++) {
      if (allAttributeElements[i].id === 'colour-attribute') {
        const colourAttributeElement = allAttributeElements[i].children[0].children[0].children;
        //console.log(colourAttributeElement)
        for (let j = 0; j < colourAttributeElement.length; j++) {
          if (colourAttributeElement[j].id === 'active-attribute-label') {
            thisDisplayAttributes.push(colourAttributeElement[j].title);
          }

        }
      }
    }
    for (let i = 0; i < otherAttributes.length; i++) {
      const eachAttribute = otherAttributes[i].children[0];
      if (eachAttribute.value !== undefined) {
        const thisAttribute = eachAttribute.id.split('-')[0];
        thisDisplayAttributes.push(thisAttribute + '|' + eachAttribute.value);
      }
    }
    thisDisplayAttributes.sort((a, b) => a > b ? 1 : -1);
    let staticLoop = 0;
    for (let index = 0; index < thisDisplayAttributes.length; index++) {
      staticDisplayAttributes = staticDisplayAttributes + thisDisplayAttributes[index] + '-';
      staticLoop++;
      if (staticLoop === thisDisplayAttributes.length) {
        setUpdatedAttributed(staticDisplayAttributes);
      }
    }
  }
  const colourChange = (e) => {
    //console.log(e.target)
    const colourAttribute = e.target.value;
    const otherAttributes = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.children;
    var thisDisplayAttributes = [];
    var staticDisplayAttributes = '-';

    const fetchColourLabels = e.target.parentNode.parentNode.children;
    for (let g = 0; g < fetchColourLabels.length; g++) {
      fetchColourLabels[g].id = '';
      fetchColourLabels[g].children[1].children[0].children[0].id = '';
    }
    const setToggledToActive = e.target.parentNode.children;
    setToggledToActive[1].children[0].children[0].id = 'active-attribute-colour';
    e.target.parentNode.id = 'active-attribute-label';

    const colourProperty = e.target.parentNode.children[1].children[0].id;
    thisDisplayAttributes.push('colour|' + colourAttribute + '=' + colourProperty);

    for (let i = 0; i < otherAttributes.length; i++) {
      const eachAttribute = otherAttributes[i].children[0];
      if (eachAttribute.value !== undefined) {
        const thisAttribute = eachAttribute.id.split('-')[0];
        thisDisplayAttributes.push(thisAttribute + '|' + eachAttribute.value);
      }
    }
    thisDisplayAttributes.sort((a, b) => a > b ? 1 : -1);
    let staticLoop = 0;
    for (let index = 0; index < thisDisplayAttributes.length; index++) {
      staticDisplayAttributes = staticDisplayAttributes + thisDisplayAttributes[index] + '-';
      staticLoop++;
      if (staticLoop === thisDisplayAttributes.length) {
        setUpdatedAttributed(staticDisplayAttributes);
      }
    }

  }
  const sexChange = (e) => {
    //console.log(e.target)
    const otherAttributes = e.target.parentNode.parentNode.children;
    const allAttributeElements = e.target.parentNode.parentNode.children;
    var thisDisplayAttributes = [];
    var staticDisplayAttributes = '-';

    for (let i = 0; i < allAttributeElements.length; i++) {
      if (allAttributeElements[i].id === 'colour-attribute') {
        const colourAttributeElement = allAttributeElements[i].children[0].children[0].children;

        for (let j = 0; j < colourAttributeElement.length; j++) {
          if (colourAttributeElement[j].id === 'active-attribute-label') {
            thisDisplayAttributes.push(colourAttributeElement[j].title);
          }

        }
      }
    }
    for (let i = 0; i < otherAttributes.length; i++) {
      const eachAttribute = otherAttributes[i].children[0];
      if (eachAttribute.value !== undefined) {
        const thisAttribute = eachAttribute.id.split('-')[0];
        thisDisplayAttributes.push(thisAttribute + '|' + eachAttribute.value);
      }
    }
    thisDisplayAttributes.sort((a, b) => a > b ? 1 : -1)
    let staticLoop = 0;
    for (let index = 0; index < thisDisplayAttributes.length; index++) {
      staticDisplayAttributes = staticDisplayAttributes + thisDisplayAttributes[index] + '-';
      staticLoop++;
      if (staticLoop === thisDisplayAttributes.length) {
        setUpdatedAttributed(staticDisplayAttributes);
      }
    }
  }
  const sizeChange = (e) => {
    // console.log(e.target.value);
    // console.log(e.target.parentNode.childNodes[0]);
    // console.log(e.target.parentNode.childNodes[0].value);
    // console.log(document.getElementById('size-attribute').value);
    //document.getElementById('size-attribute').value = e.target.value;
    //e.target.parentNode.childNodes[0].value = e.target.value;
    const otherAttributes = e.target.parentNode.parentNode.children;
    const allAttributeElements = e.target.parentNode.parentNode.children;
    var thisDisplayAttributes = [];
    var staticDisplayAttributes = '-';

    for (let i = 0; i < allAttributeElements.length; i++) {
      if (allAttributeElements[i].id === 'colour-attribute') {
        const colourAttributeElement = allAttributeElements[i].children[0].children[0].children;
        for (let j = 0; j < colourAttributeElement.length; j++) {
          if (colourAttributeElement[j].id === 'active-attribute-label') {
            thisDisplayAttributes.push('colour|' + colourAttributeElement[j].title);
          }

        }
      }
    }
    //console.log(otherAttributes)
    for (let i = 0; i < otherAttributes.length; i++) {
      const eachAttribute = otherAttributes[i].children[0];
      if (eachAttribute.value !== undefined) {
        const thisAttribute = eachAttribute.id.split('-')[0];
        thisDisplayAttributes.push(thisAttribute + '|' + eachAttribute.value);
      }
    }
    thisDisplayAttributes.sort((a, b) => a > b ? 1 : -1);
    let staticLoop = 0;
    for (let index = 0; index < thisDisplayAttributes.length; index++) {
      staticDisplayAttributes = staticDisplayAttributes + thisDisplayAttributes[index] + '-';
      staticLoop++;
      if (staticLoop === thisDisplayAttributes.length) {
        setUpdatedAttributed(staticDisplayAttributes);
      }
    }
  }

  const filtersVisibility = (e) => {
    //console.log(e.target.parentNode.parentNode.childNodes[0]);
    const filterForm = e.target.parentNode.parentNode.parentNode.childNodes[0];
    if (filterForm.classList.contains('uk-hidden')) {
      filterForm.classList.remove('uk-hidden');
      e.target.value = '˅';
    } else {
      filterForm.classList.add('uk-hidden');
      e.target.value = '^';
    }
  }

  const importVariationProperties = (included) => {
    setCurrentVariationProperties(included);
  }
  //console.log(productContent);
  return (
    <>
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "IndividualProduct",
          name: productContent && productContent.data ? productContent.data.attributes.title : 'Product listing',
          image: seoImageUrl ? seoImageUrl : 'product image',
          description: productContent && productContent.data ? productContent.data.attributes.body.summary : 'Product on sale',
          url: siteUrl + aliasExt,
          category: seocategory,
          brand: seoBrand,
          itemCondition: seoQuality === 'New' ? 'NewCondition' : 'UsedCondition',
        }}
      />
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: 'Shop product',
          image: seoImageUrl ? seoImageUrl : 'product image',
          description: productContent && productContent.data ? productContent.data.attributes.body.summary : 'Product on sale',
          url: siteUrl + aliasExt,
          author: 'StyleUpEasy',
          keywords: ['product', 'style', 'fashion', 'makeover', 'beauty', seoBrand, seocategory]
        }}
      />
      {productContent && productContent.data ?
        <>
          <PageTitle title={productContent.data.attributes.title} />

          <article className='product-page uk-position-relative'>
            <ProductVariation
              uuid={currentVariation}
              type={productContent.data.type.slice(9)}
              brand={productBrand}
              payments={productPaymentOptions}
              categories={productCategories}
              mainFeatures={ProductMainFeatures}
              quality={productQuality}
              variantProperties={importVariationProperties}
              qrCodeUrl={siteUrl + aliasExt + '/' + currentVariation}
            />

            <div className='uk-card uk-card-body'>
              <div className='uk-text-center'
                style={{ fontSize: '30px' }}>
                More detail
              </div>
              <div dangerouslySetInnerHTML={{ __html: productContent.data.attributes.body.processed }}>
              </div>
            </div>

            <div className='uk-flex uk-flex-center'>
              <FaTag className={'uk-margin-right'} />
              {productTags.map((tag, index) => {
                return (
                  <span key={index}
                    className={'uk-margin-right'}
                  ><Link to={tag.url}>
                      {tag.name}
                    </Link> </span>
                )
              })}
            </div>

            <hr className='uk-divider-icon' />
            <div className='uk-text-center'>
              {productContent.data.attributes.field_youtube
                && productContent.data.attributes.field_youtube.video_id ?
                <iframe src={'https://www.youtube.com/embed/' + productContent.data.attributes.field_youtube.video_id}
                  style={{ minWidth: '450px', minHeight: '315px' }}
                  frameBorder='0' allowFullScreen data-uk-responsive
                  title={productContent.data.attributes.title}
                  data-uk-video={'autoplay: inview'}>
                </iframe>
                : ''}
              <div hidden>Extra Product Fields</div>
            </div>

            <div className='uk-margin-top'
              style={{ position: 'sticky', bottom: '7px', zIndex: '1' }}
            >
              <form className='uk-position-relative'>
                <div className='uk-grid-small uk-margin-small uk-flex uk-flex-center uk-flex-bottom' data-uk-grid>
                  {colourOptions && colourOptions.length > 0 ?
                    <span
                      id={'colour-attribute'}>
                      <fieldset
                        required={'required'}
                        className='product-colour-attribute'
                        onChange={colourChange}
                      >
                        <div className='fieldset-wrapper uk-flex uk-flex-bottom'>
                          {colourOptions}
                        </div>
                      </fieldset>
                    </span>
                    : ''
                  }
                  {ageOptions && ageOptions.options.length > 0 ?
                    <span>
                      <select id={'age-attribute'}
                        style={{
                          padding: '2px', cursor: 'pointer',
                          border: '1px solid #612e35', borderRadius: '10px'
                        }}
                        value={ageOptions.defaultValue}
                        onChange={ageChange}>
                        {ageOptions.options}
                      </select>
                    </span>
                    : ''
                  }
                  {sexOptions && sexOptions.options.length > 0 ?
                    <span>
                      <select id={'sex-attribute'}
                        style={{
                          padding: '2px', cursor: 'pointer',
                          border: '1px solid #612e35', borderRadius: '10px'
                        }}
                        value={sexOptions.defaultValue}
                        onChange={sexChange}>
                        {sexOptions.options}
                      </select>
                    </span>
                    : ''
                  }
                  {sizeOptions && sizeOptions.options.length > 0 ?
                    <span>
                      <select id={'size-attribute'}
                        style={{
                          padding: '2px', cursor: 'pointer',
                          border: '1px solid #612e35', borderRadius: '10px'
                        }}
                        value={sizeOptions.defaultValue}
                        onChange={sizeChange}>
                        {sizeOptions.options}
                      </select>
                    </span>
                    : ''
                  }
                </div>
              </form>

              <div className={'uk-flex uk-flex-center'} data-uk-grid>
                <div className='uk-visible@s'
                  style={{ marginLeft: '-78px' }}
                ><input
                    type='button'
                    value={'˅'}
                    onClick={filtersVisibility}
                    className={'uk-button uk-margin-right'}
                    style={{
                      borderRadius: '25px', padding: '0 10px', width: '28px'
                    }}
                  /></div>
                <AddToCart
                  variation={currentVariation}
                  type={productContent.data.type.slice(9)}
                />
              </div>
            </div>
          </article>
        </>
        :
        <Loading message={loadingMessage ? loadingMessage : ''} />}
    </>
  )
}
export default withRouter(ProductItem);