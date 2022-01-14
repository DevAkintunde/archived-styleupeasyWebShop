import { useState, useEffect } from 'react';

const ShippingTrack = () => {
  const shippingVendors = [
    'Jumia',
    //'Red Star'
  ]
  const [shippingVendor, setShippingVendor] = useState(shippingVendors[0]);
  const [trackDestination, setTrackDestination] = useState();

  const [trackIdInput, setTrackIdInput] = useState('');

  useEffect(() => {
    if (shippingVendor === 'Jumia') {
      const prefix = 'https://packagetracker-services.jumia.com/#/NG/en/package/tracking/';
      setTrackDestination(prefix + trackIdInput);
    } else {
      setTrackDestination();
    }
  }, [shippingVendor, trackIdInput])

  const trackInput = (e) => {
    setTrackIdInput(e.target.value);
  }

  return (
    <>
      <div className={'uk-heading-bullet uk-text-lead uk-margin-small uk-text-center'}
      >Track an Order</div>
      <div
        className={'uk-flex uk-flex-middle uk-flex-center uk-grid-small uk-width-1-1'}
        data-uk-grid>
        <div><input
          type='text'
          placeholder={'Enter Tracking ID'}
          onChange={trackInput}
          style={{ minHeight: '30px' }}
        /></div>
        <select
          name={'shipment-vendors'}
          defaultValue={shippingVendor}
          style={{ height: '25px', borderColor: '#ba6b57', color: '#612e35' }}
          onChange={(e) => setShippingVendor(e.target.value)}
        >
          {shippingVendors.map((vendor, index) => {
            return (
              <option value={vendor} key={index}>{vendor}</option>
            )
          })}
        </select>
        <a
          className={'uk-button uk-margin-left uk-padding-small uk-padding-remove-vertical' + (trackIdInput && trackDestination ? ' uk-button-primary' : ' uk-disabled uk-button-default')}
          href={trackIdInput && trackDestination ? trackDestination : ''}
          target={'_blank'}
          rel={'noreferrer'}
        >Track</a>
      </div>
    </>
  )
}

export default ShippingTrack