import { Route, Switch } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import About from '../pages/About';
import Blog from '../pages/Blog';
import Faq from '../pages/Faq';
import Article from '../pages/nodes/Article';
import ProductItem from '../pages/products/ProductItem';
import Tag from '../pages/terms/Tag';
import CheckOut from '../pages/checkout/CheckOut';
import LoginPage from '../pages/usersForm/LoginPage';
import CartsPage from '../pages/products/CartsPage';
import Dashboard from '../pages/usersLoggedIn/Dashboard';
import TrackOrder from '../pages/TrackOrder';
import NewArrival from '../pages/NewArrival';
import ProductTag from '../pages/terms/ProductTag';
import Trending from '../pages/Trending';
import ProductsByCategory from '../pages/products/collections/ProductsByCategory';
import PaymentOptions from '../pages/PaymentOptions';
import SearchProductPage from '../pages/SearchProductPage';
import ContactPage from '../pages/ContactPage';

const PageWrapper = () => {

	return (
		<main id='main-content'
			className={'uk-width-3-4@m uk-width-4-5@l uk-flex-last@m uk-position-relative'}
		>
			<div className={'uk-width-1-1'}>
				<div
					className={'uk-margin-left uk-margin-right uk-margin-remove-left@s uk-margin-remove-right@s'}>
					<Switch>
						<Route path={'/'} exact={true}>
							<HomePage />
						</Route>
						<Route path={'/about'}>
							<About />
						</Route>
						<Route path={'/blog'}>
							<Blog />
						</Route>
						<Route path={'/faq'}>
							<Faq />
						</Route>
						<Route path={'/how-to-pay'}>
							<PaymentOptions />
						</Route>
						<Route path={'/new-arrivals'}>
							<NewArrival />
						</Route>
						<Route path={'/trending'}>
							<Trending />
						</Route>
						<Route path={'/track-an-order'}>
							<TrackOrder />
						</Route>
						<Route path={'/search'}>
							<SearchProductPage />
						</Route>
						<Route path={'/contact'}>
							<ContactPage />
						</Route>
						<Route path={'/sign-in'}>
							<LoginPage />
						</Route>
						<Route path='/article/:alias'>
							<Article />
						</Route>
						<Route path='/shop/:product/:title'>
							<ProductItem />
						</Route>
						<Route path='/category/:baseCategory'>
							<ProductsByCategory />
						</Route>
						<Route path='/tags/:alias'>
							<Tag />
						</Route>
						<Route path='/product-tags/:alias'>
							<ProductTag />
						</Route>
						<Route path='/checkout/:order'>
							<CheckOut />
						</Route>
						<Route path='/cart' exact>
							<CartsPage />
						</Route>
						<Route path='/signed-in'>
							<Dashboard />
						</Route>
					</Switch>
				</div>
			</div>
		</main>
	)
}

export default PageWrapper