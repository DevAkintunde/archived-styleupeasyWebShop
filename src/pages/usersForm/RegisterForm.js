import { useState, useEffect, useContext } from "react";
import validator from "validator";
import { Link, useHistory } from "react-router-dom";
import { config } from '../../DrupalUrl';
import { FaAngleDoubleDown } from "react-icons/fa";
import { JwtToken, LoggedStatus, LoggedUID } from "../../App";
import Loading from "../../system/Loading";

const siteUrl = config.url.SITE_URL
const RegisterForm = () => {
    const history = useHistory();
    let getPageTitleById = document.getElementById('pageTitle');

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

    const { jwtTokenBearer, setJwtTokenBearer } = useContext(JwtToken);
    const { loggedIn } = useContext(LoggedStatus);
    const { setUid } = useContext(LoggedUID);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [repeatedPasswordError, setRepeatedPasswordError] = useState(false);
    const [nameError, setNameError] = useState('');
    const [contactError, setContactError] = useState('');

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [registerRes, setRegisterRes] = useState();
    const [asyncLoadingBoolean, setAsyncLoadingBoolean] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const userToken = async () => {
            const response = await fetch(siteUrl + 'user/email-login?_format=json', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'withCredentials': true,
                },
                body: JSON.stringify({
                    mail: emailAddress,
                    pass: password,
                })
            });
            const resJson = await response.json();
            if (resJson && resJson.access_token && isMounted) {
                setJwtTokenBearer(resJson.access_token);
                localStorage.setItem('signOnToken', resJson.access_token);
            }
        }
        if (registerRes && registerRes.uuid) {
            userToken();
        }
    }, [registerRes, emailAddress, history, password, setJwtTokenBearer]);

    useEffect(() => {
        if (jwtTokenBearer && loggedIn) {
            history.push('/signed-in');
        }
    }, [history, jwtTokenBearer, loggedIn])

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validator.isEmail(emailAddress)) {
            setEmailError(true);
        } else if (validator.isEmpty(password)) {
            setPasswordError(true);
        } else if (!validator.equals(repeatedPassword, password)) {
            setRepeatedPasswordError(true);
        } else if (validator.isEmpty(firstName)) {
            setNameError(true);
        } else if (validator.isEmpty(contactNo)) {
            setContactError(true);
        } else {
            setAsyncLoadingBoolean(true);
            setEmailError(false);
            setPasswordError(false);
            setRepeatedPasswordError(true);
            setContactError(false);
            setNameError(false);
            let isMounted = true;

            fetch(siteUrl + 'user/register?_format=json', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'withCredentials': true,
                },
                body: JSON.stringify({
                    "mail": { "value": emailAddress },
                    "pass": { "value": password },
                    "name": { "value": emailAddress },
                    "field_fname": { "value": firstName },
                    "field_lname": { "value": lastName },
                    "field_phone_nos": { "value": contactNo }
                }),
            }).then((response) => {
                console.log(response);
                if (!response.ok) {
                    return response.json();
                } else {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error('Something went wrong');
                    }
                }
            }).then((resJson) => {
                console.log(resJson);
                if (isMounted) {
                    if (resJson.uuid && resJson.uuid.length > 0) {
                        setRegisterRes(resJson);
                        setUid(resJson.uuid[0].value);
                    }
                    else if (resJson.message &&
                        resJson.message.includes('Unprocessable Entity:')) {
                        setAsyncLoadingBoolean(false);
                        setRegisterRes(resJson);
                    }
                }
            }).catch((error) => {
                //console.log(error);
                let notificationPlacement = document.querySelector('#errorResponse');
                if (notificationPlacement) {
                    notificationPlacement.innerText = error;
                }
                if (asyncLoadingBoolean) {
                    setAsyncLoadingBoolean(false);
                }
            })
        }
    }
    //console.log(registerRes);

    if (registerRes && registerRes.message) {
        let notificationPlacement = document.querySelector('#errorResponse');
        if ((registerRes.message.includes('email')
            || registerRes.message.includes('username'))
            && registerRes.message.includes('taken') && notificationPlacement) {
            let uiLoggedMessage = 'Email is registered. Try signing in to access your account instead.';
            notificationPlacement.innerText = uiLoggedMessage;
        } else if (registerRes.message.includes('field_fname')
            && registerRes.message.includes('null') && notificationPlacement) {
            let uiLoggedMessage = 'Kindly provide a name to register.';
            notificationPlacement.innerText = uiLoggedMessage;
        } else if (registerRes.message.includes('field_phone_nos')
            && registerRes.message.includes('null') && notificationPlacement) {
            let uiLoggedMessage = 'Kindly provide a contact number to reach you.';
            notificationPlacement.innerText = uiLoggedMessage;
        }
        getPageTitleById.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'start'
        });
    }

    return (
        <>
            <div
                className='uk-margin uk-flex uk-flex-center uk-padding uk-position-relative'
            >{!loggedIn ?
                <div>
                    <form
                        className='uk-card uk-card-body uk-card-default uk-width-1-1'
                        onSubmit={onSubmit}
                    >
                        <div>
                            <div id='userPersonalDetail'>
                                <div className='uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s' data-uk-grid>
                                    <div className='form-item'>
                                        <label
                                            className='uk-display-block'
                                            htmlFor='firstName'
                                        >
                                            First Name <FaAngleDoubleDown />
                                        </label>
                                        <input
                                            style={{ border: nameError ? "2px solid red" : "" }}
                                            type='text'
                                            name='firstName'
                                            placeholder='Your name goes here'
                                            className='uk-width-1-1'
                                            defaultValue={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                        {nameError ?
                                            (<div
                                                style={{ color: "red" }}
                                            >
                                                Kindly provide a name
                                            </div>)
                                            : ''
                                        }
                                    </div>
                                    <div className='form-item'>
                                        <label
                                            className='uk-display-block'
                                            htmlFor='lastName'
                                        >
                                            Last Name <FaAngleDoubleDown />
                                        </label>
                                        <input
                                            style={{ border: emailError ? "2px solid red" : "" }}
                                            type='text'
                                            name='lastName'
                                            placeholder='(optional)'
                                            className='uk-width-1-1'
                                            defaultValue={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='form-item uk-margin'>
                                    <label
                                        className='uk-display-block'
                                        htmlFor='contactNo'
                                    >
                                        Contact Number <FaAngleDoubleDown />
                                    </label>
                                    <input
                                        style={{ border: emailError ? "2px solid red" : "" }}
                                        type='text'
                                        name='contactNo'
                                        placeholder='You mobile phone number goes here'
                                        className='uk-width-1-1'
                                        defaultValue={contactNo}
                                        onChange={(e) => setContactNo(e.target.value)}
                                    />
                                    {contactError ?
                                        (<div
                                            style={{ color: "red" }}
                                        >
                                            A contact number is required for delivery of your purchases
                                        </div>)
                                        : ''
                                    }
                                </div>
                                <div id='errorResponse'
                                    style={{ color: 'red', textAlign: 'center' }}
                                ></div>
                            </div>
                            <div className='form-item uk-margin'>
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
                                    defaultValue={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                />
                                {emailError ?
                                    (
                                        <div
                                            style={{ color: "red" }}
                                        >
                                            Email is required to sign in
                                        </div>
                                    )
                                    : ''
                                }
                            </div>
                            <div className='form-item uk-margin'>
                                <label
                                    className='uk-display-block'
                                >
                                    Password <FaAngleDoubleDown />
                                </label>
                                <input
                                    style={{ border: passwordError ? "2px solid red" : "" }}
                                    type='password'
                                    name='password'
                                    placeholder='Enter password'
                                    className='uk-width-1-1'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {passwordError ?
                                    (
                                        <div
                                            style={{ color: "red" }}
                                        >
                                            Password is required to sign in
                                        </div>
                                    )
                                    : ''
                                }
                            </div>
                            <div className='form-item uk-margin'>
                                <label
                                    className='uk-display-block'
                                >
                                    Repeat Password <FaAngleDoubleDown />
                                </label>
                                <input
                                    style={{ border: repeatedPasswordError ? "2px solid red" : "" }}
                                    type='password'
                                    name='password'
                                    placeholder='Enter password'
                                    className='uk-width-1-1'
                                    onChange={(e) => setRepeatedPassword(e.target.value)}
                                />
                                {repeatedPasswordError ?
                                    (
                                        <div
                                            style={{ color: "red" }}
                                        >
                                            Password is not the same.
                                        </div>
                                    )
                                    : ''
                                }
                            </div>
                        </div>
                        <>
                            <div
                                className='uk-text-center'
                            >
                                <input
                                    type='submit'
                                    value='Sign Me Up'
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
                                    Forgotten Password
                                </Link></div>
                            </div>
                        </>
                    </form>
                    {asyncLoadingBoolean ?
                        <div className={'uk-overlay uk-overlay-primary uk-position-cover'}>
                            <Loading
                                styling='uk-position-center'
                            /></div> : ''}
                </div>
                : <div
                    className='uk-text-center'
                >
                    <p>You are Signed In.</p>
                    <input
                        type='button'
                        value='Go to my wall'
                        className='uk-button uk-button-primary'
                    />
                </div>
                }
            </div>
        </>
    )
}
export default RegisterForm