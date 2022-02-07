import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { config } from '../../DrupalUrl';

//const siteUrl = config.url.SITE_URL
const siteJsonUrl = config.url.SITE_JSON_URL

const HomeNewArrivalBlock = () => {
    const [variations, setVariations] = useState();

    const aliasSuffix = 'products?&filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&page[limit]=3&include=variations,variations.field_product_images';
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
            const outputData = await response.json()
            //console.log(outputData)

            if (isMounted && outputData && outputData.data && outputData.included) {
                let variants = []
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
                                                variationImagesUrl.push(fileImage.attributes.image_style_uri.medium);
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
            }
        }
        getVariation();

        return () => {
            isMounted = false;
        };
    }, [])

    //console.log(variations)
    return (
        variations && variations.length > 0 ?
            <>
                <header className={'uk-text-lead uk-heading-bullet'}
                    style={{ fontSize: '4.5vw', textAlign: 'center' }}
                >
                    New Arrivals
                    <hr className={'uk-divider-small'} />
                </header>
                <div className='uk-position-relative' data-uk-slider='center: true; autoplay: true'>
                    <ul className='uk-slider-items uk-child-width-1-1 uk-child-width-1-3@m uk-grid-small uk-grid-match'>
                        {variations.map((variation) => {
                            return (
                                <div key={variation.id}>
                                    <div className='uk-card uk-card-default uk-padding-small uk-padding-remove-vertical uk-flex uk-flex-center'>
                                        <Link to={variation.parent_url}>
                                            {<img src={variation.images[0]} alt={variation.data.attributes.title}
                                                style={{
                                                    minHeight: '150px', maxHeight: '250px', height: '100%', objectFit: 'cover'
                                                }}
                                            />}
                                        </Link>
                                        <div className='uk-position-bottom uk-text-center uk-overlay-default uk-margin-auto'>
                                            <h4 className='uk-margin-remove uk-text-bold'>
                                                <div className='uk-text-truncate uk-text-light'>
                                                    {variation.data.attributes.title.split(' - ')[0]}
                                                </div>
                                                {variation.data.attributes.price.formatted}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </ul>
                    <ul className='uk-slider-nav uk-dotnav  uk-flex-center uk-margin'></ul>
                    <button className={'uk-position-center-left uk-position-small uk-hidden-hover'} data-uk-slidenav-previous data-uk-slider-item='previous'></button>
                    <button className={'uk-position-center-right uk-position-small uk-hidden-hover'} data-uk-slidenav-next data-uk-slider-item='next'></button>
                </div >
            </> :
            ''
    );
}

export default HomeNewArrivalBlock
