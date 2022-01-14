import { Link } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
//import { config } from '../../DrupalUrl';
//import toast, { Toaster } from 'react-hot-toast';
import Loading from '../../system/Loading'
import { LoggedStatus } from "../../App";
import { FaBan, FaCheckCircle } from 'react-icons/fa';
import { InCartCountTrigger } from '../../App';

const CheckOutProcessedPayment = ({
    approvalUrl,
    headerAuthorization,
    cartToken
}) => {
    const [paymentData, setPaymentData] = useState({});
    const [serverResponse, setServerResponse] = useState();
    const { loggedIn } = useContext(LoggedStatus);
    const [triggerStatusRecheck, setTriggerStatusRecheck] = useState();
    const { setCartCountTrigger } = useContext(InCartCountTrigger);

    useEffect(() => {
        const processedPayment = async () => {
            const response = await fetch(approvalUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-type': 'application/vnd.api+json',
                    'Commerce-Cart-Token': cartToken,
                    'Authorization': headerAuthorization,
                }
            })
            const outputData = await response.json()
            setPaymentData(outputData)
            if (outputData.data && outputData.data.attributes &&
                outputData.data.attributes.state === 'completed') {
                setCartCountTrigger(Date.now());
            }
            //console.log(response)
            //console.log(outputData)
            if (response.status !== 200) {
                setServerResponse(response.statusText)
            }
        }
        processedPayment()

    }, [approvalUrl, headerAuthorization, cartToken,
        triggerStatusRecheck, setCartCountTrigger])

    return (
        <>
            {
                paymentData && paymentData.data ?
                    <>
                        <article className='uk-article'>
                            {
                                paymentData.data.attributes.state === 'completed' ?
                                    <div style={{ fontSize: 'larger' }}>
                                        <FaCheckCircle style={{ fontSize: '50' }} className={'uk-text-success'} />
                                        <p>Your order is completed, you will be notified as soon as your item(s) has been shipped.</p>
                                        {loggedIn !== true ?
                                            <p>Please <span style={{ fontWeight: 'bold' }}>Sign In</span> or see your email for other details. Thank You.</p>
                                            : ''}
                                    </div>
                                    : <div>
                                        <FaBan style={{ fontSize: '50' }} className={'uk-text-warning'} />
                                        <p>Oops! We cannot verify your payment status at the moment. Please click <span style={{ fontWeight: 'bold' }}>Check Order Status</span> below to try again.</p>
                                        <button
                                            onClick={(e) => setTriggerStatusRecheck(Date.now())}
                                            className={'uk-button uk-button-secondary'}
                                        >
                                            Check Order Status
                                        </button>
                                    </div>
                            }
                        </article>
                        <div className='uk-text-center uk-margin-large-top'>
                            {
                                loggedIn === true ?
                                    <Link to={paymentData.data.links.self.href}
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
                    <>{
                        serverResponse ?
                            <>
                                <div className={'uk-margin'}>{serverResponse}</div>
                                <button
                                    onClick={(e) => setTriggerStatusRecheck(Date.now())}
                                    className={'uk-button uk-button-secondary'}
                                >
                                    ReCheck Order Status
                                </button>
                            </>
                            : <Loading message={"Oops! Something went wrong. We're working it out."} />
                    }</>

            }
        </>
    )
}


export default CheckOutProcessedPayment;