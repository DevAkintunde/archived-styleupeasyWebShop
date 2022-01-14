import { Route, Switch } from 'react-router-dom'
import MainNavigation from './MainNavigation'
import SiteBranding from './SiteBranding'
import SocialMediaHandles from './SocialMediaHandles'
import HomeHeaderContent from '../regions/HomeHeaderContent'

const Header = ({ cartCount }) => {

	return (
		<header className=''>
			<div className='uk-grid-match uk-child-width-expand@s uk-child-width-1-1 pre-content uk-flex-middle' data-uk-grid>
				<div className='uk-width-medium@s uk-width-1-6@s uk-flex uk-flex-middle'>
					<SiteBranding />
				</div>
				<div className={''}>
					<SocialMediaHandles cartCount={cartCount} />
					<MainNavigation />
				</div>
			</div>
			<div className={'uk-margin-top'}>
				<Switch>
					<Route path='/' exact={true}>
						<div className='uk-position-relative z-index-9'>
							<HomeHeaderContent />
						</div>
					</Route>
				</Switch>
			</div>
		</header>
	)
}

export default Header