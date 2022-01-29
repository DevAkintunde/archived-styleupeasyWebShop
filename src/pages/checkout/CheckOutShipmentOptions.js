import React, { useState, useEffect } from "react";
import { FaShippingFast } from "react-icons/fa";
import validator from "validator";
import Loading from "../../system/Loading";

const CheckOutShipmentOptions = ({
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
    reservedShipmentList,
    setReservedShipmentList
}) => {

    const [shipmentRates, setShipmentRates] = useState();
    const [refreshShipmentList, setRefreshShipmentList] = useState();
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
                            "payment_instrument": {
                                "payment_gateway_id": values.paymentOption
                            },
                            "shipping_information": {
                                "address": {
                                    "country_code": 'NG',
                                    "administrative_area": values.state.value,
                                    "locality": values.city.value,
                                    "address_line1": values.address_line1,
                                    "given_name": values.firstName,
                                    'family_name': values.lastName
                                },
                                "field_customer_phone_number": values.contactNo
                            },
                        }
                    }
                })
            })
            const outputData = await response.json();
            if (isMounted && outputData && outputData.data
                && outputData.data.meta.shipping_rates) {
                setShipmentRates(outputData.data.meta.shipping_rates);
            }
            // console.log(outputData);
            return () => {
                isMounted = false;
            };
        }
        if ((processPatch === true && patchUrl && !reservedShipmentList) || refreshShipmentList) {
            patchOrderContent();
        }
    }, [processPatch, patchUrl, cartToken, headerAuthorization, refreshShipmentList,
        order, orderType, reservedShipmentList,
        values.contactNo, values.firstName, values.lastName, values.address_line1,
        values.city, values.state, values.paymentOption, values.email])

    let rates = [];
    let shipmentList = [];
    if (reservedShipmentList) {
        shipmentList = reservedShipmentList;
    } else {
        shipmentList = shipmentRates;
    }
    if (shipmentList) {
        shipmentList && shipmentList.forEach((rate) => {
            const eachRate =
                < div
                    className='uk-width-1-1 uk-display-block form-item uk-margin'
                    key={rate.shipping_method_id}
                >
                    <label
                        htmlFor={rate.id}
                        className='uk-text-lead uk-card uk-card-default form-type-radio'
                        style={{ cursor: 'pointer', padding: '2px' }}
                    >
                        <input
                            className='form-radio uk-radio'
                            style={{ margin: '0 0 5px -10px' }}
                            name="shipmentOption"
                            value={rate.id}
                            type="radio"
                            id={rate.id}
                            onClick={handleFormData("shipment")}
                            defaultChecked={values.shipment === rate.id ?
                                true : ''}
                        />
                        <FaShippingFast className='uk-margin-left' style={{ marginTop: '-5px' }} />
                        <span style={{ marginLeft: '5px' }}>
                            {rate.service.label}
                        </span>
                    </label>
                    {rate.description ?
                        <div style={{ fontSize: 'small' }}>
                            {rate.description}
                        </div>
                        : ''}
                    {rate.amount && rate.amount.formatted ?
                        <div>
                            <span>Delivery Fee: </span>
                            <span style={{
                                color: '#612E35',
                                fontSize: 'large',
                                fontWeight: '800',
                                textDecoration: 'underline'
                            }}>
                                {rate.amount.formatted}
                            </span>
                        </div>
                        : ''}
                </div >
            rates.push(eachRate);
        })
    };

    const [error, setError] = useState(false);
    const submitFormData = (e) => {
        e.preventDefault();
        if (validator.isEmpty(values.shipment)) {
            setError(true);
        } else {
            // setError(false);
            setReservedShipmentList(shipmentList);
            nextStep();
        }
    };
    const backToPrevious = () => {
        values.shipment = '';
        setReservedShipmentList();
        previousStep();
    }
    //trigger async refresh if timed-out.
    const triggerVendorRefresh = () => {
        setRefreshShipmentList(Date.now());
    };
    // console.log(rates);
    return (
        <>
            <h4 className='uk-text-muted uk-text-center'>Select a shipment option</h4>
            <form
                onSubmit={submitFormData}>
                {rates.length > 0 ?
                    <>
                        <div className="form-item uk-margin uk-text-center">
                            {rates}
                        </div>
                        {
                            error ? (
                                <div style={{ color: "red", textAlign: 'center' }}>
                                    Select a delivery option to continue
                                </div>
                            ) : (
                                ""
                            )
                        }</>
                    : <>
                        <Loading refresh={true} refreshTrigger={triggerVendorRefresh}
                            message='Unable to verify available shipping rates at the moment. Please click the refresh button below.' />
                    </>
                }

                <div className='uk-flex uk-flex-center uk-margin-medium uk-grid-small'
                    data-uk-grid>
                    <div><button
                        type='button'
                        className='uk-button uk-button-default'
                        onClick={backToPrevious}
                    >
                        Switch Payment
                    </button></div>
                    <div><button
                        type='submit'
                        className={'uk-button' + (values.shipment ? ' uk-button-primary' : '')}
                        disabled={rates.length > 0 ?
                            values.shipment ? false : true
                            : true}
                    >
                        Review Order
                    </button></div>
                </div>
            </form>
        </>
    )
}
export default CheckOutShipmentOptions