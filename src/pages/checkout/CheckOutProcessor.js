import { useState, useEffect, useContext } from 'react'
//import Loading from '../../system/Loading'
import { config } from '../../DrupalUrl';
import { JwtToken, LoggedStatus } from "../../App";
import toast, { Toaster } from 'react-hot-toast';
import validator from "validator";
import LoginForm from '../usersForm/LoginForm';
import CheckOutPaymentOption from './CheckOutPaymentOption';
import CheckOutShippingDestination from './CheckOutShippingDestination';
import CheckOutReview from './CheckOutReview';
import { Link } from 'react-router-dom';
import CheckOutShipmentOptions from './CheckOutShipmentOptions';
import { FaAngleDoubleDown, FaBackspace } from 'react-icons/fa';

//const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
//const siteJsonEntityUrl = config.url.SITE_ENTITY_ROUTER_URL;
const CheckOutProcessor = (props) => {
    const { jwtTokenBearer } = useContext(JwtToken)
    const { loggedIn } = useContext(LoggedStatus)
    const [orderState, setOrderState] = useState()

    const [step, setStep] = useState();
    useEffect(() => {
        let isMounted = true;
        let getSectionById = document.getElementById('checkoutPage');
        if (getSectionById && isMounted) {
            getSectionById.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'start'
            });
        }
        return () => { isMounted = false; }
    }, [step])

    //state for form data
    const [orderRawData, setOrderRawData] = useState();
    const [processPatch, setProcessPatch] = useState(false);
    const [patchUrl, setPatchUrl] = useState();
    const [orderType, setOrderType] = useState();

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        contactNo: '',
        paymentOption: '',
        address_line1: '',
        city: { label: '', value: '' },
        state: { label: '', value: '' },
        //validAddress: false,
        unlistedCity: { label: '', value: '' },
        shipment: '',
    });

    const anonymousEmail = () => {
        if (orderState !== 'completed') {
            setStep();
        } else {
            setStep('review');
        }
    };
    const paymentOptionStep = () => {
        if (orderState !== 'completed') {
            setStep('paymentOption');
        } else {
            setStep('review');
        }
    };
    const shippingDestinationStep = () => {
        if (orderState !== 'completed') {
            setStep('shippingDestination');
        } else {
            setStep('review');
        }
    };
    const shipmentOptionsStep = () => {
        if (orderState !== 'completed') {
            setStep('shipmentOptions');
        } else {
            setStep('review');
        }
    };
    const reviewStep = () => {
        setStep('review');
    };

    // handling form input data by taking onchange value and updating our previous form data state
    const handleInputData = input => e => {
        // input value from the form
        const { value } = e.target;

        //updating for data state taking previous state and then adding new value to create new object
        setFormData(prevState => ({
            ...prevState,
            [input]: value
        }));
    }

    const [emailAddress, setEmailAddress] = useState('');
    const [emailInputError, setEmailInputError] = useState(false);
    const continueByEmail = ((e) => {
        e.preventDefault()
        //console.log(formData.email)
        if (!validator.isEmail(emailAddress)) {
            setEmailInputError(true);
        } else {
            setEmailInputError(false)
            formData['email'] = emailAddress;
            setStep('paymentOption');
        }
    })
    //console.log(formData);

    const cartToken = localStorage.getItem('cartToken');
    const headerAuthorization = 'Bearer ' + jwtTokenBearer;
    const order = props.order;
    const alias = 'checkout/' + order;
    //use to control rerendering on useEffects
    //to caution formData rerender
    const [singlerenderer, setSingleRenderer] = useState(false);
    useEffect(() => {
        let isMounted = true;
        if (cartToken || loggedIn) {
            const getOrderContent = async () => {
                const response = await fetch(siteJsonUrl + alias + '?include=order_items,order_items.purchased_entity,order_items.purchased_entity.field_product_images', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/vnd.api+json',
                        'Content-type': 'application/vnd.api+json',
                        'Commerce-Cart-Token': cartToken,
                        'Authorization': headerAuthorization,
                    }
                })
                const outputData = await response.json();
                //console.log(response);
                //console.log(outputData);
                if (isMounted) {
                    if (response.status === 500) {
                        toast('Oops! Seems your order cannot be found. Please send us an email if you have further troubles');
                    }
                    setOrderRawData(outputData);
                    if (outputData && outputData.data) {
                        setOrderType(outputData.data.type);
                        setOrderState(outputData.data.attributes.state);
                        if (outputData.data.attributes.state !== 'completed') {
                            setProcessPatch(true);
                        }
                        if (outputData.data.attributes.email) {
                            setEmailAddress(outputData.data.attributes.email);
                        }
                        if (outputData.data.attributes.payment_instrument &&
                            outputData.data.attributes.payment_instrument.payment_gateway_id) {
                            formData['paymentOption'] = outputData.data.attributes.payment_instrument.payment_gateway_id;
                        }
                        if (outputData.data.attributes.shipping_information &&
                            outputData.data.attributes.shipping_information.address) {
                            const orderPreAddress = outputData.data.attributes.shipping_information.address;
                            formData['address_line1'] = orderPreAddress.address_line1;
                            formData['state']['value'] = orderPreAddress.administrative_area;
                            formData['state']['label'] = orderPreAddress.administrative_area;
                            formData['city']['value'] = orderPreAddress.locality;
                            formData['city']['label'] = orderPreAddress.locality;
                            formData['lastName'] = orderPreAddress.family_name;
                            formData['firstName'] = orderPreAddress.given_name;
                            formData['contactNo'] = outputData.data.attributes.shipping_information.field_customer_phone_number;
                        }
                    }
                    setPatchUrl(siteJsonUrl + alias);
                }
                return () => {
                    isMounted = false;
                };
            }
            if (!singlerenderer) {
                getOrderContent();
                setSingleRenderer(true);
            }
        }
    }, [cartToken, headerAuthorization, alias, loggedIn,
        formData, singlerenderer]);

    //console.log(processPatch);
    // console.log(formData);
    const [reservedPaymentList, setReservedPaymentList] = useState();

    switch (step) {
        case 'paymentOption':
            return (
                <>
                    <section
                        className='uk-article-title uk-text-center'>
                        Payment Option
                    </section>
                    <div
                        className='uk-margin-remove-top uk-margin uk-flex uk-flex-center uk-position-relative'>
                        <div
                            className='checkout-paymentoptions uk-card uk-card-body uk-card-default uk-width-large uk-width-1-1 uk-text-center'
                        >
                            <CheckOutPaymentOption
                                nextStep={shippingDestinationStep}
                                previousStep={anonymousEmail}
                                handleFormData={handleInputData}
                                values={formData}
                                patchUrl={patchUrl}
                                processPatch={processPatch}
                                headerAuthorization={headerAuthorization}
                                cartToken={cartToken}
                                order={order}
                                orderType={orderType}
                                reservedPaymentList={reservedPaymentList}
                                setReservedPaymentList={setReservedPaymentList}
                            />
                            <div className='uk-text-center'>
                                <Link to='/cart' className={'uk-button uk-button-default'}>
                                    Return To Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            );
        case 'shippingDestination':
            return (
                <>
                    <section
                        className='uk-article-title uk-text-center'>
                        Shipping Detail
                    </section>
                    <div
                        className='uk-margin-remove-top uk-margin uk-flex uk-flex-center uk-position-relative'>
                        <div
                            className='uk-card uk-card-body uk-card-default uk-width-large uk-width-1-1'
                        >
                            <CheckOutShippingDestination
                                nextStep={shipmentOptionsStep}
                                previousStep={paymentOptionStep}
                                handleFormData={handleInputData}
                                values={formData}
                                patchUrl={patchUrl}
                                processPatch={processPatch}
                                headerAuthorization={headerAuthorization}
                                cartToken={cartToken}
                                order={order}
                                orderType={orderType}
                            />
                            <div className='uk-text-center'>
                                <Link to='/cart' className={'uk-button uk-button-default'}>
                                    Return To Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            );
        case 'shipmentOptions':
            return (
                <>
                    <section
                        className='uk-article-title uk-text-center'>
                        Shipping Vendor(s)
                    </section>
                    <div
                        className='uk-margin-remove-top uk-margin uk-flex uk-flex-center uk-position-relative'>
                        <div
                            className='uk-card uk-card-body uk-card-default uk-width-large uk-width-1-1'
                        >
                            <CheckOutShipmentOptions
                                nextStep={reviewStep}
                                previousStep={shippingDestinationStep}
                                handleFormData={handleInputData}
                                values={formData}
                                patchUrl={patchUrl}
                                processPatch={processPatch}
                                headerAuthorization={headerAuthorization}
                                cartToken={cartToken}
                                order={order}
                                orderType={orderType}
                            />
                            <div className='uk-text-center'>
                                <Link to='/cart' className={'uk-button uk-button-default'}>
                                    Return To Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            );
        case 'review':
            return (
                <>
                    <section
                        className='uk-article-title uk-text-center'>
                        {orderState === 'completed' ?
                            'Order Processed'
                            : 'Review Order'
                        }
                    </section>
                    <div
                        className='uk-margin-remove-top uk-margin uk-flex uk-flex-center uk-position-relative'>
                        <div
                            className='uk-card uk-card-body uk-card-default uk-width-xlarge uk-width-1-1'
                        >
                            <CheckOutReview
                                previousStep={orderState !== 'completed' ? shipmentOptionsStep : ''}
                                orderState={orderState}
                                values={formData}
                                patchUrl={patchUrl}
                                processPatch={processPatch}
                                headerAuthorization={headerAuthorization}
                                cartToken={cartToken}
                                order={order}
                                orderType={orderType}
                                orderRawData={orderRawData}
                            />
                            <div className='uk-text-center'>
                                {
                                    orderState === 'completed' ?
                                        <Link to='/in-stock' className={'uk-button uk-button-default'}>
                                            Keep Shopping
                                        </Link>
                                        : ''
                                }
                            </div>
                        </div>
                    </div>
                </>
            );
        case 'login':
            return (
                loggedIn !== true ?
                    <div
                        className='uk-position-relative uk-padding-small'>
                        <LoginForm />
                        <div className='uk-text-center uk-position-bottom-center'
                            style={{ bottom: '20px' }}>
                            <button
                                className='uk-button uk-text-capitalize'
                                style={{ borderTop: '2px solid #ba6b57' }}
                                onClick={() => setStep()}
                            ><FaBackspace style={{ fontSize: '1.5em', marginRight: '10px' }} />
                                Go Back</button>
                        </div>
                    </div>
                    :
                    setStep('paymentOption')
            );
        default:
            return (
                <>
                    <Toaster />
                    {
                        loggedIn === true ?
                            setStep('paymentOption')
                            :
                            <>
                                <section
                                    className='uk-article-title uk-text-center'>
                                    Personal Info
                                </section>
                                <div
                                    className='uk-margin-remove-top uk-margin-large uk-flex uk-flex-center uk-position-relative'
                                >
                                    <div
                                        className='uk-card uk-card-body uk-card-default uk-width-large uk-width-1-1'
                                    >
                                        <form>
                                            <>
                                                <div className='form-item'>
                                                    <label
                                                        className='uk-display-block'
                                                    >
                                                        Email <FaAngleDoubleDown />
                                                    </label>
                                                    <input
                                                        style={{ border: emailInputError ? "2px solid red" : "" }}
                                                        defaultValue={emailAddress}
                                                        type='text'
                                                        name='emailAddress'
                                                        placeholder='Enter email to continue'
                                                        className='uk-width-1-1'
                                                        onChange={((e) => setEmailAddress(e.target.value))}
                                                    />
                                                    {emailInputError ?
                                                        <div
                                                            style={{ color: "red" }}
                                                        >
                                                            A valid email is required to continue
                                                        </div>
                                                        : ''
                                                    }
                                                </div>
                                                <div className='uk-margin uk-text-center'>
                                                    <input
                                                        type='button'
                                                        value='Continue'
                                                        className='uk-button'
                                                        onClick={continueByEmail}
                                                    />
                                                </div>
                                            </>

                                            <div
                                                className='uk-margin uk-text-center'
                                            >
                                                {'OR'}
                                            </div>

                                            <div
                                                className='uk-margin uk-text-center'
                                            >
                                                <input
                                                    type='button'
                                                    value='Sign In'
                                                    className='uk-button'
                                                    onClick={(e) => setStep('login')}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </>
                    }
                </>
            );
    }
}

export default CheckOutProcessor