import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { config } from '../../DrupalUrl';

//const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const HomeFeaturedBlock = () => {
    const [variations, setVariations] = useState();

    const aliasSuffix = 'products?&filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&page[limit]=8&include=variations,variations.field_product_images';
    useEffect(() => {
        let isMounted = true;
        const getVariation = async () => {
            const response = await fetch(siteJsonUrl + aliasSuffix, {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-type': 'application/vnd.api+json'
                }
            })
            const outputData = await response.json();
            //console.log(outputData);

            if (outputData && outputData.data && outputData.included) {
                let variants = [];
                outputData.data.forEach((product) => {
                    const parentProductUrl = product.attributes.path.alias;
                    //product.relationships.variations.data.forEach((variationRef) => {
                    const variationRef = product.relationships.default_variation.data;
                    outputData.included.forEach((variation) => {
                        if (variation.type.includes('product-variation--')) {
                            if (variationRef.id === variation.id && variation.attributes.status && variation.attributes.status === true) {
                                if (variation.attributes.commerce_stock_always_in_stock === true
                                    || variation.attributes.field_stock_level.available_stock > 0) {
                                    let variationImagesUrl = [];
                                    const variationImages = variation.relationships.field_product_images.data;
                                    variationImages.forEach((image) => {
                                        outputData.included.forEach((fileImage) => {
                                            if (fileImage.type === 'file--file' && fileImage.id === image.id) {
                                                variationImagesUrl.push(fileImage.attributes.image_style_uri.squared_small);
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
                if (isMounted) {
                    setVariations(variants);
                }
            }
        }
        getVariation();

        return () => {
            isMounted = false;
        };
    }, [])
    //         < div className = {('uk-card') +
    //             (index === 0 || index === 4 ? ' uk-width-1-2 uk-width-1-3@s uk-width-1-2@m'
    //                 : index === 1 || index === 5 ? ' uk-width-1-2 uk-width-2-3@s uk-width-1-4@m'
    //                     : index === 6 ? ' uk-width-1-2 uk-width-1-3@s uk-width-1-4@m'
    //                         : index === 3 || index === 7 ? ' uk-width-1-2 uk-width-2-3@s uk-width-1-2@m'
    //                             : ' uk-width-1-1 uk-width-1-3@s uk-width-1-4@m')
    // }
    // key = { variation.id }
    //     >
    //console.log(variations)
    return (
        variations && variations.length > 0 ?
            <div className={'uk-padding uk-padding-remove-top uk-margin-large-top'}
                style={{ backgroundColor: '#dda384' }}>
                <header className={'uk-text-lead uk-heading-bullet uk-margin-medium-top'}
                    style={{ fontSize: '4.5vw', textAlign: 'center' }}
                >
                    Featured
                    <hr className={'uk-divider-small'} />
                </header>
                <div className='uk-position-relative'>
                    <div className=''
                        data-uk-grid={'masonry: true'}>
                        {variations.map((variation, index) => {
                            return (
                                <div className={'uk-card uk-width-1-1 uk-width-1-2@s uk-width-1-3@m uk-width-1-4@l'}
                                    key={variation.id}
                                >
                                    <div className='uk-card uk-card-default-light uk-padding-small uk-flex uk-flex-center'>
                                        <Link to={variation.parent_url}>
                                            <img src={variation.images[0]} alt={variation.data.attributes.title}
                                            />
                                        </Link>
                                        <div className='uk-position-bottom uk-text-center uk-overlay-default uk-margin-auto'>
                                            <h4 className='uk-text-bold'>
                                                {variation.data.attributes.price.formatted}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div >
            </div> :
            ''
    );
}
export default HomeFeaturedBlock
