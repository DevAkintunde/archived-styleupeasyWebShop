import React, { useState, useEffect, useContext } from "react";
import { FaBitcoin } from "react-icons/fa";
import { LoggedStatus } from "../../App";
import { paystack } from "../../system/Svg";
import validator from "validator";

const CheckOutPaymentOption = ({
    nextStep,
    previousStep,
    handleFormData,
    values,
    patchUrl,
    processPatch,
    headerAuthorization,
    cartToken,
    order,
    orderType
}) => {

    const allPaymentGatewaysIds = {
        paystack: 'paystack',
        crypto: 'coinbase'
    }

    useEffect(() => {
        if (processPatch === true && patchUrl) {
            //update previous step data to db
            const patchOrderContent = async () => {
                fetch(patchUrl, {
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
                                "email": values.email,
                            }
                        }
                    })
                });
            }
            patchOrderContent();
        }
    }, [processPatch, patchUrl, cartToken, headerAuthorization,
        values.email, order, orderType])

    const { loggedIn } = useContext(LoggedStatus);

    const [error, setError] = useState(false);
    const submitFormData = (e) => {
        e.preventDefault();
        if (validator.isEmpty(values.paymentOption) || values.paymentOption === 'coinbase') {
            setError(true);
        } else {
            nextStep();
        }
    };

    return (
        <>
            <form
                onSubmit={submitFormData}>
                <div>
                    <div
                        className='uk-width-1-1 uk-display-block form-item uk-margin'
                    >
                        <label
                            htmlFor='paystack'
                            className='uk-text-lead uk-card uk-card-default form-type-radio'
                            style={{ cursor: 'pointer', padding: '2px' }}
                        >
                            {paystack}
                            <span className='uk-margin-left'>Paystack </span>
                            <input
                                className='form-radio uk-radio'
                                name="paymentOption"
                                value={allPaymentGatewaysIds.paystack}
                                type="radio"
                                //checked='true'
                                id='paystack'
                                onClick={handleFormData("paymentOption")}
                                defaultChecked={values.paymentOption === allPaymentGatewaysIds.paystack ?
                                    true : ''}
                            />
                        </label>
                        <div style={{ marginTop: '-7px', fontSize: 'small' }}>
                            Pay with your naira card
                        </div>
                    </div>
                    <div
                        className='uk-width-1-1 uk-display-block form-item uk-margin'
                    >
                        <label
                            htmlFor='crypto'
                            className='uk-text-lead uk-card uk-card-default form-type-radio'
                            style={{ _cursor: 'pointer', padding: '2px' }}
                        >
                            <FaBitcoin style={{ fontSize: '2em' }} />
                            <span className='uk-margin-left'>Cryptocurrency</span>
                            <input
                                className='form-radio uk-radio'
                                name="paymentOption"
                                value={allPaymentGatewaysIds.crypto}
                                type="radio"
                                id='crypto'
                                onClick={handleFormData("paymentOption")}
                                defaultChecked={values.paymentOption === allPaymentGatewaysIds.crypto ?
                                    true : ''}
                                disabled
                            />
                        </label>
                        <div style={{ marginTop: '-7px', fontSize: 'small' }}>
                            Pay with your crypto wallet (currently suspended)
                        </div>
                    </div>
                </div>
                {
                    error ? (
                        <div style={{ color: "red" }}>
                            Select a payment option to continue
                        </div>
                    ) : (
                        ""
                    )
                }
                <div className='uk-flex uk-flex-center uk-margin-medium'>
                    {
                        loggedIn !== true ?
                            <button
                                type='button'
                                className='uk-button uk-button-default uk-margin-right'
                                onClick={(e) => previousStep()}
                            >
                                Change Email
                            </button>
                            : ''
                    }
                    <button
                        className='uk-button uk-button-primary'
                        type='submit'>
                        Continue
                    </button>
                </div>
            </form>
        </>
    )
}

export default CheckOutPaymentOption