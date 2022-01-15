import { useState, useEffect, useContext } from "react"
import validator from "validator"
import { JwtToken, LoggedUID } from "../../App";
import { config } from '../../DrupalUrl';
import { FaAngleDoubleDown } from "react-icons/fa";
import Loading from "../../system/Loading";

//const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const PasswordUpdateForm = ({ setStep, setUserProfile, setUpdateRes }) => {
    const { Uid } = useContext(LoggedUID);
    const { jwtTokenBearer } = useContext(JwtToken);
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

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [error, setError] = useState({});
    const [asyncLoadingBoolean, setAsyncLoadingBoolean] = useState(false);

    useEffect(() => {
        if (validator.isEmpty(currentPassword)) {
            setError({ 'current': 'Provide your current password' });
        } else if (validator.isEmpty(newPassword)) {
            setError({ 'new': 'Enter new password' });
        } else if (validator.isEmpty(repeatedPassword)) {
            setError({ 'repeated': 'Repeated your new password' });
        } else if (!validator.equals(repeatedPassword, newPassword)) {
            setError({ 'repeated': 'Repeated new password is not the same' });
        } else { setError() }
        // else if (!validator.isStrongPassword(newPassword)) {

        // }
    }, [currentPassword, repeatedPassword, newPassword])

    const onSubmit = (e) => {
        e.preventDefault();

        if (!error) {
            setAsyncLoadingBoolean(true);
            fetch(siteJsonUrl + 'user/user/' + Uid, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-type': 'application/vnd.api+json',
                    'Authorization': 'Bearer ' + jwtTokenBearer,
                },
                body: JSON.stringify({
                    "data": {
                        "type": 'user-user',
                        "id": Uid,
                        "attributes": {
                            "pass": {
                                "value": newPassword,
                                "existing": currentPassword
                            }
                        }
                    }
                })
            }).then((res) => {
                setAsyncLoadingBoolean(false);
                if (res.status && res.status === 200) {
                    setUpdateRes({ 'status': res.status, 'customMessage': 'Password updated' });
                    setUserProfile();
                    setStep();
                } else {
                    return res.json();
                }
            }).then((resJson) => {
                let errorRes = '';
                if (resJson && resJson.errors) {
                    errorRes = resJson.errors[0].detail.split(': ')[1];
                    setError({ 'res': errorRes });
                }
            });
        }
    }

    return (
        <>
            <div
                className='uk-margin uk-flex uk-flex-center uk-padding uk-position-relative'
            >
                <form
                    className='uk-card uk-card-body uk-card-default uk-width-large uk-width-1-1'
                    onSubmit={onSubmit}
                >
                    {error && error.res ?
                        <div id='errorNotice'
                            style={{ color: "red", textAlign: 'center' }} >
                            {error.res}
                        </div>
                        : ''}
                    <div className='form-item uk-margin'>
                        <label
                            className='uk-display-block'
                            htmlFor='currentPassword'
                        >
                            Current Password <FaAngleDoubleDown />
                        </label>
                        <input
                            type='password'
                            id='currentPassword'
                            name='currentPassword'
                            placeholder='Current Password'
                            className='uk-width-1-1'
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        {error && error.current ?
                            <div id='errorNotice'
                                style={{ color: "red", textAlign: 'center' }} >
                                {error.current}
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
                            name='password'
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
                    <div className='form-item uk-margin'>
                        <label
                            className='uk-display-block'
                            htmlFor='repeatedPassword'
                        >
                            Repeat New Password <FaAngleDoubleDown />
                        </label>
                        <input
                            type='password'
                            id='repeatedPassword'
                            name='password'
                            placeholder='Enter password'
                            className='uk-width-1-1'
                            onChange={(e) => setRepeatedPassword(e.target.value)}
                        />
                        {error && error.repeated ?
                            <div id='errorNotice'
                                style={{ color: "red", textAlign: 'center' }} >
                                {error.repeated}
                            </div>
                            : ''}
                    </div>
                    <div className={'uk-margin uk-grid-small uk-flex uk-flex-center'}
                        data-uk-grid>
                        <div> <input
                            onClick={() => setStep()}
                            type='button'
                            value={'Cancel'}
                            className={'uk-button'}
                        /></div>
                        <div><input
                            type='submit'
                            value='Change Password'
                            className='uk-button uk-button-primary'
                            disabled={error ? true : false}
                        /></div>
                    </div>
                </form>
                {
                    asyncLoadingBoolean ?
                        <div className={'uk-overlay uk-overlay-default uk-position-cover'}>
                            <Loading
                                styling='uk-position-center'
                            /></div> : ''
                }
            </div>
        </>
    )
}

export default PasswordUpdateForm