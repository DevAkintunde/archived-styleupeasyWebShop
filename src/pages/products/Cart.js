import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { config } from '../../DrupalUrl';
//import { JwtToken, LoggedStatus } from "../../App";
import toast, { Toaster } from 'react-hot-toast';
//import Loading from '../../system/Loading';
import { InCartCountTrigger } from '../../App';

const siteJsonUrl = config.url.SITE_JSON_URL;
const Cart = ({
	cartItem,
	headerAuthorization,
	cartToken,
	triggerRerenderCart
}) => {
	const history = useHistory();

	//console.log(cartItem)
	const orderId = cartItem.order.id;
	const [subTotal, setSubTotal] = useState('checking');
	const [cartUpdated, setCartUpdated] = useState(false);
	const [emptyCart, setEmptyCart] = useState(false);
	const [cartToProcess, setCartToProcess] = useState();
	const { setCartCountTrigger } = useContext(InCartCountTrigger);

	useEffect(() => {
		if (document.getElementById('cart-form') && document.getElementById('cart-form').childNodes[0].id) {
			setCartToProcess(document.getElementById('cart-form').childNodes[0].id);
		}
	}, [])
	useEffect(() => {
		if (cartItem && cartItem.items) {
			setSubTotal(cartItem.order.attributes.order_total.subtotal.formatted);
		}
	}, [cartItem])

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
					if ((thisInput.max * 1) === thisQuantity) {
						e.target.disabled = 'true';
					}
					checkDesc = true;
					updateTotal = true;
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
					descInput.disabled = false
				}
			}
		}
		if (updateTotal === true) {
			const thisRow = e.target.parentNode.parentNode.childNodes
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
					thisInput.value = thisQuantity;
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
		// console.log(e);
		e.target.classList.add('submit-loading');
		const identifier = e.target.id;
		const identifierProps = identifier.split('/');
		const itemUuid = identifierProps[0];
		const itemType = identifierProps[1];
		// console.log(itemType + '-------' + itemUuid);
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
				itemRow.remove();
				toast("Item removed from cart");
				const cartPane = document.getElementById(cartToProcess);
				const cartItemRows = cartPane.childNodes[0].childNodes;
				if (cartItemRows.length === 0) {
					setEmptyCart(true);
				}
				setCartCountTrigger(Date.now());
			} else if (response.status === 422) {
				triggerRerenderCart();
			} else {
				e.target.classList.remove('submit-loading');
				if (response.status === 403) {
					toast("Oops! We can't seem to update your order. Please try again");
				}
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
			const cartRow = cartPane.childNodes[0].childNodes;
			const cartItemCount = cartRow.length;
			let isMounted = true;
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
					// console.log(orderId + '-----' + itemId + '---' + itemQty);
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
						if (response.status === 200) {
							cartItemProcessedCount++;

							if ((cartItemCount === cartItemProcessedCount) && (toCheckout === true)) {
								history.push('/checkout/' + orderId);
								setTimeout(() => {
									setCartCountTrigger(Date.now());
								}, 3000);
								//console.log('process completed');
							} else {
								setCartCountTrigger(Date.now());
								if (cartUpdated === true && isMounted) {
									setCartUpdated(false);
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
	}, [timedCartTrigger, cartItemProcessedCount, cartToProcess, cartToken,
		cartUpdated, headerAuthorization, history, orderId, setCartCountTrigger, toCheckout])

	const saveCartUpdate = (e) => {
		// console.log(e);
		if (cartUpdated) {
			if (!e.target || !e.target.type
				|| (e.target.type !== 'button' && e.target.type !== 'submit')) {
				setTimedCartTrigger(Date.now());
			}
			if (toCheckout) {
				setToCheckout(false);
			}
		}
	}
	const pageDocumentId = document.getElementById('page-wrapper');
	pageDocumentId.onclick = saveCartUpdate;
	const checkOut = (e) => {
		e.preventDefault();
		setToCheckout(true);
		setTimedCartTrigger(Date.now());
	}

	return (
		emptyCart === false ?
			<>
				<Toaster />
				<form
					onClick={saveCartUpdate}
					id={'cart-form'}
					className={'uk-overflow-auto'}
				>
					<table
						id={orderId}
						className='uk-table uk-table-divider uk-table-small uk-table-middle uk-table-striped'
					>
						<tbody
							id='cart-layout-body'
						>
							{cartItem && cartItem.items ?
								cartItem.items.map((purchasedItem, index) => {
									return (
										<tr key={purchasedItem.itemProps.purchased.id}
											id={purchasedItem.item.id + '/' + purchasedItem.item.type}>
											<td>{index + 1}</td>
											<td>
												<img src={purchasedItem.itemProps.image} alt={purchasedItem.item.attributes.title} />
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
														fontWeight: 'bold'
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
														fontWeight: 'bold'
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
						<tfoot>
							<tr className='uk-text-center'>
								<td></td><td></td><td></td><td></td>
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
				</form>
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
							type='button'
							onClick={checkOut}
							value='Check Out'
							className={toCheckout === true ? 'uk-button loading' : 'uk-button uk-button-primary'}
							disabled={toCheckout === true ? true : false}
						/>
					</span>
				</div>
			</>
			: 'This cart is now empty'
	)
}
export default Cart