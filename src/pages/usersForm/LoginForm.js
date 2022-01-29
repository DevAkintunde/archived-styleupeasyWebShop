import { useState, useContext } from "react";
import { useHistory } from 'react-router-dom';
import validator from "validator";
import { Link } from "react-router-dom";
import { config } from '../../DrupalUrl';
import { JwtToken, LoggedStatus } from "../../App";
import { FaAngleDoubleDown } from "react-icons/fa";
//import Loading from "../../system/Loading";

const siteUrl = config.url.SITE_URL;
//const siteJsonUrl = config.url.SITE_JSON_URL;
const LoginForm = ({ destination, isFunction }) => {
    const history = useHistory();
    // console.log(history);
    // console.log(history.goBack);
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

    const { setJwtTokenBearer } = useContext(JwtToken);
    const { loggedIn, setLoggedIn } = useContext(LoggedStatus);
    const [emailInputError, setEmailInputError] = useState(false);
    const [passwordInputError, setPasswordInputError] = useState(false);

    const [emailAddress, setEmailAddress] = useState();
    const [password, setPassword] = useState();
    const [loggingInError, setLoggingInError] = useState('');
    const [processLoggingIn, setProcessLoggingIn] = useState();

    const onSubmit = (e) => {
        e.preventDefault();

        if (!validator.isEmail(emailAddress)) {
            setEmailInputError(true);
        } else if (validator.isEmpty(password)) {
            setPasswordInputError(true);
        } else {
            setEmailInputError(false);
            setPasswordInputError(false);
            setProcessLoggingIn(Date.now());

            fetch(siteUrl + 'user/email-login?_format=json', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    //'withCredentials': true,
                },
                body: JSON.stringify({
                    mail: emailAddress,
                    pass: password,
                })
            }).then((res) => {
                //console.log(res);
                return res.json();
            }).then((resJson) => {
                //console.log(resJson);
                if (resJson) {
                    setProcessLoggingIn();
                    if (resJson.access_token) {
                        setJwtTokenBearer(resJson.access_token);
                        localStorage.setItem('signOnToken', resJson.access_token);
                        //localStorage.setItem('signOutToken', resJson.logout_token);
                        setLoggedIn(true);
                        if (destination && !isFunction) {
                            history.push(destination);
                        } else if (destination && isFunction) {
                            destination();
                        } else if (history.location.search
                            && history.location.search.includes('?destination')) {
                            const thisDestination = history.location.search.split('?destination=')[1];
                            history.push(thisDestination);
                        } else {
                            history.push('/signed-in');
                        }
                    } else if (resJson.message) {
                        setLoggingInError(resJson.message);
                    }
                }
            }).catch((error) => {
                if (error) {
                    setLoggingInError(error);
                    setProcessLoggingIn();
                }
            });
        }
    }

    return (
        <>
            <div
                className='uk-margin uk-flex uk-flex-center uk-padding uk-position-relative'
            >
                {
                    loggedIn === true ?
                        <div
                            className='uk-card uk-card-body uk-card-default uk-width-large uk-width-1-1 uk-text-center'
                        >
                            {'You are already Signed In'}
                        </div>
                        :
                        <>
                            <form
                                className='uk-card uk-card-body uk-card-default uk-width-large uk-width-1-1'
                                onSubmit={onSubmit}
                            >
                                <div>
                                    {
                                        loggingInError ?
                                            <div
                                                className={'uk-margin uk-text-center uk-text-lead'}
                                            >
                                                {loggingInError}
                                            </div>
                                            : ''
                                    }
                                    <div className='form-item'>
                                        <label
                                            className='uk-display-block'
                                        >
                                            Email <FaAngleDoubleDown />
                                        </label>
                                        <input
                                            style={{ border: emailInputError ? "2px solid red" : "" }}
                                            type='text'
                                            name='emailAddress'
                                            required
                                            placeholder='Enter email address'
                                            className='uk-width-1-1'
                                            onChange={(e) => setEmailAddress(e.target.value)}
                                        />
                                        {emailInputError ?
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
                                            style={{ border: passwordInputError ? "2px solid red" : "" }}
                                            type='password'
                                            name='password'
                                            required
                                            placeholder='Enter password'
                                            className='uk-width-1-1'
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        {passwordInputError ?
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
                                </div>
                                <>
                                    <div
                                        className={'uk-flex uk-flex-center uk-flex-middle uk-margin uk-position-relative'}
                                        style={{ minHeight: '40px' }}
                                    >
                                        <input
                                            type={'submit'}
                                            value={'Sign In'}
                                            className={processLoggingIn ? 'submit-loading' : 'uk-button uk-button-primary'}
                                        />
                                    </div>
                                    <div
                                        className={'uk-margin uk-flex uk-flex-center uk-grid-small'}
                                        data-uk-grid>
                                        <div><Link
                                            to='/sign-in/register'
                                            className={'uk-button uk-button-secondary'}
                                        >
                                            Sign Up
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
                        </>
                }
            </div>
        </>
    )
}
export default LoginForm