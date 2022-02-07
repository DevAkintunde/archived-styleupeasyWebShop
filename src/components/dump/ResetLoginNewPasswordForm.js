import { useState, useEffect } from "react"
import validator from "validator"
import { Link } from "react-router-dom";
import { config } from '../../DrupalUrl';
import { FaAngleDoubleDown } from "react-icons/fa";
import Loading from "../../system/Loading";

const siteUrl = config.url.SITE_URL;
const ResetLoginNewPasswordForm = () => {

    const [error, setError] = useState();
    const [emailAddress, setEmailAddress] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [asyncLoadingBoolean, setAsyncLoadingBoolean] = useState(false);
    let notificationPlacement = document.querySelector('#submissionFeedback');

    useEffect(() => {
        let resetButton = document.querySelector('#submissionFeedback .noticeText');
        if (resetButton && emailAddress) {
            notificationPlacement.removeChild(resetButton);
        }
    }, [emailAddress, notificationPlacement]);

    useEffect(() => {
        if (!validator.isEmail(emailAddress)) {
            setError({ 'email': 'A valid email is required' });
        } else if (validator.isEmpty(tempPassword)) {
            setError({ 'temp': 'Please use the password reset option to get a temporary password' });
        } else if (validator.isEmpty(newPassword)) {
            setError({ 'new': 'Enter new password' });
        } else { setError() }
    }, [emailAddress, tempPassword, newPassword])

    const onSubmit = (e) => {
        e.preventDefault();

        if (!error) {
            setAsyncLoadingBoolean(true);
            let isMounted = true;

            fetch(siteUrl + 'user/lost-password-reset?_format=json', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    "name": emailAddress,
                    "temp_pass": generatedPassword,
                    "new_pass": newPassword
                }),
            }).then((res) => {
                console.log(res);
                return res.json();
            }).then((resJson) => {
                console.log(resJson);
                console.log(resJson.message);
                if (isMounted) {
                    setAsyncLoadingBoolean(false);
                    if (notificationPlacement && resJson.message) {
                        let noticeText = document.createElement('div');
                        let noticeTextAtt = document.createAttribute('class');
                        noticeTextAtt.value = 'noticeText';
                        noticeText.setAttributeNode(noticeTextAtt);
                        notificationPlacement.appendChild(noticeText).textContent = resJson.message;
                    }
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
                            : ''}
                    </div>
                    <div className='form-item uk-margin'>
                        <label
                            className='uk-display-block'
                            htmlFor='tempPassword'
                        >
                            Temporary Password <FaAngleDoubleDown />
                        </label>
                        <input
                            type='password'
                            id='tempPassword'
                            className='uk-width-1-1'
                            onChange={(e) => setTempPassword(e.target.value)}
                        />
                        {error && error.temp ?
                            <div id='errorNotice'
                                style={{ color: "red", textAlign: 'center' }} >
                                {error.temp}
                            </div>
                            : ''}
                    </div>
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
                            message='...generating a password reset link'
                            styling='uk-position-center'
                        /></div > : ''}

        </div >
    )
}

export default ResetLoginNewPasswordForm