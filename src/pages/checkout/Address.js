import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import PropTypes from 'prop-types'
import ngStates from '../../utils/ng-states.json'
import { FaAngleDoubleDown } from 'react-icons/fa';

const Address = ({
  elementName, handleFormData, values, extraValidation,
  previousStep, previousText, submitText
}) => {

  var statesFromJson = [];
  var citiesFromStates = [
    {
      value: 'not_listed',
      label: '-- Not Listed --'
    }
  ];
  const [thisCities, setThisCities] = useState([]);
  const [cityInputted, setCityInputted] = useState(false);
  const [addCustomerCityStyling, setAddCustomerCityStyling] = useState('uk-disabled uk-hidden');

  ngStates && ngStates.forEach((state) => {
    const selectStructure = {
      value: state.id,
      label: state.name,
      cities: state.cities
    };
    statesFromJson.push(selectStructure);
  })
  thisCities && thisCities.length > 0 && thisCities.forEach((city) => {
    const selectStructure = {
      value: city.id,
      label: city.name
    };
    citiesFromStates.push(selectStructure);
  })

  const stateSelected = ((e) => {
    values.state = { 'label': e.label, 'value': e.value };
    setThisCities(e.cities);
    setCityInputted(false);
    let inputCityOther = document.getElementById('inputCityOther');
    if (inputCityOther) {
      inputCityOther.value = '';
      values.unlistedCity = { 'label': '', 'value': '' };
      setAddCustomerCityStyling('uk-disabled uk-hidden');
    }
    let inputCityClear = document.querySelector('#inputCity div[class*="singleValue"]');
    if (inputCityClear) {
      inputCityClear.innerText = 'Select City';
      values.city = { 'label': '', 'value': '' };
      setAddCustomerCityStyling('uk-disabled uk-hidden');
    }
  })

  useEffect(() => {
    if (values.state.value && values.city.value && (values.city.value !== 'not_listed' || values.city.value !== null)) {
      setCityInputted(true);
    } else {
      setCityInputted(false);
    }
  }, [values.state.value, values.city.value])

  const citySelected = ((e) => {
    let inputCityOther = document.getElementById('inputCityOther');
    if (inputCityOther) {
      inputCityOther.value = '';
      values.unlistedCity = { 'label': '', 'value': '' };
      values.city = { 'label': '', 'value': '' };
      setAddCustomerCityStyling('uk-disabled uk-hidden');
    }
    if (e.value === 'not_listed') {
      values.unlistedCity = { 'label': e.label, 'value': e.value };
      setAddCustomerCityStyling('uk-visible');
    } else {
      values.city = { 'label': e.label, 'value': e.value };
      values.unlistedCity = { 'label': '', 'value': '' };
      setAddCustomerCityStyling('uk-disabled uk-hidden');
      setCityInputted(true);
      //console.log(values);
    }
  })
  const customerAddedCity = ((e) => {
    values.city = { 'label': e.target.value, 'value': e.target.value }
    if (e.target.value !== null && e.target.value !== undefined && e.target.value !== '') {
      setCityInputted(true);
    } else {
      setCityInputted(false);
    }
    //console.log(values)
  })

  useEffect(() => {
    if (values.state && ngStates) {
      ngStates.forEach((state) => {
        if (state.name === values.state.label) {
          setThisCities(state.cities);
        }
      })
    }
    if (values.unlistedCity.value) {
      setAddCustomerCityStyling('uk-visible');
    }
  }, [values.state, values.unlistedCity.value])

  const stateCustomStyling = {
    control: (provided, state) => {
      const borderColor = '#dda384';
      return {
        ...provided, borderColor,
        ':hover': {
          borderColor: '#dda384 !important'
        }
      }
    },
    valueContainer: (provided, state) => {
      return {
        ...provided,
        display: 'inline-block',
        textAlign: 'center',
        marginLeft: '36px',
        cursor: 'pointer'
      }
    },
    placeholder: (provided, state) => {
      return {
        ...provided,
        display: 'inline-block'
      }
    },
    singleValue: (provided, state) => {
      return {
        ...provided,
        display: 'inline-flex'
      }
    },
    option: (provided, state) => {
      const backgroundColor = state.isSelected ? '#dda384' : '#fff';
      return {
        ...provided, backgroundColor,
        ':hover': { backgroundColor: state.isSelected ? '' : '#dda38480' },
        cursor: 'pointer'
      }
    },
    indicatorsContainer: (provided, state) => {
      return {
        ...provided,
        cursor: 'pointer'
      }
    }
  }

  return (
    <>
      <div>
        <div className="form-item uk-margin">
          <label htmlFor="inputAddress">Address <FaAngleDoubleDown />
          </label>
          <input
            type="text"
            name={`${elementName}[address_line1]`}
            className="form-control uk-width-1-1"
            id={`${elementName}Address1`}
            placeholder="House 1, Bluebell str"
            defaultValue={values.address_line1}
            onChange={handleFormData("address_line1")}
          />
        </div>
        <div className="form-item uk-margin">
          <label htmlFor="inputState">State <FaAngleDoubleDown />
          </label>
          <Select
            id="inputState"
            name={`${elementName}[administrative_area]`}
            className="uk-width-1-1 uk-text-center"
            styles={stateCustomStyling}
            //defaultInputValue={values.state.label}
            defaultValue={values.state && values.state.value ?
              {
                value: values.state.value,
                label: values.state.label,
                cities: [thisCities]
              }
              : ''
            }
            onChange={stateSelected}
            options={statesFromJson}
            isSearchable={false}
          />
        </div>
        <div className="form-item uk-margin">
          <label htmlFor="inputCity">City <FaAngleDoubleDown />
          </label>
          <Select
            id="inputCity"
            name={`${elementName}[locality]`}
            className="uk-width-1-1 uk-text-center"
            styles={stateCustomStyling}
            defaultValue={values.unlistedCity && values.unlistedCity.value ?
              {
                value: values.unlistedCity.value,
                label: '-- Not Listed --'
              }
              : values.city && values.city.value === 'not_listed' ?
                {
                  value: 'not_listed',
                  label: '-- Not Listed --'
                }
                : values.city && values.city.value ?
                  {
                    value: values.city.value,
                    label: values.city.label
                  }
                  : ''
            }
            onChange={citySelected}
            options={citiesFromStates}
            isSearchable={false}
          />
          <div className='uk-text-center'>(Select 'Not Listed' if your city not available)</div>
          <div className='uk-margin'>
            <label htmlFor="inputCityOther"
              className={addCustomerCityStyling}
            >
              Please add your city <FaAngleDoubleDown />
            </label>
            <input
              id='inputCityOther'
              type='text'
              className={'uk-width-1-1 uk-text-center ' + addCustomerCityStyling}
              defaultValue={
                values.city && values.city.value
                  ? values.city.value
                  : ''}
              onChange={customerAddedCity}
            />
          </div>
        </div>
        <input type={`hidden`} value={`NG`} name={`${elementName}[country_code]`} />
      </div>

      <div className='uk-flex uk-flex-center uk-margin-medium uk-grid-small'
        data-uk-grid>
        <div><button
          type='button'
          className='uk-button uk-button-default'
          onClick={(e) => previousStep()}
        >
          {previousText}
        </button></div>
        {extraValidation && cityInputted === true ?
          <div><button
            type='submit'
            className='uk-button uk-button-primary'
          >
            {submitText}
          </button></div>
          : <div className='uk-padding-small uk-padding-remove-vertical uk-flex uk-flex-middle uk-alert-danger'>
            Incomplete Address
          </div>
        }
      </div>
    </>
  )
}
Address.propTypes = {
  elementName: PropTypes.string.isRequired,
}
export default Address
