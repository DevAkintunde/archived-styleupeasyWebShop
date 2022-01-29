import { useState, useEffect, useContext } from "react";
import { JwtToken, LoggedUID } from "../../App";
import { config } from "../../DrupalUrl";
import Loading from "../../system/Loading";
import PageTitle from "../../layout/PageTitle";
import PasswordUpdateForm from "../usersForm/PasswordUpdateForm";
import UpdateUserProfile from "../usersForm/UpdateUserProfile";

const siteJsonUrl = config.url.SITE_JSON_URL;
const UserProfile = () => {
  const { Uid } = useContext(LoggedUID);
  const { jwtTokenBearer } = useContext(JwtToken);
  let getPageTitleById = document.getElementById('pageTitle');

  const [step, setStep] = useState();
  const [userProfile, setUserProfile] = useState();
  const [updateRes, setUpdateRes] = useState();
  const [asyncNotices, setAsyncNotices] = useState();

  useEffect(() => {
    if (getPageTitleById) {
      setTimeout(() => {
        getPageTitleById.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start'
        });
      }, 1000);

    };
  }, [getPageTitleById, step]);

  useEffect(() => {
    let isMounted = true;
    const getUser = async () => {
      const response = await fetch(siteJsonUrl + 'user/user/' + Uid, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
          'Authorization': 'Bearer ' + jwtTokenBearer,
        }
      })
      const outputData = await response.json();
      if (isMounted) {
        setUserProfile(outputData);
      }
    }
    if (!userProfile && Uid) {
      getUser();
    }

    return () => {
      isMounted = false;
    };
  }, [Uid, jwtTokenBearer, userProfile])

  useEffect(() => {
    let isMounted = true;
    if (updateRes && updateRes.status === 200 && isMounted) {
      setAsyncNotices(updateRes.customMessage);
      setUpdateRes();
    }

    return () => {
      isMounted = false;
    };
  }, [setStep, updateRes])
  //console.log(userProfile);

  switch (step) {
    default:
      return (
        <>
          <PageTitle title={'Profile'} />
          <div className='uk-margin uk-padding uk-flex uk-flex-center'>
            <div className=' uk-width-large uk-width-1-1'>
              {asyncNotices ?
                <div className='uk-text-center uk-margin uk-background-secondary'
                >{asyncNotices}
                </div> : ''}
              {userProfile && userProfile.data ?
                <>
                  <div className='uk-card uk-card-default uk-card-body'>
                    <div className='uk-grid-small uk-margin-small' data-uk-grid>
                      <label className='uk-text-muted'>First Name:</label>
                      <div className='uk-text-capitalize uk-margin-remove'
                        style={{ overflowWrap: 'anywhere' }}>
                        {userProfile.data.attributes.field_fname}
                      </div>
                    </div>
                    <div className='uk-grid-small uk-margin-small' data-uk-grid>
                      <label className='uk-text-muted'>Last Name:</label>
                      <div className='uk-text-capitalize uk-margin-remove'
                        style={{ overflowWrap: 'anywhere' }}>
                        {userProfile.data.attributes.field_lname ?
                          userProfile.data.attributes.field_lname
                          : '--'}
                      </div>
                    </div>
                    <div className='uk-grid-small uk-margin-small' data-uk-grid>
                      <label className='uk-text-muted'>Email:</label>
                      <div className='uk-text-lowercase uk-margin-remove'
                        style={{ overflowWrap: 'anywhere' }}>
                        {userProfile.data.attributes.mail}
                      </div>
                    </div>
                    <div className='uk-grid-small uk-margin-small' data-uk-grid>
                      <label className='uk-text-muted'>Phone Nos:</label>
                      <div className='uk-text-capitalize uk-margin-remove'
                        style={{ overflowWrap: 'anywhere' }}>
                        {userProfile.data.attributes.field_phone_nos
                          && userProfile.data.attributes.field_phone_nos.length > 0 ?
                          userProfile.data.attributes.field_phone_nos.map((number, index) => {
                            return (
                              <span key={index}>{number}</span>
                            )
                          })
                          : <span>nil</span>}
                      </div>
                    </div>
                    <div className='uk-grid-small uk-margin-small' data-uk-grid>
                      <label className='uk-text-muted'>Account Status:</label>
                      <div className='uk-text-capitalize uk-margin-remove'
                        style={{ overflowWrap: 'anywhere' }}>
                        {userProfile.data.attributes.status === true ?
                          <span>Active</span>
                          : <span>New/Inactive</span>}
                      </div>
                    </div>
                  </div>
                  <div className={'uk-flex uk-flex-center uk-margin uk-grid-small'}
                    data-uk-grid>
                    <div><input
                      type='button'
                      value={'Update profile'}
                      className={'uk-button uk-button-primary'}
                      onClick={(e) => setStep('editProfile')}
                    /></div>
                    {userProfile && userProfile.data && userProfile.data.attributes.mail ?
                      <div><input
                        type='button'
                        value={'Update Password'}
                        className={'uk-button uk-button-secondary'}
                        onClick={(e) => setStep('updatePassword')}
                      /></div>
                      : ''}
                  </div>
                </>
                : <Loading />}
            </div></div>
        </>
      );
    case 'editProfile':
      return (
        <>
          <PageTitle title={'Update Profile'} />
          <UpdateUserProfile userProfile={userProfile} setUserProfile={setUserProfile}
            setStep={setStep} setUpdateRes={setUpdateRes} />
        </>
      );
    case 'updatePassword':
      return (
        <>
          <PageTitle title={'Update Password'} />
          <PasswordUpdateForm setUserProfile={setUserProfile}
            setStep={setStep} setUpdateRes={setUpdateRes} />
        </>
      )
  }
}

export default UserProfile