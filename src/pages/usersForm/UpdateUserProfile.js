import { useState, useEffect, useContext } from "react";
import { JwtToken, LoggedUID } from "../../App";
import { config } from "../../DrupalUrl";
import { FaAngleDoubleDown } from "react-icons/fa";
import validator from "validator";
import Loading from "../../system/Loading";

const siteJsonUrl = config.url.SITE_JSON_URL;
const UpdateUserProfile = ({ userProfile, setUserProfile, setStep, setUpdateRes }) => {
  const { Uid } = useContext(LoggedUID);
  const { jwtTokenBearer } = useContext(JwtToken);
  // let getPageTitleById = document.getElementById('pageTitle');

  // useEffect(() => {
  //   if (getPageTitleById) {
  //     setTimeout(() => {
  //       getPageTitleById.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'start',
  //         inline: 'start'
  //       });
  //     }, 1000);

  //   };
  // }, [getPageTitleById]);

  const [firstName, setFirstName] = useState(userProfile && userProfile.data &&
    userProfile.data.attributes.field_fname ?
    userProfile.data.attributes.field_fname : '');
  const [lastName, setLastName] = useState(userProfile && userProfile.data &&
    userProfile.data.attributes.field_lname ?
    userProfile.data.attributes.field_lname : '');
  const [phoneNo, setPhoneNo] = useState(userProfile && userProfile.data &&
    userProfile.data.attributes.field_phone_nos ?
    userProfile.data.attributes.field_phone_nos[0] : '');

  //error handling using validator
  const [asyncLoadingBoolean, setAsyncLoadingBoolean] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [phoneNoError, setPhoneNoError] = useState(false);

  useEffect(() => {
    if (!validator.isMobilePhone(phoneNo, 'en-NG')) {
      setPhoneNoError(true);
    } else { setPhoneNoError(false); }
  }, [phoneNo])

  const submitFormData = (e) => {
    e.preventDefault();
    if (validator.isEmpty(firstName)) {
      setFirstNameError(true);
    } else if (phoneNoError === false) {
      setAsyncLoadingBoolean(true);
      setFirstNameError(false);
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
              "field_fname": firstName,
              "field_lname": lastName,
              "field_phone_nos": [phoneNo]
            }
          }
        })
      }).then((res) => {
        if (res.status) {
          setUpdateRes({ 'status': res.status, 'customMessage': 'Profile updated' });
          setUserProfile();
        }
        //return res.json();
        setStep();
      })//.then((resJson) => console.log(resJson))
    }
  }

  return (
    <div className="uk-margin uk-flex uk-flex-center uk-padding uk-position-relative">
      <form
        className='uk-card uk-card-body uk-card-default uk-width-large uk-width-1-1'
        onSubmit={submitFormData}>
        <div className='form-item uk-margin'>
          <label
            className='uk-display-block'
          >First Name <FaAngleDoubleDown />
          </label>
          <input
            style={{ border: firstNameError ? "2px solid red" : "" }}
            name="firstName"
            defaultValue={userProfile && userProfile.data &&
              userProfile.data.attributes.field_fname ?
              userProfile.data.attributes.field_fname : ''}
            type="text"
            placeholder="First Name"
            className='uk-width-1-1'
            required
            onChange={(e) => setFirstName(e.target.value)}
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
            defaultValue={userProfile && userProfile.data &&
              userProfile.data.attributes.field_lname ?
              userProfile.data.attributes.field_lname : ''}
            type="text"
            placeholder="Last Name"
            className='uk-width-1-1'
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className='form-item'>
          <label
            className='uk-display-block'
          >Phone Number <FaAngleDoubleDown />
          </label>
          <input
            style={{ border: phoneNoError ? "2px solid red" : "" }}
            name="PhoneNo"
            defaultValue={userProfile && userProfile.data &&
              userProfile.data.attributes.field_phone_nos ?
              userProfile.data.attributes.field_phone_nos[0] : ''}
            type="text"
            placeholder="Phone Number"
            className='uk-width-1-1'
            onChange={(e) => setPhoneNo(e.target.value)}
          />
          {phoneNoError ? (
            <div style={{ color: "red" }}>
              A valid phone no. is required
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={'uk-margin uk-grid-small uk-flex uk-flex-center'}
          data-uk-grid>
          <div> <input
            onClick={(e) => setStep()}
            type='button'
            value={'Cancel'}
            className={'uk-button'}
          /></div>
          <div><input
            type='submit'
            value={'Submit Update'}
            className={'uk-button uk-button-primary'}
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
  );
}

export default UpdateUserProfile