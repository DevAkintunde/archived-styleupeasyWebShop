import React, { useState, useEffect, useContext, Fragment } from "react";
import { PaystackButton } from "react-paystack"
import Loading from "../../system/Loading";
import { paystack } from "../../system/Svg";
import OrderSummary from "./OrderSummary";
import { config } from '../../DrupalUrl';
import CheckOutProcessedPayment from "./CheckOutProcessedPayment";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { LoggedStatus } from "../../App";
import { FaCheckCircle } from "react-icons/fa";

const paystackKey = config.payment.paystack
//const coinbaseKey = config.payment.coinbase
const CheckOutReview = ({
    previousStep,
    orderState,
    values,
    patchUrl,
    processPatch,
    headerAuthorization,
    cartToken,
    order,
    orderType,
    orderRawData
}) => {

    const [step, setStep] = useState();
    //const [paymentResponse, setPaymentResponse] = useState();
    const [refreshReview, setRefreshReview] = useState();
    const [orderData, setOrderData] = useState();
    const { loggedIn } = useContext(LoggedStatus)

    useEffect(() => {
        let isMounted = true;
        const getCall = {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-type': 'application/vnd.api+json',
                //'Commerce-Cart-Token': cartToken,
                //'Authorization': headerAuthorization,
            }
        }
        const patchCall = {
            method: 'PATCH',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-type': 'application/vnd.api+json',
                'Commerce-Cart-Token': cartToken,
                'Authorization': headerAuthorization,
            },
            body: JSON.stringify({
                "data": {
                    "type": orderType,
                    "id": order,
                    "attributes": {
                        "shipping_method": values.shipment
                    }

                }
            })
        }
        const asyncFetch = orderState === 'completed' ? getCall : patchCall
        //update previous step data to db or GET order if order is completed
        const patchOrderContent = async () => {
            const response = await fetch(patchUrl, asyncFetch);
            const outputData = await response.json();
            if (isMounted) {
                setOrderData(outputData);
            }
        }
        patchOrderContent();
        return () => {
            isMounted = false;
        };
    }, [patchUrl, cartToken, headerAuthorization,
        order, orderState, orderType, values.shipment, refreshReview])

    //console.log(orderData)

    const processedPayment = () => {
        setStep('processedPayment');
    };

    let paymentCallback = ''
    if (orderData && orderData.data && orderData.data.links) {
        paymentCallback = orderData.data.links["payment-approve"].href
    }
    let orderAmount = ''
    if (orderData && orderData.data
        && orderData.data.attributes.order_total &&
        orderData.data.attributes.order_total.total.number) {
        const orderAmountString = orderData.data.attributes.order_total.total.number
        orderAmount = (orderAmountString * 1).toFixed(2) * 100
    }
    let orderEmail = ''
    if (orderData && orderData.data
        && orderData.data.attributes.email) {
        orderEmail = orderData.data.attributes.email
    }
    let buyerName = ''
    if (orderData && orderData.data
        && orderData.data.attributes.shipping_information.address
        && orderData.data.attributes.shipping_information.address.given_name) {
        buyerName = orderData.data.attributes.shipping_information.address.given_name
    }
    let buyerPhoneContact = ''
    if (orderData && orderData.data
        && orderData.data.attributes.shipping_information
        && orderData.data.attributes.shipping_information.field_customer_phone_number) {
        buyerPhoneContact = orderData.data.attributes.shipping_information.field_customer_phone_number
    }

    let shippingRate = '';
    if (orderData && orderData.data && orderData.data.attributes.shipping_method &&
        orderData.data.meta && orderData.data.meta.shipping_rates) {
        orderData.data.meta.shipping_rates.forEach((rate) => {
            if (rate.id === orderData.data.attributes.shipping_method) {
                shippingRate = rate;
            }
        })
    }
    //console.log(shippingRate)

    const paystackPay = {
        email: orderEmail,
        amount: orderAmount,
        "metadata": {
            "custom_fields": [
                {
                    "display_name": "Shopper Name",
                    "variable_name": "customer_name",
                    "value": buyerName
                },
                {
                    "display_name": "Shopper Contact",
                    "variable_name": "customer_phone",
                    "value": buyerPhoneContact
                }
            ]
        },
        publicKey: paystackKey,
        reference: order,
        callback: paymentCallback,
        text: "Pay Now",
        onSuccess: (response) => { processedPayment() },
        onClose: () => toast("Your payment has been cancelled. You can resume it anytime here"),
    }
    const triggerReviewRefresh = () => {
        setRefreshReview(Date.now());
    };

    switch (step) {
        case 'processedPayment':
            return (
                <>
                    <section className='uk-margin-large-top uk-article-title uk-text-center'>
                        Payment Verification
                    </section>
                    <div
                        className='uk-margin-remove-top uk-margin uk-position-relative uk-text-center'>
                        <div
                            className='checkout-paymentoptions uk-card uk-card-body uk-card-default uk-margin-auto uk-width-large uk-width-1-1 uk-text-center'
                        >
                            <CheckOutProcessedPayment
                                approvalUrl={paymentCallback}
                                headerAuthorization={headerAuthorization}
                                cartToken={cartToken}
                            />
                        </div>
                        {orderState === 'completed' ?
                            <button
                                type='button'
                                className='uk-button uk-button-default uk-margin'
                                onClick={(e) => setStep('')}
                            >
                                Order Summary
                            </button>
                            : ''}
                    </div>
                </>
            );
        default:
            return (
                <>
                    <Toaster />
                    {
                        orderData && orderData.data ?
                            <>
                                <section
                                    className='uk-card uk-card-default uk-padding-small uk-margin'
                                >
                                    <label className='uk-heading-bullet uk-text-lead uk-display-block'>
                                        Order Summary
                                    </label>
                                    <OrderSummary orderData={orderRawData} />
                                </section>
                                <section
                                    className='uk-card uk-card-default uk-padding-small uk-margin'
                                >
                                    <label className='uk-heading-bullet uk-text-lead uk-display-block'>
                                        Contact
                                    </label>
                                    <div className='uk-padding-small'>
                                        <div>
                                            Email: {
                                                orderData.data.attributes.email ?
                                                    orderData.data.attributes.email
                                                    : 'nil'
                                            }
                                        </div>
                                        <div>
                                            Phone: {
                                                orderData.data.attributes.shipping_information &&
                                                    orderData.data.attributes.shipping_information.field_customer_phone_number ?
                                                    orderData.data.attributes.shipping_information.field_customer_phone_number
                                                    : 'nil'
                                            }
                                        </div>
                                    </div>
                                </section>
                                <section
                                    className='uk-card uk-card-default uk-padding-small uk-margin'
                                >
                                    <label className='uk-heading-bullet uk-text-lead uk-display-block'>
                                        Payment Choice
                                    </label>
                                    <div className='uk-padding-small'>
                                        <div>
                                            {
                                                orderData.data.attributes.payment_instrument ?
                                                    (orderData.data.attributes.payment_instrument.payment_gateway_id === 'paystack') ?
                                                        <>
                                                            <span>{paystack}</span>
                                                            <span className='uk-margin-left uk-text-emphasis'>
                                                                {orderData.data.attributes.payment_instrument.payment_gateway_id}
                                                            </span>
                                                        </>
                                                        : ''
                                                    : orderData.data.attributes.payment_instrument.payment_gateway_id
                                            }
                                        </div>
                                    </div>
                                </section>
                                <section
                                    className='uk-card uk-card-default uk-padding-small uk-margin'
                                >
                                    <label className='uk-heading-bullet uk-text-lead uk-display-block'>
                                        Shipping Address
                                    </label>
                                    <div className='uk-padding-small'>
                                        <div>
                                            First Name: {
                                                orderData.data.attributes.shipping_information &&
                                                    orderData.data.attributes.shipping_information.address &&
                                                    orderData.data.attributes.shipping_information.address.given_name ?
                                                    orderData.data.attributes.shipping_information.address.given_name
                                                    : 'nil'
                                            }
                                        </div>
                                        <div>
                                            Last Name: {
                                                orderData.data.attributes.shipping_information &&
                                                    orderData.data.attributes.shipping_information.address &&
                                                    orderData.data.attributes.shipping_information.address.family_name ?
                                                    orderData.data.attributes.shipping_information.address.family_name
                                                    : 'nil'
                                            }
                                        </div>
                                        <div>
                                            Address: {
                                                orderData.data.attributes.shipping_information &&
                                                    orderData.data.attributes.shipping_information.address &&
                                                    orderData.data.attributes.shipping_information.address.address_line1 ?
                                                    orderData.data.attributes.shipping_information.address.address_line1
                                                    : 'nil'
                                            },  {
                                                orderData.data.attributes.shipping_information &&
                                                    orderData.data.attributes.shipping_information.address &&
                                                    orderData.data.attributes.shipping_information.address.locality ?
                                                    orderData.data.attributes.shipping_information.address.locality
                                                    : 'nil'
                                            },  {
                                                orderData.data.attributes.shipping_information &&
                                                    orderData.data.attributes.shipping_information.address &&
                                                    orderData.data.attributes.shipping_information.address.administrative_area ?
                                                    orderData.data.attributes.shipping_information.address.administrative_area
                                                    : 'nil'
                                            }
                                        </div>
                                        <div>
                                            Country: {
                                                orderData.data.attributes.shipping_information &&
                                                    orderData.data.attributes.shipping_information.address &&
                                                    orderData.data.attributes.shipping_information.address.country_code ?
                                                    orderData.data.attributes.shipping_information.address.country_code
                                                    : 'nil'
                                            }
                                        </div>
                                    </div>
                                </section>
                                <section
                                    className='uk-card uk-card-default uk-padding-small uk-margin'
                                >
                                    <label className='uk-heading-bullet uk-text-lead uk-display-block'>
                                        Delivery Method
                                    </label>
                                    <div className='uk-padding-small'>
                                        <div>
                                            {shippingRate && shippingRate.service ?
                                                <>
                                                    <div>
                                                        {shippingRate.service.label}
                                                    </div>
                                                    <div className='uk-text-right'>
                                                        <span>Delivery Fee: </span>
                                                        <span style={{
                                                            color: '#612E35',
                                                            fontSize: 'large',
                                                            fontWeight: '700',
                                                            textDecoration: 'underline'
                                                        }}>
                                                            {shippingRate.amount.formatted}
                                                        </span>
                                                    </div>
                                                </>
                                                : 'Not Found'}
                                        </div>
                                    </div>
                                </section>
                                <section
                                    className='uk-card uk-card-default uk-padding-small uk-margin'
                                >
                                    <label className='uk-heading-bullet uk-text-lead uk-display-block'>
                                        Total Payment Due
                                    </label>
                                    <div className='uk-padding-small'>
                                        <div
                                            className='uk-text-lead uk-text-right'
                                            style={{
                                                color: '#612E35',
                                                fontWeight: '700'
                                            }}
                                        >
                                            {
                                                orderData.data.attributes.order_total ?
                                                    orderData.data.attributes.order_total.total.formatted
                                                    : 'nil'
                                            }
                                            {orderState === 'completed' ?
                                                <div>
                                                    <FaCheckCircle style={{ fontSize: '50' }} className={'uk-text-success'} />
                                                    <span className={'uk-text-small'}>Paid</span>
                                                </div>
                                                : ''}
                                        </div>
                                    </div>
                                </section>

                                <div className='uk-flex uk-flex-center uk-margin-medium'>
                                    {
                                        orderState !== 'completed' ?
                                            <>
                                                <button
                                                    type='button'
                                                    className='uk-button uk-button-default uk-margin-right'
                                                    onClick={(e) => previousStep()}
                                                >
                                                    Change Delivery
                                                </button>
                                                {paystackPay ?
                                                    <PaystackButton
                                                        className={'uk-button uk-button-primary'}
                                                        {...paystackPay}
                                                    />
                                                    : ''}
                                            </>
                                            : loggedIn === true ?
                                                <Link to={orderData.data.links.self.href}
                                                    className='uk-button uk-button-primary'
                                                >
                                                    See this Order
                                                </Link>
                                                :
                                                <Link to='/sign-in'
                                                    className='uk-button uk-button-primary'
                                                >
                                                    Sign-in with Email
                                                </Link>

                                    }

                                </div>
                            </>
                            :
                            <Loading refresh={true} refreshTrigger={triggerReviewRefresh} />
                    }
                </>
            );
    }
}

export default CheckOutReview