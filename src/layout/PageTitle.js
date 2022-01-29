const PageTitle = ({ title }) => {
	return (
		title ?
			<header className='uk-padding-small uk-margin-small uk-margin-remove-top uk-card-primary'
				id='pageTitle'>
				<h1 className='uk-article-title uk-margin-remove-top uk-margin-remove-bottom bold-font uk-text-center uk-text-capitalize'
					style={{ textTransform: 'uppercase' }}>
					{title}
				</h1>
			</header>
			: ''
	)
}
export default PageTitle