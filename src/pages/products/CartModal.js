import { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { config } from '../../DrupalUrl';
//import { JwtToken, LoggedStatus } from "../../App";
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../../system/Loading';
import { InCartCountTrigger } from '../../App';
import { FaShoppingBag } from 'react-icons/fa';

const siteJsonUrl = config.url.SITE_JSON_URL;
const CartModal = ({
	cartModalItems,
	headerAuthorization,
	cartToken,
	cartCount
}) => {
	const history = useHistory();
	const [openModal, setOpenModal] = useState(false);

	//console.log(cartModalItems);
	const [orderId, setOrderId] = useState();
	const [subTotal, setSubTotal] = useState('checking');
	const [cartUpdated, setCartUpdated] = useState(false);
	const [emptyCart, setEmptyCart] = useState(false);
	const [cartToProcess, setCartToProcess] = useState();
	const { setCartCountTrigger } = useContext(InCartCountTrigger);

	const cartOverlayForm = document.getElementById('cart-form-modal');
	useEffect(() => {
		if (cartOverlayForm && cartOverlayForm.childNodes
			&& cartOverlayForm.childNodes[0].childNodes
			&& cartOverlayForm.childNodes[0].childNodes[0].id) {
			setCartToProcess(cartOverlayForm.childNodes[0].childNodes[0].id);
		}
		if (cartOverlayForm && cartOverlayForm.parentNode) {
			const cartOverlay = cartOverlayForm.parentNode.parentNode;
			if (!cartOverlay.classList.contains('uk-visible') &&
				cartOverlay.classList.contains('uk-hidden') &&
				openModal === true) {
				setOpenModal(false);
			}
		}
	}, [cartOverlayForm, openModal])
	useEffect(() => {
		if (cartModalItems && cartModalItems.order) {
			setOrderId(cartModalItems.order.id);
		}
		if (cartModalItems && cartModalItems.items) {
			setSubTotal(cartModalItems.order.attributes.order_total.subtotal.formatted);
		}
	}, [cartModalItems])

	useEffect(() => {
		if (cartCount > 0) {
			setEmptyCart(false);
		}
	}, [cartCount])

	const incQty = (e) => {
		e.preventDefault();
		setCartUpdated(true);
		//console.log(e);
		const imputted = e.target.parentNode.childNodes;
		let checkDesc = false;
		let updateTotal = false;
		let thisQuantity = '';

		for (let i = 0; i < imputted.length; i++) {
			const thisInput = imputted[i];
			if (thisInput.id === 'quantity-input') {
				if ((thisInput.max * 1) > (thisInput.value * 1)) {
					thisQuantity = (thisInput.value * 1) + 1;
					thisInput.value = thisQuantity;
					checkDesc = true;
					updateTotal = true;
					if ((thisInput.max * 1) === thisQuantity) {
						e.target.disabled = 'true';
					}
				} else if ((thisInput.max * 1) < (thisInput.value * 1)) {
					thisQuantity = thisInput.max * 1;
					thisInput.value = thisInput.max * 1;
					checkDesc = true;
					updateTotal = true;
				} else if ((thisInput.max * 1) === (thisInput.value * 1)) {
					e.target.disabled = 'true';
				}
			}
		}
		if (checkDesc === true) {
			for (let j = 0; j < imputted.length; j++) {
				const descInput = imputted[j];
				if ((descInput.id === 'quantity-decrease') && descInput.disabled === true) {
					descInput.disabled = false;
				}
			}
		}
		if (updateTotal === true) {
			//realtime counter
			const cartCounter = document.querySelectorAll('.cart-counter');
			if (cartCounter.length > 0) {
				cartCounter.forEach((thisCounter) => {
					thisCounter.innerText = (thisCounter.innerText * 1) + 1;
				});
			}

			const thisRow = e.target.parentNode.parentNode.childNodes;
			for (let k = 0; k < thisRow.length; k++) {
				const thisCol = thisRow[k];

				if (thisCol.id === 'priceRow') {
					const unitPrice = thisCol.childNodes[1].id * 1;
					const updatedTotal = unitPrice * thisQuantity;
					const formattedTotal = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(updatedTotal);
					thisCol.childNodes[0].textContent = formattedTotal;
				}
			}
			const thisTable = e.target.parentNode.parentNode.parentNode.childNodes;
			let subTotal = '';
			for (let l = 0; l < thisTable.length; l++) {
				const tableRow = thisTable[l];
				const tableRowChild = tableRow.childNodes;
				let unitPrice = '';
				let itemQuantity = '';
				for (let m = 0; m < tableRowChild.length; m++) {
					const tableChildCol = tableRowChild[m];

					if (tableChildCol.id === 'priceRow') {
						unitPrice = tableChildCol.childNodes[1].id * 1;
					}
					if (tableChildCol.id === 'quantity-input-group') {
						itemQuantity = tableChildCol.childNodes[1].value * 1;
					}
				}
				if (unitPrice && itemQuantity) {
					subTotal = Number(subTotal) + (unitPrice * itemQuantity);
					//console.log(subTotal);
				}
			}
			const thisFooter = e.target.parentNode.parentNode.parentNode.parentNode.childNodes;
			const subTotalInFooter = thisFooter[1].childNodes[0].childNodes;
			if (subTotal) {
				for (let n = 0; n < subTotalInFooter.length; n++) {
					const footerCol = subTotalInFooter[n];
					if (footerCol.id === 'subTotalPrice') {
						const formattedSubTotal = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(subTotal);
						footerCol.textContent = formattedSubTotal;
					}
				}
			}
		}
	}
	const desQty = (e) => {
		e.preventDefault();
		setCartUpdated(true);
		//console.log(e);
		const imputted = e.target.parentNode.childNodes;
		let checkInc = false;
		let updateTotal = false;
		let thisQuantity = '';

		for (let i = 0; i < imputted.length; i++) {
			const thisInput = imputted[i];
			if (thisInput.id === 'quantity-input') {
				if ((thisInput.min * 1) < (thisInput.value * 1)) {
					if ((thisInput.max * 1) >= (thisInput.value * 1)) {
						thisQuantity = (thisInput.value * 1) - 1;
					} else {
						thisQuantity = thisInput.max * 1;
					}
					thisInput.value = thisQuantity
					if ((thisInput.min * 1) === (thisQuantity)) {
						e.target.disabled = 'true';
					}
					checkInc = true;
					updateTotal = true;
				} else if ((thisInput.min * 1) === (thisInput.value * 1)) {
					e.target.disabled = 'true';
					checkInc = true;
				}
			}
		}
		if (checkInc === true) {
			for (let j = 0; j < imputted.length; j++) {
				const incInput = imputted[j];
				if ((incInput.id === 'quantity-increase') && incInput.disabled === true) {
					incInput.disabled = false;
				}
			}
		}
		if (updateTotal === true) {
			//realtime counter
			const cartCounter = document.querySelectorAll('.cart-counter');
			if (cartCounter.length > 0) {
				cartCounter.forEach((thisCounter) => {
					thisCounter.innerText = (thisCounter.innerText * 1) - 1;
				});
			}

			const thisRow = e.target.parentNode.parentNode.childNodes;
			for (let k = 0; k < thisRow.length; k++) {
				const thisCol = thisRow[k];

				if (thisCol.id === 'priceRow') {
					const unitPrice = thisCol.childNodes[1].id * 1;
					const updatedTotal = unitPrice * thisQuantity;
					const formattedTotal = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(updatedTotal);
					thisCol.childNodes[0].textContent = formattedTotal;
				}
			}
			const thisTable = e.target.parentNode.parentNode.parentNode.childNodes;
			let subTotal = '';
			for (let l = 0; l < thisTable.length; l++) {
				const tableRow = thisTable[l];
				const tableRowChild = tableRow.childNodes;
				let unitPrice = '';
				let itemQuantity = '';
				for (let m = 0; m < tableRowChild.length; m++) {
					const tableChildCol = tableRowChild[m];

					if (tableChildCol.id === 'priceRow') {
						unitPrice = tableChildCol.childNodes[1].id * 1;
					}
					if (tableChildCol.id === 'quantity-input-group') {
						itemQuantity = tableChildCol.childNodes[1].value * 1;
					}
				}
				if (unitPrice && itemQuantity) {
					subTotal = Number(subTotal) + (unitPrice * itemQuantity);
					//console.log(subTotal);
				}
			}
			const thisFooter = e.target.parentNode.parentNode.parentNode.parentNode.childNodes;
			const subTotalInFooter = thisFooter[1].childNodes[0].childNodes;
			if (subTotal) {
				for (let n = 0; n < subTotalInFooter.length; n++) {
					const footerCol = subTotalInFooter[n];
					if (footerCol.id === 'subTotalPrice') {
						const formattedSubTotal = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(subTotal);
						footerCol.textContent = formattedSubTotal;
					}
				}
			}
		}
	}

	const removeItem = (e) => {
		e.preventDefault();
		const itemRow = e.target.parentNode.parentNode;
		e.target.classList.add('submit-loading');
		const identifier = e.target.id;
		const identifierProps = identifier.split('/');
		const itemUuid = identifierProps[0];
		const itemType = identifierProps[1];

		const alias = 'carts/' + orderId + '/items';
		const removeFromCart = async () => {
			const response = await fetch(siteJsonUrl + alias, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/vnd.api+json',
					'Content-type': 'application/vnd.api+json',
					'Commerce-Cart-Token': cartToken,
					'Authorization': headerAuthorization,
				},
				body: JSON.stringify({
					"data": [{
						"type": itemType,
						"id": itemUuid,
					}]
				})
			});
			if (response.status === 204) {
				//deduct from cart counter
				const cartCounter = document.querySelectorAll('.cart-counter');
				if (cartCounter.length > 0) {
					itemRow.childNodes.forEach((data) => {
						if (data.id === 'quantity-input-group') {
							const qtyGroup = data.childNodes;
							qtyGroup.forEach((input) => {
								if (input.id === 'quantity-input') {
									cartCounter.forEach((thisCounter) => {
										thisCounter.innerText = (thisCounter.innerText * 1) - (input.value * 1);
										// Remove row from list.
										// itemRow.remove();
									});
								}
							})
						}
					})
				}
				setCartCountTrigger(Date.now());
				toast("Item removed from cart");

				const cartPane = document.getElementById(cartToProcess);
				let cartItemRows = '';
				if (cartPane && cartPane.childNodes && cartPane.childNodes[0].childNodes) {
					cartItemRows = cartPane.childNodes[0].childNodes;
				}
				if (cartItemRows.length === 0) {
					setEmptyCart(true);
				}
			} else if (response.status === 422) {
				setCartCountTrigger(Date.now());
			}
		}
		removeFromCart();
	}

	const [timedCartTrigger, setTimedCartTrigger] = useState();
	const [toCheckout, setToCheckout] = useState(false);
	let [cartItemProcessedCount] = useState(0);

	useEffect(() => {
		if ((toCheckout === true || cartUpdated === true) && cartToProcess) {
			const cartPane = document.getElementById(cartToProcess);
			let cartRow = '';
			if (cartPane && cartPane.childNodes && cartPane.childNodes[0].childNodes) {
				cartRow = cartPane.childNodes[0].childNodes;
			}
			// console.log(cartRow);
			if (cartRow) {
				let isMounted = true;
				const cartItemCount = cartRow.length;
				cartRow.forEach(item => {
					let itemGroup = item.id.split('/');
					let itemId = itemGroup[0];
					let itemType = itemGroup[1];
					let itemQty = '';
					const itemRow = item.childNodes;
					for (let i = 0; i < itemRow.length; i++) {
						const itemCol = itemRow[i];
						if (itemCol.id === 'quantity-input-group') {
							itemQty = itemCol.childNodes[1].value;
						}
					}
					if (orderId && itemId && itemQty) {
						// console.log(orderId + '-----' + itemId + '---' + itemQty)
						const updateCart = async () => {
							const response = await fetch(siteJsonUrl + 'carts/' + orderId + '/items/' + itemId, {
								method: 'PATCH',
								headers: {
									'Accept': 'application/vnd.api+json',
									'Content-type': 'application/vnd.api+json',
									'Commerce-Cart-Token': cartToken,
									'Authorization': headerAuthorization,
								},
								body: JSON.stringify({
									"data": {
										"type": itemType,
										"id": itemId,
										"attributes": {
											"quantity": itemQty,
										}
									}
								})
							})
							// const outputData = await response.json();
							// console.log(response);
							// console.log(outputData);
							if (response && response.status === 200) {
								cartItemProcessedCount++;

								if ((cartItemCount === cartItemProcessedCount) && (toCheckout === true)) {
									history.push('/checkout/' + orderId);
									setTimeout(() => {
										setCartCountTrigger(Date.now());
										if (isMounted) {
											setToCheckout(false);
										}
									}, 3000);
									//console.log('process completed');
								} else {
									setCartCountTrigger(Date.now());
									if (cartUpdated === true && isMounted) {
										setCartUpdated(false);
									}
								}
								if ((cartItemCount === cartItemProcessedCount) && openModal === true) {
									const cartOverlayForm = document.getElementById('cart-form-modal');
									if (cartOverlayForm && cartOverlayForm.parentNode) {
										const cartOverlay = cartOverlayForm.parentNode.parentNode;
										if (!cartOverlay.classList.contains('uk-visible')) {
											setOpenModal(false);
										}
									}
								}
							}
						}
						if (timedCartTrigger) {
							updateCart();
							setTimedCartTrigger();
						}
					}
				});
			}
		}
	}, [timedCartTrigger, cartItemProcessedCount, cartToProcess, cartToken, cartUpdated, headerAuthorization,
		history, openModal, orderId, setCartCountTrigger, toCheckout])

	const saveCartUpdate = (e) => {
		if (cartUpdated) {
			if (e.target.type !== 'button' && e.target.type !== 'submit') {
				setTimedCartTrigger(Date.now());
			}
			if (toCheckout) {
				setToCheckout(false);
			}
			if (e.target.classList.contains('uk-overlay')) {
				e.target.classList.add('uk-hidden');
				e.target.classList.remove('uk-visible');
			}
		} else if (!toCheckout && e.target.type !== 'submit') {
			//setOpenModal(false);
			if (e.target.classList.contains('uk-overlay')) {
				e.target.classList.add('uk-hidden');
				e.target.classList.remove('uk-visible');
			}
		}
	}
	const checkOut = (e) => {
		e.preventDefault();
		setToCheckout(true);
		setTimedCartTrigger(Date.now());
	}
	const viewModal = (e) => {
		if (!openModal) {
			setOpenModal(true);
		} else {
			const cartOverlayContainer = document.getElementById('cart-form-modal-container');
			if (cartUpdated) {
				if (cartOverlayContainer) {
					setTimedCartTrigger(Date.now());
					cartOverlayContainer.classList.add('uk-visible');
					cartOverlayContainer.classList.remove('uk-hidden');
				}
			} else {
				if (openModal && cartOverlayContainer) {
					if (!cartOverlayContainer.classList.contains('uk-hidden')) {
						cartOverlayContainer.classList.add('uk-hidden');
						if (cartOverlayContainer.classList.contains('uk-visible')) {
							cartOverlayContainer.classList.remove('uk-visible');
						}
					} else {
						cartOverlayContainer.classList.add('uk-visible');
						cartOverlayContainer.classList.remove('uk-hidden');
					}
				} else if (openModal) {
					setOpenModal(false);
				} else {
					setOpenModal(true);
				}
			}
		}
	}
	const closeModal = () => {
		if (cartUpdated) {
			setTimedCartTrigger(Date.now());
			const cartOverlayContainer = document.getElementById('cart-form-modal-container');
			if (cartOverlayContainer) {
				cartOverlayContainer.classList.add('uk-hidden');
			}
		} else {
			setOpenModal(false);
		}
	}
	//close modal if page redirect happens while modal is opened
	useEffect(() => {
		const cartOverlayContainer = document.getElementById('cart-form-modal-container');
		if (cartOverlayContainer) {
			cartOverlayContainer.classList.add('uk-hidden');
		}
	}, [history.location.key])

	return (
		<>
			<>
				{openModal === true ?
					emptyCart === false ?
						<>
							<div
								className='uk-position-cover uk-position-z-index uk-position-fixed uk-overlay uk-overlay-primary uk-flex uk-flex-center'
								style={{ paddingTop: '50px' }}
								id={'cart-form-modal-container'}
								onClick={saveCartUpdate}
							>
								<input
									className={'uk-position-bottom-center uk-position-z-index'}
									style={{
										padding: '0.4em 1em',
										border: '1px solid #310b0b',
										cursor: 'pointer',
										borderRadius: '20px',
										textAlign: 'center'
									}}
									type='button'
									value={'Close'}
									onClick={closeModal}
									hidden={toCheckout === true ? false : ''}
								/>
								<div
									className='uk-card uk-card-body uk-card-default uk-width-xlarge uk-width-1-1'
								>
									<Toaster />
									{cartModalItems && cartModalItems.items.length > 0 ?
										<form
											onSubmit={checkOut}
											id={'cart-form-modal'}
											style={{ overflowY: 'auto', height: '100%' }}
										>
											<div className={'uk-overflow-auto'}>
												<table
													id={orderId + '-modal'}
													className='uk-table uk-table-divider uk-table-small uk-table-middle uk-table-striped'
												>
													<tbody
														id='cart-layout-body'
													>
														{cartModalItems && cartModalItems.items ?
															cartModalItems.items.map((purchasedItem, index) => {
																return (
																	<tr key={purchasedItem.itemProps.purchased.id}
																		id={purchasedItem.item.id + '/' + purchasedItem.item.type}>
																		{cartModalItems.items.length > 1 ?
																			<td>{index + 1}</td>
																			: null}
																		<td>
																			<Link
																				to={purchasedItem.itemProps.product_url}>
																				<img src={purchasedItem.itemProps.image} alt={purchasedItem.item.attributes.title} />
																			</Link>
																		</td>
																		<td className='uk-visible@s'>
																			{purchasedItem.item.attributes.title.split(' - ')[0]}
																		</td>
																		<td>
																			{purchasedItem.item.attributes.title.split(' - ')[1]}
																		</td>
																		<td id='quantity-input-group'
																			className={'uk-text-center'}
																		>
																			<input
																				type='button'
																				value='-'
																				id={'quantity-decrease'}
																				onClick={desQty}
																				style={{
																					cursor: 'pointer',
																					fontSize: '20px',
																					padding: '0 15px',
																					marginBottom: '3px',
																					border: 'none',
																					fontWeight: 'bold',
																					display: 'block',
																					margin: 'auto'
																				}}
																			/>
																			<input
																				type={'number'}
																				defaultValue={purchasedItem.item.attributes.quantity * 1}
																				//id={purchasedItem.item.id}
																				min='1'
																				max={purchasedItem.itemProps.purchased.attributes.commerce_stock_always_in_stock === true ?
																					'999'
																					: purchasedItem.itemProps.purchased.attributes.field_stock_level.available_stock}
																				step='1'
																				id='quantity-input'
																				className={'remove-input-number-spin-button'}
																				style={{
																					display: 'block',
																					margin: 'auto'
																				}}
																				required
																				disabled
																			/>
																			<input
																				type='button'
																				value='+'
																				id={'quantity-increase'}
																				onClick={incQty}
																				style={{
																					cursor: 'pointer',
																					fontSize: '20px',
																					padding: '0 15px',
																					marginTop: '3px',
																					border: 'none',
																					fontWeight: 'bold',
																					display: 'block',
																					margin: 'auto'
																				}}
																			/>
																			<div>
																				{purchasedItem.itemProps.purchased.attributes.commerce_stock_always_in_stock === false &&
																					(purchasedItem.item.attributes.quantity * 1) > purchasedItem.itemProps.purchased.attributes.field_stock_level.available_stock ?
																					'Only ' + purchasedItem.itemProps.purchased.attributes.field_stock_level.available_stock + ' in stock'
																					: ''}
																			</div>
																		</td>
																		<td id={'priceRow'}>
																			<div style={{ textAlign: 'right' }}
																				id={'priceTotal'}
																			>
																				{purchasedItem.item.attributes.total_price.formatted}</div>
																			<div style={{ fontSize: '0.8em', textAlign: 'right' }}
																				id={purchasedItem.item.attributes.unit_price.number}
																			>
																				({purchasedItem.item.attributes.unit_price.formatted})</div>
																		</td>
																		<td className={'uk-table-shrink uk-position-relative'}>
																			<input
																				type='button'
																				value={'X'}
																				id={purchasedItem.item.id + '/' + purchasedItem.item.type}
																				style={{
																					cursor: 'pointer',
																					fontSize: '25px',
																					padding: '0 15px',
																					border: 'none',
																					fontWeight: 'bold',
																					color: 'red'
																				}}
																				onClick={removeItem}
																			/>
																		</td>
																	</tr>
																)
															})
															: ''
														}
													</tbody>
													<tfoot className='uk-text-center'>
														<tr>
															{cartModalItems && cartModalItems.items &&
																cartModalItems.items.length > 1 ?
																<td></td>
																: null}
															<td className={'uk-visible@s'}></td><td></td><td></td>
															<td>
																SubTotal
															</td>
															<td
																style={{
																	fontWeight: 'bold',
																	fontSize: 'larger'
																}}
																id={'subTotalPrice'}
															>
																{subTotal}
															</td>
														</tr>
													</tfoot>
												</table >
											</div>
											<div
												style={{ _minHeight: '32px' }}
												className='uk-flex uk-flex-middle uk-flex-center uk-margin'
											>
												{toCheckout === true ?
													<span className={'uk-margin-right'}
														style={{ marginTop: '5px' }}
													>Please wait...</span>
													: ''}
												<span className={'uk-position-relative'}>
													<input
														type='submit'
														value='Check Out'
														className={toCheckout === true ? 'uk-button submit-loading' : 'uk-button'}
														disabled={toCheckout === true ? true : false}
													/>
												</span>
											</div>
											<div className={'uk-text-center'}>
												<Link
													to='/cart'
													className={'uk-button uk-button-secondary'}
												>See my Cart
												</Link>
											</div>
										</form>
										: <Loading message="Seems there's nothing in your cart yet" />}
								</div>
							</div>
						</>
						: <><div
							className='uk-position-cover uk-overlay uk-overlay-primary uk-flex uk-flex-center uk-flex-middle'
							onClick={saveCartUpdate}
							id={'cart-form-modal-container'}
						>
							<button
								className={'uk-position-bottom-center uk-position-fixed uk-position-z-index'}
								style={{
									padding: '0.4em 1em',
									border: '1px solid #310b0b',
									cursor: 'pointer',
									borderRadius: '20px'
								}}
								onClick={closeModal}
							>Close</button>
							<div
								className='uk-card uk-card-body uk-card-default uk-width-xlarge uk-width-1-1 uk-text-center'
							>
								This cart is empty
							</div>
						</div></>
					: ''

				}

				<button
					className={'uk-text-lead uk-margin-small-bottom uk-position-z-index' + (history.location.pathname === '/cart' ? ' uk-hidden'
						: history.location.pathname.includes('/checkout/') ? ' uk-hidden' : '')}
					style={{
						color: '#310b0b!important',
						background: openModal === true ? '#fff' : '#ffffffdb',
						textDecoration: 'none',
						marginRight: '10px',
						paddingLeft: '3px',
						border: 'none',
						borderBottom: '5px solid #310b0b',
						padding: '0.1em 0.1em',
						cursor: 'pointer',
						position: 'sticky',
						bottom: '7px',
						float: 'right',
						marginTop: '-50px'
					}}
					id='inCartButton'
					onClick={viewModal}
				>
					<FaShoppingBag
						style={{ color: '#310b0b', }}
					/>
					<span
						className={'uk-text-small uk-text-light cart-counter'}
						style={{
							padding: '0 0.2em',
							border: '1px solid',
							borderRadius: '20px'
						}}
					>
						{cartCount}
					</span>
				</button>
			</>
		</>
	)
}

export default CartModal