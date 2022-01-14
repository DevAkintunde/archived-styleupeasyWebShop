import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { config } from '../../DrupalUrl';

//const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const HomeHeaderProductImport = () => {
    const [variationImport, setVariationImport] = useState();

    const aliasSuffix = 'products?&filter[status][value]=1&sort[sort-changed][path]=changed&sort[sort-changed][direction]=DESC&page[limit]=1&include=default_variation,default_variation.field_product_images';
    useEffect(() => {
        let isMounted = true;
        const getVariationImport = async () => {
            const response = await fetch(siteJsonUrl + aliasSuffix, {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-type': 'application/vnd.api+json'
                }
            });
            const outputData = await response.json();
            //console.log(outputData);

            if (isMounted && outputData && outputData.data && outputData.included) {
                const parentProductUrl = outputData.data[0].attributes.path.alias;

                outputData.included.forEach((variation) => {
                    if (variation.type.includes('product-variation--')) {
                        if (variation.attributes.status && variation.attributes.status === true) {
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
                                setVariationImport(variationProps);
                            }
                        }
                    }


                })
            }
        }
        getVariationImport();

        return () => {
            isMounted = false;
        };
    }, [])

    //console.log(variationImport)
    return (
        variationImport && variationImport.data && variationImport.images.length > 0 ?
            <div className='uk-position-center-left uk-position-medium uk-visible@m'>
                <div className=''>
                    <div className='uk-padding-small uk-card-default-light uk-card-body'>
                        <div className='uk-card uk-card-default-light uk-padding-small'>
                            <Link to={variationImport.parent_url}>
                                {<img src={variationImport.images[0]} alt={variationImport.data.attributes.title} />}
                            </Link>
                            <div className='uk-position-bottom uk-text-center uk-overlay-default uk-margin-auto'>
                                <h4 className='variation-price'>
                                    {variationImport.data.attributes.price.formatted}
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className='uk-margin-top uk-flex uk-flex-center'>
                        <Link to={variationImport.parent_url} className='uk-button uk-button-primary'>
                            Shop This
                        </Link>
                    </div>
                </div>

            </div > :
            ''
    );
}

export default HomeHeaderProductImport
