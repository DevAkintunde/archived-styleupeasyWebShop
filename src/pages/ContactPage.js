import { config } from "../DrupalUrl";
import { LoggedStatus, LoggedUserName, LoggedUID, JwtToken } from "../App";
import { useState, useContext, useEffect } from "react";
import validator from "validator";
import sanitizeHtml from 'sanitize-html';
import { FaAngleDoubleDown } from "react-icons/fa";
import PageTitle from "../layout/PageTitle";
import { JsonLd } from "react-schemaorg";
import Loading from "../system/Loading";
import { Link, withRouter } from "react-router-dom";

const siteUrl = config.url.SITE_URL;
const siteJsonUrl = config.url.SITE_JSON_URL;
const ContactPage = () => {
  const { loggedIn } = useContext(LoggedStatus);
  const { thisName } = useContext(LoggedUserName);
  const { jwtTokenBearer } = useContext(JwtToken);
  const { Uid } = useContext(LoggedUID);
  const postUrl = siteJsonUrl + 'contact_message/feedback';
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitForm, setSubmitForm] = useState();
  const [step, setStep] = useState();

  useEffect(() => {
    setName(thisName);
    if (Uid && jwtTokenBearer) {
      const loggedInProfile = async () => {
        const response = await fetch(siteJsonUrl + 'user/user/' + Uid, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + jwtTokenBearer,
          }
        })
        const outputData = await response.json();
        //console.log(outputData);
        if (outputData && outputData.data
          && outputData.data.attributes.mail) {
          setEmail(outputData.data.attributes.mail);
        }
      }
      loggedInProfile();
    }
  }, [Uid, jwtTokenBearer, thisName])

  useEffect(() => {
    let isMounted = true;
    const createMessage = async () => {
      const response = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
        },
        body: JSON.stringify({
          "data": {
            "type": "contact_message--feedback",
            "attributes": {
              "mail": email,
              "name": name,
              "subject": subject,
              "message": message
            }
          }
        })
      })
      //const outputData = await response.json();
      //console.log(response);
      if (isMounted &&
        (response.statusText === 'Created' || response.status === 201)) {
        setStep('submitted');
        setSubmitForm();
        setSubject('');
        setMessage('');
      }
      if (!loggedIn) {
        setEmail('')
        setName('');
      }
    }
    if (submitForm) {
      createMessage();
      setStep('loading');
    }

    return () => {
      isMounted = false;
    }
  }, [submitForm, loggedIn, email, message, name, postUrl, subject])

  const [nameInputError, setNameInputError] = useState();
  const [emailInputError, setEmailInputError] = useState();
  const [subjectInputError, setSubjectInputError] = useState();
  const [messageInputError, setMessageInputError] = useState();

  const sendMessage = ((e) => {
    e.preventDefault()
    //console.log(formData.email)
    if (validator.isEmpty(name)) {
      setNameInputError(true);
    } else if (!validator.isEmail(email)) {
      setEmailInputError(true);
    } else if (validator.isEmpty(subject)) {
      setSubjectInputError(true);
    } else if (validator.isEmpty(message)) {
      setMessageInputError(true);
    } else {
      setNameInputError(false);
      setEmailInputError(false);
      setSubjectInputError(false);
      setMessageInputError(false);
      setSubmitForm(Date.now());
    }
  })

  const submitAgain = (e) => {
    setStep();
    // document.getElementById('contact-form').querySelectorAll('input[type=text]').forEach(input => {
    //   input.value = '';
    // })
    // document.getElementById('contact-form').querySelectorAll('textarea').forEach(input => {
    //   input.value = '';
    // })
  }

  switch (step) {
    case 'loading':
      return (
        <>
          <PageTitle title={'Please wait...'} />
          <div
            className='uk-margin-remove-top uk-margin-large uk-flex uk-flex-center uk-position-relative'
          >
            <div
              className='uk-card uk-card-body uk-card-default uk-width-large uk-width-1-1'
            >
              <Loading message={'Oops... this is taking too long. Kindly refresh the page after 30 seconds.'}></Loading>
            </div>
          </div>
        </>
      )

    case 'submitted':
      return (
        <>
          <PageTitle title={'Message sent'} />
          <div
            className='uk-margin-remove-top uk-margin-large uk-flex uk-flex-center uk-position-relative'
          >
            <div
              className='uk-card uk-card-body uk-card-default uk-width-large uk-width-1-1'
            >
              <p>Message has been sent, we will review your mesage and revert soonest.</p>
              <p>Thank you for reaching out to us.</p>
              <div className='uk-margin-top uk-text-center'>
                <input
                  type='button'
                  value='Send another message'
                  className='uk-button'
                  onClick={submitAgain}
                />
              </div>
              <div className='uk-margin-top uk-text-center'>
                <Link
                  to='/new-arrivals'
                  className='uk-button uk-text-capitalize uk-button-primary'
                >See New Arrivals </Link>
              </div>
            </div>
          </div>
        </>
      )

    default:
      return (
        <>
          <JsonLd
            item={{
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: 'StyleUpEasy Contact Page',
              description: 'Submit a simple form to leave us a message.',
              url: siteUrl + 'contact',
              author: 'StyleUpEasy',
              keywords: ['contact', 'product', 'style', 'fashion', 'makeover', 'beauty']
            }}
          />
          <PageTitle title={'Contact Us'} />
          <div
            className='uk-margin-remove-top uk-margin-large uk-flex uk-flex-center uk-position-relative'
          >
            <div
              className='uk-card uk-card-body uk-card-default uk-width-large uk-width-1-1'
            >
              <form id='contact-form'>
                {loggedIn ?
                  <div className='form-item uk-margin-medium'>
                    <div>Name: <span className="uk-text-lead uk-margin-left">{thisName ? thisName : '...'}</span>
                      {nameInputError ?
                        <div
                          style={{ color: "red" }}
                        >
                          Oops! We can't seem to get your name. Hold On.
                        </div>
                        : ''
                      }
                    </div>
                    <div>Email: <span className="uk-text-lead uk-margin-left">{email ? email : '...'}</span>
                      {emailInputError ?
                        <div
                          style={{ color: "red" }}
                        >
                          Please wait, let's find your email address.
                        </div>
                        : ''
                      }
                    </div>

                  </div>
                  : <>
                    <div className='form-item uk-margin-small'>
                      <label
                        htmlFor='contactName'
                        className='uk-display-block'
                      >
                        Name <FaAngleDoubleDown />
                      </label>
                      <input
                        style={{ border: nameInputError ? "2px solid red" : "" }}
                        type='text'
                        id='contactName'
                        placeholder='Your name'
                        className='uk-width-1-1'
                        onChange={((e) => setName(e.target.value))}
                      />
                      {nameInputError ?
                        <div
                          style={{ color: "red" }}
                        >
                          Kindly provide your name
                        </div>
                        : ''
                      }
                    </div>
                    <div className='form-item uk-margin-small'>
                      <label
                        htmlFor='emailAddress'
                        className='uk-display-block'
                      >
                        Email <FaAngleDoubleDown />
                      </label>
                      <input
                        style={{ border: emailInputError ? "2px solid red" : "" }}
                        type='text'
                        id='emailAddress'
                        placeholder='Email address'
                        className='uk-width-1-1'
                        onChange={((e) => setEmail(e.target.value))}
                      />
                      {emailInputError ?
                        <div
                          style={{ color: "red" }}
                        >
                          A valid email is required
                        </div>
                        : ''
                      }
                    </div>
                  </>}
                <div className='form-item uk-margin-small'>
                  <label
                    htmlFor='messageSubject'
                    className='uk-display-block'
                  >
                    Subject <FaAngleDoubleDown />
                  </label>
                  <input
                    style={{ border: subjectInputError ? "2px solid red" : "" }}
                    type='text'
                    id='messageSubject'
                    placeholder='Provide a short text here'
                    className='uk-width-1-1'
                    onChange={((e) => setSubject(e.target.value))}
                  />
                  {subjectInputError ?
                    <div
                      style={{ color: "red" }}
                    >
                      Kindly provide a title/subject summary
                    </div>
                    : ''
                  }
                </div>
                <div className='form-item uk-margin-small'>
                  <label
                    htmlFor='message'
                    className='uk-display-block'
                  >
                    Message <FaAngleDoubleDown />
                  </label>
                  <textarea
                    style={{ border: messageInputError ? "2px solid red" : "" }}
                    type='textarea'
                    id='message'
                    className='uk-width-1-1'
                    onChange={((e) =>
                      setMessage(sanitizeHtml(e.target.value, { allowedTags: [], allowedAttributes: {} })))}
                  >
                  </textarea>
                  {messageInputError ?
                    <div
                      style={{ color: "red" }}
                    >
                      Provide detail for your message to submit.
                    </div>
                    : ''
                  }
                </div>

                <div className='uk-margin uk-text-center'>
                  <input
                    type='button'
                    value='Send'
                    className='uk-button'
                    disabled={message ? false : true}
                    onClick={sendMessage}
                  />
                </div>
              </form>
            </div>
          </div>
        </>
      )
  }
}

export default withRouter(ContactPage)