import { useState, useEffect, useContext } from 'react'
//import { useHistory } from 'react-router-dom';
import { config } from '../../DrupalUrl';
import { JwtToken, LoggedStatus } from "../../App";
import { InCartCountTrigger } from '../../App';
import toast, { Toaster } from 'react-hot-toast';
import { FaShoppingCart } from 'react-icons/fa';

const siteJsonUrl = config.url.SITE_JSON_URL
const AddToCartLink = (props) => {
	const { setCartCountTrigger } = useContext(InCartCountTrigger);

	const variationUuid = props.variation;
	const variationType = props.type;
	const variationUrl = siteJsonUrl + 'product-variations/' + variationType + '/' + variationUuid;
	const [entity, setEntity] = useState();

	useEffect(() => {
		const getEntity = async () => {
			const response = await fetch(variationUrl, {
				method: 'GET',
				headers: {
					'Accept': 'application/vnd.api+json',
					'Content-type': 'application/vnd.api+json',
				},
			})
			const outputData = await response.json();
			setEntity(outputData);
		}
		getEntity();

	}, [variationUrl])

	//console.log(entity);

	const [stock, setStock] = useState(0);
	let availability = '';
	useEffect(() => {
		if (entity && entity.data) {
			if (entity.data.attributes.commerce_stock_always_in_stock === true) {
				setStock(999);
			} else if (entity.data.attributes.field_stock_level.available_stock) {
				setStock(entity.data.attributes.field_stock_level.available_stock * 1);
			}
			availability = entity.data.attributes.field_availability;
		}
	}, [entity])

	let purchaseAvailability = '';
	let buyNowClass = 'buy-now-checkout-button';
	if (availability === 'preorder') {
		purchaseAvailability = 'Pre-Order';
		buyNowClass = 'preorder-checkout-button';
	} else {
		purchaseAvailability = 'Buy Now';
	}

	const [qty, setQty] = useState();
	const { loggedIn } = useContext(LoggedStatus);

	const { jwtTokenBearer } = useContext(JwtToken);
	let headerAuthorization = 'Bearer ' + jwtTokenBearer;
	if (!jwtTokenBearer) {
		headerAuthorization = '';
	}

	const cartToken = localStorage.getItem('cartToken');
	const cartAddSuffix = 'cart/add';

	useEffect(() => {
		if ((loggedIn || cartToken) && qty > 0) {
			const addToCart = async () => {
				const response = await fetch(siteJsonUrl + cartAddSuffix, {
					method: 'POST',
					headers: {
						'Accept': 'application/vnd.api+json',
						'Content-type': 'application/vnd.api+json',
						'Commerce-Cart-Token': cartToken,
						'Authorization': headerAuthorization,
					},
					body: JSON.stringify({
						data: [{
							type: 'product-variation--' + variationType,
							id: variationUuid,
							meta: {
								'quantity': qty
							},
						}],
					}),

				})
				if (response && response.status === 200) {
					toast('Item is added to cart');
					setStock(stock - qty);
					setQty();
					setCartCountTrigger(Date.now());
				} else {
					toast('There was a problem adding item to cart');
				}
				const outputData = await response.json();
			}
			addToCart();
		}
	}, [qty > 0])

	const onSubmit = (e) => {
		e.preventDefault();
		setQty(1);
	}

	return (
		<>
			{stock > 0 ?
				<>
					<button
						type='button'
						className='uk-button uk-text-capitalize'
						style={{ padding: '0 10px' }}
						onClick={onSubmit}
					><span>Add To Cart </span><FaShoppingCart /></button>
				</>
				: <div className='out-of-stock'>Out of Stock</div>
			}
		</>
	)
}

export default AddToCartLink