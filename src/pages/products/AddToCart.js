import { useState, useEffect, useContext } from 'react'
//import { useHistory } from 'react-router-dom';
import { config } from '../../DrupalUrl';
import { JwtToken, LoggedStatus } from "../../App";
import { InCartCountTrigger } from '../../App';
//import toast, { Toaster } from 'react-hot-toast';

const siteJsonUrl = config.url.SITE_JSON_URL;
const AddToCart = (props) => {
	const { setCartCountTrigger } = useContext(InCartCountTrigger);

	const variationUuid = props.variation;
	const variationType = props.type;

	const variationUrl = siteJsonUrl + 'product-variations/' + variationType + '/' + variationUuid;

	const [entity, setEntity] = useState({});
	const [qtyInput, setQtyInput] = useState(1);
	const { loggedIn } = useContext(LoggedStatus);

	const { jwtTokenBearer } = useContext(JwtToken);
	let headerAuthorization = 'Bearer ' + jwtTokenBearer;
	if (!jwtTokenBearer) {
		headerAuthorization = '';
	}

	const cartToken = localStorage.getItem('cartToken');
	//console.log(localStorage)
	//allows to get stock properties
	useEffect(() => {
		let isMounted = true;
		const getEntity = async () => {
			const response = await fetch(variationUrl, {
				method: 'GET',
				headers: {
					'Accept': 'application/vnd.api+json',
					'Content-type': 'application/vnd.api+json',
				},
				//redirect: 'follow',
			})
			const outputData = await response.json();
			if (isMounted && outputData.data) {
				setEntity(outputData);
				//setQtyInput(1);
			}
		}
		getEntity();

		return () => {
			isMounted = false;
		};
	}, [variationUrl])

	//console.log(entity)

	const [stock, setStock] = useState(0);
	//const [availability, setAvailability] = useState('');
	useEffect(() => {
		if (entity && entity.data) {
			if (entity.data.attributes.commerce_stock_always_in_stock === true) {
				setStock(999);
			} else if (entity.data.attributes.field_stock_level.available_stock) {
				setStock(entity.data.attributes.field_stock_level.available_stock * 1);
			}
			//setAvailability(entity.data.attributes.field_availability);
		}
	}, [entity])

	// let purchaseAvailability = ''
	// let buyNowClass = 'buy-now-checkout-button'
	// if (availability === 'preorder') {
	// 	purchaseAvailability = 'Pre-Order'
	// 	buyNowClass = 'preorder-checkout-button'
	// } else {
	// 	purchaseAvailability = 'Buy Now'
	// }

	// const onSubmit = (e) => {
	// 	e.preventDefault();
	// }
	//Add order to specific order type not yet supported in commerce Api
	//This approach was used in php to create a buy now cart for immediate checkout
	//Re-implement when available or if alternative method will work
	/**
	const checkOut = (e) => {
		e.preventDefault()

		const checkItemOut = async () => {
			const response = await fetch(siteJsonUrl + cartAddSuffix, {
				method: 'GET',
				headers: {
					'Accept': 'application/vnd.api+json',
					'Content-type': 'application/vnd.api+json',
					'Commerce-Cart-Token': cartToken,
				},
			})
			const outputData = await response.json()
			response.status === 200 && outputData.data ?
				history.push('/checkout/' + outputData.data[0].id)
				:
				toast('There was a problem checking out')
		}
		checkItemOut()
		insert the below code in the button section of Return
		
		 <input type='button' className='uk-button' value={purchaseAvailability} onClick={checkOut} />
		 
	}**/

	//decrease the quantity by defined step
	const decQty = (e) => {
		if (qtyInput > 0) {
			setQtyInput(qtyInput - 1);
		}
	}
	//increase the quantity by defined step
	const incQty = (e) => {
		if (qtyInput < stock) {
			setQtyInput(qtyInput + 1);
		}
	}
	//console.log(qtyInput + ' < ' + stock)
	const onAddToCart = (e) => {
		e.preventDefault();
		let isMounted = true;
		e.target.value = 'added';
		e.target.disabled = true;
		setTimeout(() => {
			e.target.value = stock > 0 ? 'Add To Cart' : 'Out of Stock';
			e.target.disabled = false;
		}, 2500);

		if ((loggedIn || cartToken) && qtyInput
			&& (qtyInput > 0) && stock > 0) {
			const cartCounter = document.querySelectorAll('.cart-counter');
			if (cartCounter.length > 0) {
				cartCounter.forEach((thisCounter) => {
					thisCounter.innerText = (thisCounter.innerText * 1) + qtyInput;
				});
			}
			fetch(siteJsonUrl + 'cart/add', {
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
							'quantity': qtyInput
						},
					}],
				}),
			}).then((res) => {
				if (res && res.status === 200) {
					//toast('Item is added to cart');
					if (isMounted) {
						setStock(previous => previous - qtyInput);
					}
					setCartCountTrigger(Date.now());
				} else {
					//toast('There was a problem adding item to cart');
				}
			})
		} else {
			//toast('There was a problem adding item to cart');
		}
	}

	return (
		<>
			<form>
				<div className={'uk-flex uk-flex-center uk-flex-middle uk-grid-small'}
					data-uk-grid>
					<div>
						<input
							type='button'
							value='-'
							onClick={decQty}
							style={{
								cursor: stock > 0 ?
									qtyInput > 1 ? 'pointer' : ''
									: '',
								fontSize: '20px',
								padding: '0px 15px', marginRight: '5px',
								border: 'none', fontWeight: 'bold',
								backgroundColor: qtyInput > 1 ? '' : '#fff'
							}}
							disabled={stock > 0 ?
								qtyInput > 1 ? false : true
								: true}
						/>
						<input
							type='number'
							value={qtyInput}
							disabled
							min='1'
							max={stock}
							step='1'
							id='quantity-input'
							className={'remove-input-number-spin-button'}
							required
							onChange={(e) => setQtyInput(e.target.value)}
						/>

						<input
							type='button'
							value='+'
							onClick={incQty}
							style={{
								cursor: stock > 0 ?
									qtyInput < stock ? 'pointer' : ''
									: '',
								fontSize: '20px',
								padding: '0px 15px', marginLeft: '5px',
								border: 'none', fontWeight: 'bold',
								backgroundColor: qtyInput < stock ? '' : '#fff'
							}}
							disabled={stock > 0 ?
								qtyInput < stock ? false : true
								: true}
						/>
					</div>
					<div>
						<input
							type='submit'
							className='uk-button uk-button-primary uk-text-capitalize'
							style={{ borderRadius: '5px' }}
							value={stock > 0 ? 'Add To Cart' : 'Out of Stock'}
							disabled={stock > 0 ? false : true}
							onClick={onAddToCart}
						/>
					</div>
				</div>
			</form>
		</>
	)
}
export default AddToCart