import { Route, Switch } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loading from '../system/Loading';

const HomePage = lazy(() => import('../pages/HomePage'));
const About = lazy(() => import('../pages/About'));
const Blog = lazy(() => import('../pages/Blog'));
const Faq = lazy(() => import('../pages/Faq'));
const Article = lazy(() => import('../pages/nodes/Article'));
const ProductItem = lazy(() => import('../pages/products/ProductItem'));
const Tag = lazy(() => import('../pages/terms/Tag'));
const CheckOut = lazy(() => import('../pages/checkout/CheckOut'));
const LoginPage = lazy(() => import('../pages/usersForm/LoginPage'));
const CartsPage = lazy(() => import('../pages/products/CartsPage'));
const Dashboard = lazy(() => import('../pages/usersLoggedIn/Dashboard'));
const TrackOrder = lazy(() => import('../pages/TrackOrder'));
const NewArrival = lazy(() => import('../pages/NewArrival'));
const ProductTag = lazy(() => import('../pages/terms/ProductTag'));
const Trending = lazy(() => import('../pages/Trending'));
const ProductsByCategory = lazy(() => import('../pages/products/collections/ProductsByCategory'));
const PaymentOptions = lazy(() => import('../pages/PaymentOptions'));
const SearchProductPage = lazy(() => import('../pages/SearchProductPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const Page404 = lazy(() => import('../pages/Page404'));

const PageWrapper = () => {

	return (
		<main id='main-content'
			className={'uk-width-3-4@m uk-width-4-5@l uk-flex-last@m uk-position-relative'}
		>
			<div className={'uk-width-1-1'}>
				<div
					className={'uk-margin-left uk-margin-right uk-margin-remove-left@s uk-margin-remove-right@s'}>
					<Suspense fallback={<Loading />}>
						<Switch>
							<Route path={'/'} exact={true}
								component={HomePage} />
							<Route path={'/about'}
								component={About} />
							<Route path={'/blog'}
								component={Blog} />
							<Route path={'/faq'}
								component={Faq} />
							<Route path={'/how-to-pay'}
								component={PaymentOptions} />
							<Route path={'/new-arrivals'}
								component={NewArrival} />
							<Route path={'/trending'}
								component={Trending} />
							<Route path={'/track-an-order'}
								component={TrackOrder} />
							<Route path={'/search'}
								component={SearchProductPage} />
							<Route path={'/contact'}
								component={ContactPage} />
							<Route path={'/sign-in'}
								component={LoginPage} />
							<Route path='/article/:alias'
								component={Article} />
							<Route path='/browse/:product/:title'
								component={ProductItem} />
							<Route path='/category/:baseCategory'
								component={ProductsByCategory} />
							<Route path='/tags/:alias'
								component={Tag} />
							<Route path='/product-tags/:alias'
								component={ProductTag} />
							<Route path='/checkout/:order'
								component={CheckOut} />
							<Route path='/cart' exact={true}
								component={CartsPage} />
							<Route path='/signed-in'
								component={Dashboard} />
							<Route
								component={Page404} />
						</Switch>
					</Suspense>
				</div>
			</div>
		</main>
	)
}

export default PageWrapper