import { FaHome } from "react-icons/fa"
import { Link } from "react-router-dom"
import PageTitle from "../layout/PageTitle"

const Page404 = () => {

  return (
    <>
      <PageTitle title={'Oops!'} />
      <div
        className='uk-margin-remove-top uk-margin-large uk-flex uk-flex-center uk-position-relative'
      >
        <div
          className='uk-card uk-card-body uk-card-default uk-width-large uk-width-1-1 uk-text-center'
        >
          <div className='uk-margin'>
            Oops! We cannot find the page you are looking for.
          </div>
          <Link to='/' className='uk-text-lead'>Go to homepage <FaHome /></Link>
        </div>
      </div>
    </>
  )
}

export default Page404