import { useState, useEffect } from "react"
import validator from "validator"
import { Link } from "react-router-dom";
import { config } from '../../DrupalUrl';
import { FaAngleDoubleDown } from "react-icons/fa";
import Loading from "../../system/Loading";

const siteUrl = config.url.SITE_URL;
const ResetLoginForm = () => {
    // let getPageTitleById = document.getElementById('pageTitle');

    // useEffect(() => {
    //     if (getPageTitleById) {
    //         setTimeout(() => {
    //             getPageTitleById.scrollIntoView({
    //                 behavior: 'smooth',
    //                 block: 'start',
    //                 inline: 'start'
    //             });
    //         }, 1000);

    //     };
    // }, [getPageTitleById]);

    const [emailError, setEmailError] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const [asyncLoadingBoolean, setAsyncLoadingBoolean] = useState(false);
    let notificationPlacement = document.querySelector('#submissionFeedback');

    useEffect(() => {
        let resetButton = document.querySelector('#submissionFeedback .noticeText');
        if (resetButton && emailAddress) {
            notificationPlacement.removeChild(resetButton);
        }
    }, [emailAddress, notificationPlacement]);

    const onSubmit = (e) => {
        e.preventDefault();
        setAsyncLoadingBoolean(true);

        if (!validator.isEmail(emailAddress)) {
            setEmailError(true);
        } else {
            setEmailError(false);
            fetch(siteUrl + 'user/password?_format=json', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    "mail": emailAddress
                }),
            }).then((res) => {
                //console.log(res);
                return res.json();
            }).then((resJson) => {
                //console.log(resJson);
                //console.log(resJson.message);
                setAsyncLoadingBoolean(false);
                if (notificationPlacement && resJson.message) {
                    let noticeText = document.createElement('div');
                    let noticeTextAtt = document.createAttribute('class');
                    noticeTextAtt.value = 'noticeText';
                    noticeText.setAttributeNode(noticeTextAtt);
                    notificationPlacement.appendChild(noticeText).textContent = resJson.message;
                }
            }).catch((error) => {
                //console.log(error);
            });
        }
    }
    return (
        <div
            className='uk-margin uk-flex uk-flex-center uk-padding uk-position-relative'
        >
            <form
                className='uk-card uk-card-body uk-card-default uk-width-large uk-width-1-1'
                onSubmit={onSubmit}
            >
                <div>
                    <div className='form-item'>
                        <label
                            className='uk-display-block'
                        >
                            Email <FaAngleDoubleDown />
                        </label>
                        <input
                            style={{ border: emailError ? "2px solid red" : "" }}
                            type='text'
                            name='emailAddress'
                            placeholder='Enter email address'
                            className='uk-width-1-1'
                            onChange={(e) => setEmailAddress(e.target.value)}
                        />
                        {emailError ?
                            (<div
                                style={{ color: "red" }}
                            >
                                A valid email is required to reset your password
                            </div>)
                            : ''
                        }
                    </div>
                </div>
                <div
                    id='submissionFeedback'
                    className='uk-text-center uk-margin'
                >
                    <input
                        type='submit'
                        value='Reset My Password'
                        className='uk-button uk-button-primary'
                    />
                </div>
                <div
                    className={'uk-margin uk-flex uk-flex-center uk-grid-small'}
                    data-uk-grid>
                    <div><Link
                        to='/sign-in/register'
                        className='uk-button uk-button-secondary'
                    >
                        Sign Up
                    </Link></div>
                    <div><Link
                        to='/sign-in'
                        className='uk-button uk-button-secondary'
                    >
                        Sign In Instead
                    </Link></div>
                </div>
            </form >
            {
                asyncLoadingBoolean ?
                    <div className={'uk-overlay uk-overlay-primary uk-position-cover'}>
                        < Loading
                            styling='uk-position-center'
                        /></div > : ''}

        </div >
    )
}

export default ResetLoginForm