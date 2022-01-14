import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../system/Loading';
import ProductTeaserVariation from './ProductTeaserVariation';
import AddToCart from '../pages/products/AddToCart';
//import { config } from '../DrupalUrl';

//const siteUrl = config.url.SITE_URL;
const ProductTeaser = ({ productContent }) => {

  const productUuid = productContent.data.id;
  const [currentVariation, setCurrentVariation] = useState('');
  const [currentVariationProperties, setCurrentVariationProperties] = useState();

  //console.log(productContent);
  //console.log(currentVariationProperties)

  const [ageOptions, setAgeOptions] = useState();
  const [colourOptions, setColourOptions] = useState();
  const [sexOptions, setSexOptions] = useState();
  const [sizeOptions, setSizeOptions] = useState();
  const [variationListValues, setVariationListValues] = useState();

  useEffect(() => {
    //let isMounted = true;
    if (productContent.data.relationships && productContent.data.relationships.default_variation
      && !currentVariation) {
      setCurrentVariation(productContent.data.relationships.default_variation.data.id);
    }

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
        //console.log(variationList)
        setVariationListValues(variationList);
      }
    })

  }, [productContent, currentVariation])

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
    //console.log(e.target.value);
    //console.log(e.target.parentNode.childNodes[0].value);
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

  const importVariationProperties = (included) => {
    setCurrentVariationProperties(included);
  }
  // console.log(currentVariationProperties);
  // console.log(currentVariation);
  //console.log(productContent)
  return (
    <>
      {productContent && productContent.data ?
        <div>
          <div className='uk-position-relative uk-card uk-card-default'>
            {currentVariation ?
              <ProductTeaserVariation
                uuid={currentVariation}
                type={productContent.data.type.slice(9)}
                brand={productBrand}
                payments={productPaymentOptions}
                categories={productCategories}
                mainFeatures={ProductMainFeatures}
                quality={productQuality}
                variantProperties={importVariationProperties}
                productUrl={productContent.data.attributes.path.alias}
              />
              : ''}

            {productContent.data.attributes.title ?
              <h2 className={'uk-text-center uk-margin-remove'}>
                <Link to={productContent.data.attributes.path.alias}>
                  {productContent.data.attributes.title}
                </Link></h2>
              : ''}
            <div>
              <form>
                <div className='uk-grid-small uk-margin-small uk-flex uk-flex-center uk-flex-bottom' data-uk-grid>
                  {colourOptions && colourOptions.length > 0 ?
                    <span
                      id={'colour-attribute'}
                      style={{ position: 'absolute', right: '20px', top: '35px' }}
                    >
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
                <AddToCart
                  variation={currentVariation}
                  type={productContent.data.type.slice(9)}
                />
              </div>
            </div>
          </div>
        </div>
        :
        <Loading />}
    </>
  )
}


export default ProductTeaser;