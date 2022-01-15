import React, { useState, useEffect, useContext } from "react";
import { FaBitcoin, FaWallet } from "react-icons/fa";
import { LoggedStatus } from "../../App";
import { paystack } from "../../system/Svg";
import validator from "validator";
import Loading from "../../system/Loading";

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
    orderType,
    reservedPaymentList,
    setReservedPaymentList
}) => {

    // const allPaymentGatewaysIds = {
    //     paystack: 'paystack',
    //     cod: 'cod',
    //     crypto: 'coinbase'
    // }
    const { loggedIn } = useContext(LoggedStatus);
    const [paymentOptions, setPaymentOptions] = useState();
    const [refreshPaymentList, setRefreshPaymentList] = useState();
    useEffect(() => {
        let isMounted = true;

        //update previous step data to db
        const patchOrderContent = async () => {
            const response = await fetch(patchUrl, {
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
            const outputData = await response.json();
            if (isMounted && outputData && outputData.data
                && outputData.data.meta.payment_options) {
                setPaymentOptions(outputData.data.meta.payment_options);
            }
            // console.log(outputData);

            return () => {
                isMounted = false;
            };
        }
        if ((processPatch === true && patchUrl && !reservedPaymentList) || refreshPaymentList) {
            patchOrderContent();
        }
    }, [processPatch, patchUrl, cartToken, headerAuthorization,
        values.email, order, orderType, refreshPaymentList, reservedPaymentList])

    let payOptions = [];
    let paymentList = [];
    if (reservedPaymentList) {
        paymentList = reservedPaymentList;
    } else {
        paymentList = paymentOptions;
    }
    if (paymentList && paymentList.length > 0) {
        paymentList && paymentList.forEach((payOption) => {
            const eachOption =
                < div
                    className='uk-width-1-1 uk-display-block form-item uk-margin'
                    key={payOption.id}
                >
                    <label
                        htmlFor={payOption.id}
                        className='uk-text-lead uk-card uk-card-default form-type-radio'
                        style={{ cursor: 'pointer', padding: '2px' }}
                    >
                        <input
                            className='form-radio uk-radio'
                            style={{ margin: '0 0 5px -10px' }}
                            name="paymentOption"
                            value={payOption.id}
                            type="radio"
                            id={payOption.id}
                            onClick={handleFormData("paymentOption")}
                            defaultChecked={values.paymentOption === payOption.id ?
                                true : ''}
                        />
                        {payOption.id === 'paystack' ?
                            <span className='uk-margin-left'>{paystack}</span>
                            : payOption.id === 'cod' ?
                                <FaWallet className='uk-margin-left' style={{ marginTop: '-5px' }} />
                                : payOption.id === 'coinbase' ?
                                    <FaBitcoin className='uk-margin-left' style={{ marginTop: '-5px' }} />
                                    : ''}
                        <span style={{ marginLeft: '5px' }}>
                            {payOption.id === 'paystack' ? 'Paystack'
                                : payOption.id === 'cod' ?
                                    'COD'
                                    : payOption.id === 'coinbase' ?
                                        'Crypto'
                                        : ''}
                        </span>
                    </label>
                    {payOption.label ?
                        <div style={{ fontSize: 'small', marginLeft: '30px' }}>
                            {payOption.id === 'coinbase' ?
                                (payOption.label.split(':').length > 1 ?
                                    <><div>{payOption.label.split(':')[0]}</div>
                                        <div>{payOption.label.split(':')[1].trim()}</div>
                                    </>
                                    : payOption.label)
                                : payOption.label}
                        </div>
                        : ''}
                </div >
            payOptions.push(eachOption);
        })
    };
    // console.log(payOptions);

    const [error, setError] = useState(false);
    const submitFormData = (e) => {
        e.preventDefault();
        if (validator.isEmpty(values.paymentOption)) {
            setError(true);
        } else {
            setError(false);
            setReservedPaymentList(paymentList);
            nextStep();
        }
    };
    const backToPrevious = () => {
        setReservedPaymentList();
        previousStep();
    }
    const triggerVendorRefresh = () => {
        setRefreshPaymentList(Date.now());
    };

    return (
        <>
            <form
                onSubmit={submitFormData}>
                {payOptions && payOptions.length > 0 ?
                    <>
                        <div className="form-item uk-margin uk-text-center">
                            {payOptions}
                        </div>
                        {
                            error ? (
                                <div style={{ color: "red", textAlign: 'center' }}>
                                    Select a payment option to continue
                                </div>
                            ) : (
                                ""
                            )
                        }</>
                    : <>
                        <Loading refresh={true} refreshTrigger={triggerVendorRefresh}
                            message='Unable to verify available payment options. Please click the refresh button below.' />
                    </>
                }
                <div className='uk-flex uk-flex-center uk-margin-medium uk-grid-small'
                    data-uk-grid>
                    {
                        loggedIn !== true ?
                            <div><button
                                type='button'
                                className='uk-button uk-button-default'
                                onClick={backToPrevious}
                            >
                                Change Email
                            </button></div>
                            : ''
                    }
                    <div><button
                        className='uk-button uk-button-primary'
                        type='submit'
                        disabled={payOptions && payOptions.length > 0 ?
                            false : true}
                    >
                        Continue
                    </button></div>
                </div>
            </form>
        </>
    )
}

export default CheckOutPaymentOption