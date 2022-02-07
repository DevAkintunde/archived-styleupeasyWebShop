import { useState, useEffect } from "react";
import validator from "validator";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { config } from '../../DrupalUrl';
import { FaAngleDoubleDown } from "react-icons/fa";
import Loading from "../../system/Loading";

const siteUrl = config.url.SITE_URL;
const ResetLoginRequestForm = () => {
    const location = useLocation();

    const [error, setError] = useState();
    const [emailAddress, setEmailAddress] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState();

    const [asyncLoadingBoolean, setAsyncLoadingBoolean] = useState(false);
    let notificationPlacement = document.querySelector('#submissionFeedback');

    useEffect(() => {
        if (location.search) {
            setStep('temporaryPass');
            const userDetail = location.search.split('=')[1];
            setEmailAddress(userDetail.split('/')[0]);
            setTempPassword(userDetail.split('/')[1]);
        } else {
            setStep();
            setEmailAddress('');
            setTempPassword('');
        }
    }, [location.search, location.pathname])
    useEffect(() => {
        let resetButton = document.querySelector('#submissionFeedback .noticeText');
        if (resetButton && emailAddress) {
            notificationPlacement.removeChild(resetButton);
        }
    }, [emailAddress, notificationPlacement]);

    useEffect(() => {
        if (validator.isEmpty(emailAddress) && !step) {
            setError({ 'emptyEmail': 'Reset with your email' });
        } else if (!validator.isEmail(emailAddress) && !step) {
            setError({ 'email': 'A valid email is required' });
        } else if ((!validator.isEmail(emailAddress) || validator.isEmpty(tempPassword)) && step === 'temporaryPass') {
            // setError({ 'new': 'Invalid password reset link.' });
            setStep();
        } else if (validator.isEmpty(newPassword) && step === 'temporaryPass') {
            setError({ 'new': 'Enter new password' });
        } else { setError() }
    }, [emailAddress, tempPassword, newPassword, step])

    let sendResetEmail = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            "mail": emailAddress
        })
    };
    let temporaryLogin = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            "name": emailAddress,
            "temp_pass": tempPassword,
            "new_pass": newPassword
        })
    };

    let responseCode = '';
    const onSubmit = (e) => {
        e.preventDefault();
        // console.log(error);
        if (!error) {
            setAsyncLoadingBoolean(true);
            let isMounted = true;
            (step === 'temporaryPass' ?
                fetch(siteUrl + 'user/lost-password-reset?_format=json', temporaryLogin)
                : fetch(siteUrl + 'user/lost-password?_format=json', sendResetEmail)
            ).then((res) => {
                // console.log(res);
                responseCode = res.status;
                if (responseCode === 500 && step === 'temporaryPass') {
                    setAsyncLoadingBoolean(false);
                    let noticeText = document.createElement('div');
                    let noticeTextAtt = document.createAttribute('class');
                    noticeTextAtt.value = 'noticeText';
                    noticeText.setAttributeNode(noticeTextAtt);
                    notificationPlacement.appendChild(noticeText).textContent = 'Password changed. You may now Sign In with your new password';
                }
                return res.json();
            }).then((resJson) => {
                // console.log(resJson);
                // console.log(resJson.message);
                if (isMounted) {
                    setAsyncLoadingBoolean(false);
                    if (notificationPlacement && resJson.message) {
                        let noticeText = document.createElement('div');
                        let noticeTextAtt = document.createAttribute('class');
                        noticeTextAtt.value = 'noticeText';
                        noticeText.setAttributeNode(noticeTextAtt);
                        if (!step) {
                            if (responseCode === 200) {
                                notificationPlacement.appendChild(noticeText).textContent = 'Please check your email for a temporary password that will allow you to sign in and reset your password';
                            } else if (resJson.message.toLowerCase().includes('not found')) {
                                notificationPlacement.appendChild(noticeText).textContent = 'We cannot find you on StyleUpEasy. Please Sign Up for an account';
                            } else {
                                notificationPlacement.appendChild(noticeText).textContent = resJson.message;
                            }
                        } else {
                            if (resJson.message.toLowerCase().includes('not valid')) {
                                notificationPlacement.appendChild(noticeText).textContent = 'Password reset link is invalid. Please use the reset password button again';
                            } else {
                                notificationPlacement.appendChild(noticeText).textContent = resJson.message;
                            }
                        }
                    }
                }
            }).catch((error) => {
                //console.log(error);
            });
        }
    }
    // console.log(emailAddress);
    switch (step) {
        case 'temporaryPass':
            return (
                <div
                    className='uk-margin uk-flex uk-flex-center uk-padding uk-position-relative'
                >
                    <form
                        className='uk-card uk-card-body uk-card-default uk-width-large uk-width-1-1'
                        onSubmit={onSubmit}
                    >
                        <div>
                            <div className='form-item uk-margin'>
                                <label
                                    className='uk-display-block'
                                    htmlFor='newPassword'
                                >
                                    New Password <FaAngleDoubleDown />
                                </label>
                                <input
                                    type='password'
                                    id='newPassword'
                                    placeholder='New Password'
                                    className='uk-width-1-1'
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                {error && error.new ?
                                    <div id='errorNotice'
                                        style={{ color: "red", textAlign: 'center' }} >
                                        {error.new}
                                    </div>
                                    : ''}
                            </div>
                        </div>
                        <div
                            id='submissionFeedback'
                            className='uk-text-center uk-margin'
                        >
                            <input
                                type='submit'
                                value='Change Password'
                                className='uk-button uk-button-primary'
                            />
                        </div>
                        <div
                            className={'uk-margin uk-flex uk-flex-center uk-grid-small'}
                            data-uk-grid>
                            <div><Link
                                to='/sign-in'
                                className='uk-button uk-button-secondary'
                            >
                                Sign In
                            </Link></div>
                            <div><Link
                                to='/sign-in/password-recovery'
                                className='uk-button uk-button-secondary'
                            >
                                Reset Password
                            </Link></div>
                        </div>
                    </form >
                    {
                        asyncLoadingBoolean ?
                            <div className={'uk-overlay uk-overlay-default uk-position-cover'}>
                                < Loading
                                    message='...Signing In'
                                    styling='uk-position-center'
                                /></div > : ''}

                </div >
            );
        default:
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
                                    htmlFor='emailAddress'
                                >
                                    Email <FaAngleDoubleDown />
                                </label>
                                <input
                                    style={{ border: error && error.email ? "2px solid red" : "" }}
                                    type='text'
                                    id='emailAddress'
                                    placeholder='Enter email address'
                                    className='uk-width-1-1'
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                />
                                {error && error.email ?
                                    <div id='errorNotice'
                                        style={{ color: "red", textAlign: 'center' }} >
                                        {error.email}
                                    </div>
                                    : error && error.emptyEmail ?
                                        <div id='errorNotice'
                                            style={{ color: "black", textAlign: 'center' }} >
                                            {error.emptyEmail}
                                        </div>
                                        : ''}
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
                            <div className={'uk-overlay uk-overlay-default uk-position-cover'}>
                                < Loading
                                    message='...generating a password reset link'
                                    styling='uk-position-center'
                                /></div > : ''}

                </div >
            )
    }
}

export default ResetLoginRequestForm