import { useState, useEffect, useContext, Fragment } from 'react'
//import { useHistory } from 'react-router-dom';
import { config } from '../../DrupalUrl';
import { JwtToken, LoggedStatus } from "../../App";
//import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import Loading from '../../system/Loading';
// import { InCartCountTrigger } from '../../App';
import PageTitle from '../../layout/PageTitle';
import { JsonLd } from 'react-schemaorg';

const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const CartsPage = () => {
	// //const history = useHistory();
	// const { cartCountTrigger } = useContext(InCartCountTrigger);
	const [cartItems, setCartItems] = useState({});
	const [rerenderCartPage, setRerenderCartPage] = useState();

	const { jwtTokenBearer } = useContext(JwtToken);
	const { loggedIn } = useContext(LoggedStatus);

	const cartToken = localStorage.getItem('cartToken');
	let headerAuthorization = 'Bearer ' + jwtTokenBearer;
	if (!jwtTokenBearer) {
		headerAuthorization = '';
	}
	const alias = 'carts?include=order_items.purchased_entity,order_items.purchased_entity.field_product_images';

	useEffect(() => {
		let isMounted = true;
		const getCarts = async () => {
			const response = await fetch(siteJsonUrl + alias, {
				method: 'GET',
				headers: {
					'Accept': 'application/vnd.api+json',
					'Content-type': 'application/vnd.api+json',
					'Commerce-Cart-Token': cartToken,
					'Authorization': headerAuthorization,
				},
			})
			const outputData = await response.json();

			//console.log(response);
			//console.log(outputData);
			let allOrderCarts = [];
			outputData && outputData.data && outputData.data.forEach((order) => {
				let items = [];
				outputData && outputData.included && outputData.included.forEach((orderItem) => {
					if (orderItem.type.includes('order-item--')) {
						if (order.id === orderItem.relationships.order_id.data.id) {
							let itemOrderProps = '';
							outputData && outputData.included.forEach((itemPurchased) => {
								if (itemPurchased.type.includes('product-variation')) {
									if (itemPurchased.id === orderItem.relationships.purchased_entity.data.id) {

										let itemImageFile = '';
										outputData && outputData.included.forEach((itemImage) => {
											if (itemImage.type.includes('file--file')) {
												if (itemImage.id === itemPurchased.relationships.field_product_images.data[0].id) {
													itemImageFile = itemImage.attributes.image_style_uri.thumbnail;

												}
											}
										})
										const itemProps = {
											'purchased': itemPurchased,
											'image': itemImageFile
										};
										itemOrderProps = itemProps;
									}
								}
							})
							const thisOrderProps = {
								item: orderItem,
								itemProps: itemOrderProps
							};
							items.unshift(thisOrderProps);
						}
					}
				})
				const thisOrderCarts = {
					order: order,
					items: items
				};
				allOrderCarts.push(thisOrderCarts);
			})
			if (isMounted) {
				setCartItems(allOrderCarts);
			}
		}
		if (cartToken || loggedIn) {
			getCarts();
		}

		return () => {
			isMounted = false;
		};
	}, [alias, cartToken, headerAuthorization, loggedIn, rerenderCartPage])

	const triggerRerenderCartPage = () => {
		setRerenderCartPage(Date.now());
	}

	return (
		<>
			<JsonLd
				item={{
					"@context": "https://schema.org",
					"@type": "WebPage",
					name: 'Shopping Cart',
					description: 'Shopping user cart',
					url: siteUrl + 'cart',
					author: 'StyleUpEasy',
					keywords: ['cart']
				}}
			/>
			<PageTitle title={'Your Cart'} />
			<div
				className='uk-margin-remove-top uk-margin uk-flex uk-flex-center uk-position-relative'>
				<div
					className='uk-card uk-card-body uk-card-default uk-width-1-1'
				>
					{cartItems && cartItems.length > 0 ?
						cartItems.map((cartItem, index) => {
							return (
								cartItem.items.length > 0 ?
									<Fragment key={cartItem.order.id}>
										{index === 0 ?
											<label className='uk-heading-bullet uk-text-lead uk-display-block'>
												Recent
											</label>
											: ''}
										{index === 0 ?
											<Cart
												cartItem={cartItem}
												headerAuthorization={headerAuthorization}
												cartToken={cartToken}
												triggerRerenderCart={triggerRerenderCartPage}
											/>
											: <div className='uk-card uk-card-default'>
												<Cart
													cartItem={cartItem}
													headerAuthorization={headerAuthorization}
													cartToken={cartToken}
													triggerRerenderCart={triggerRerenderCartPage}
												/>
											</div>
										}

									</Fragment>
									: <>
										<Loading message='Cart is empty' />
										<div
											className='uk-text-center uk-margin'
										>
											<Link to={'/in-stock'}>Browse our collections and spice up your style
											</Link>
										</div>
									</>
							)
						})
						:
						<Loading message="Seems you haven't added anything to a cart yet" />
					}
				</div>
			</div>
		</>
	)
}

export default CartsPage