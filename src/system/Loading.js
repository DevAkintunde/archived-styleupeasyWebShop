import loadingImage from '../images/load.gif';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Loading = (props) => {
	const location = useLocation();
	//custom styling for the loader
	const styling = props.styling;
	//the message content
	const message = props.message;
	//refresh boolean for out of Ops async operations
	const refresher = props.refresh;
	const [content, setContent] = useState();

	useEffect(() => {
		let isMounted = true;
		setContent(<img
			src={loadingImage}
			style={{ maxHeight: '250px' }}
			alt={'processing'}
		/>);

		if (message) {
			setTimeout(() => {
				if (isMounted) {
					setContent(
						<div id='loadingMessage'
							className='uk-card uk-card-default uk-padding-large uk-margin-top'>
							{message}
							{refresher ?
								<div className='uk-text-center uk-margin-top'>
									<input
										type='button'
										id='triggerAsyncRefresh'
										value='Refresh'
										className='uk-button uk-button-secondary'
										onClick={props.refreshTrigger}
									/>
								</div>
								: ''}
						</div>
					)
				}
			}, 25000)
		} else {
			setTimeout(() => {
				if (isMounted) {
					setContent(
						<div id='loadingMessage'
							className='uk-card uk-card-default uk-padding-large uk-margin-top'>
							{'Oops! Taking longer than expected. Please refresh this page to try again'}
							{refresher ?
								<div className='uk-text-center uk-margin-top'>
									<input
										type='button'
										id='triggerAsyncRefresh'
										value='Refresh'
										className='uk-button uk-button-secondary'
										onClick={props.refreshTrigger}
									/>
								</div>
								: ''}
						</div>
					)
				}
			}, 40000);
		}

		return () => {
			isMounted = false;
		};
	}, [message, location.key, refresher, props.refreshTrigger])

	return (
		<>
			<div
				className={'block-loading-wait uk-flex uk-flex-center uk-flex-middle' + (styling ? (' ' + styling) : '')}
			>
				{content}
			</div>
		</>
	)
}
export default Loading