import ShippingTrack from "../components/ShippingTrack"
import PageTitle from "../layout/PageTitle"


const TrackOrder = () => {
  return (
    <>
      <PageTitle title={'Track Order'} />
      <div className={'uk-padding'}>
        <div className={'uk-card uk-card-body uk-card-default uk-margin'}>
          <ShippingTrack />
        </div>
      </div>
    </>
  )
}

export default TrackOrder