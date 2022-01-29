import React, { useState, useEffect } from "react";
import { FaAngleDoubleDown } from "react-icons/fa";
import validator from "validator";
import Address from "./Address";

const CheckOutShippingDestination = ({
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
                                "email": values.email
                            }
                        }
                    })
                });
                //const outputData = await response.json();
                //console.log(response);
                //console.log(outputData);
            }
            patchOrderContent();
        }
    }, [processPatch, patchUrl, cartToken, headerAuthorization,
        order, orderType, values.email, values.paymentOption])

    const [firstNameError, setFirstNameError] = useState(false);
    const [contactNoError, setContactNoError] = useState(false);

    const submitFormData = (e) => {
        e.preventDefault();

        if (validator.isEmpty(values.firstName)) {
            setFirstNameError(true);
        } else if (!validator.isMobilePhone(values.contactNo, 'en-NG')) {
            setContactNoError(true);
        } else {
            setFirstNameError(false);
            setContactNoError(true);
            nextStep();
        }
    };

    return (
        <>
            <form
                onSubmit={submitFormData}>
                <div className='form-item'>
                    <label
                        className='uk-display-block'
                    >Contact No <FaAngleDoubleDown />
                    </label>
                    <input
                        style={{ border: contactNoError ? "2px solid red" : "" }}
                        name="contactNo"
                        defaultValue={values.contactNo}
                        type="text"
                        placeholder="Phone Number"
                        className='uk-width-1-1'
                        onChange={handleFormData("contactNo")}
                    />
                    {contactNoError ? (
                        <div style={{ color: "red" }}>
                            A valid destination contact no. is required
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <div className='form-item uk-margin'>
                    <label
                        className='uk-display-block'
                    >First Name <FaAngleDoubleDown />
                    </label>
                    <input
                        style={{ border: firstNameError ? "2px solid red" : "" }}
                        name="firstName"
                        defaultValue={values.firstName}
                        type="text"
                        placeholder="First Name"
                        className='uk-width-1-1'
                        onChange={handleFormData("firstName")}
                    />
                    {firstNameError ? (
                        <div style={{ color: "red" }}>
                            At least your first name is required
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <div className='form-item uk-margin'>
                    <label>Last Name <FaAngleDoubleDown />
                    </label>
                    <input
                        name="lastName"
                        defaultValue={values.lastName}
                        type="text"
                        placeholder="Last Name"
                        className='uk-width-1-1'
                        onChange={handleFormData("lastName")}
                    />
                </div>

                <Address
                    handleFormData={handleFormData}
                    values={values}
                    elementName={`shipping`}
                    extraValidation={values.address_line1}
                    previousStep={previousStep}
                    previousText={'Change Email'}
                    submitText={'Continue'}
                />
            </form>
        </>
    )
}

export default CheckOutShippingDestination