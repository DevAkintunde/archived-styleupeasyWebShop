import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SideBarCategory from "../components/sidebar/SideBarCategory";
import { config } from "../DrupalUrl";

const siteJsonUrl = config.url.SITE_JSON_URL
const SideBar = () => {

	const [productCategories, setProductCategories] = useState();
	const [batchedCategories, setBatchedCategories] = useState();
	const alias = 'taxonomy_term/category?filter[status][value]=1&filter[visibility][condition][path]=field_tagged_to_visible_product&filter[visibility][condition][value]=1&sort[sort-level][path]=depth_level&sort[sort-level][direction]=ASC&page[limit]=30';
	const [loopNext, setLoopNext] = useState(siteJsonUrl + alias);
	useEffect(() => {
		let isMounted = true;
		const getProductCategories = async () => {
			const response = await fetch(loopNext, {
				method: 'GET',
				headers: {
					'Accept': 'application/vnd.api+json',
					'Content-type': 'application/vnd.api+json',
				}
			})
			const outputData = await response.json();
			//console.log(outputData)
			if (isMounted && outputData && outputData.data) {
				setBatchedCategories(previous => previous ? (previous.concat(outputData.data)) : outputData.data);
				if (outputData.links && outputData.links.next) {
					setLoopNext(outputData.links.next.href);
				}
			}
		}
		getProductCategories();

		return () => {
			isMounted = false;
		};
	}, [loopNext])

	//console.log(productCategories)

	useEffect(() => {
		setProductCategories(batchedCategories);
	}, [batchedCategories])

	let categoryClass = [];
	let categories = [];
	productCategories && productCategories.length > 0 && productCategories.forEach(term => {
		if (term.attributes.depth_level) {
			if (term.attributes.depth_level === 1) {
				const perClass = {
					'name': term.attributes.name,
					'name_plural': term.attributes.field_term_plural,
					'id': term.id,
					'weight': term.attributes.weight,
					'url': term.links.self.href,
					'path_alias': term.attributes.path.alias,
					'level': term.attributes.depth_level,
					'child': []
				}
				categoryClass.push(perClass);
			} else {
				const perCategory = {
					'name': term.attributes.name,
					'name_plural': term.attributes.field_term_plural,
					'id': term.id,
					'weight': term.attributes.weight,
					'url': term.links.self.href,
					'path_alias': term.attributes.path.alias,
					'parent': term.relationships.parent.data[0].id,
					'level': term.attributes.depth_level,
					'child': []
				}
				categories.push(perCategory);
			}
		}
	});

	//console.log(categoryClass);
	//console.log(categories);

	let categoryIterationCount = 0;
	categories && categoryClass &&
		categories.length > 0 && categoryClass.length > 0
		&& categories.forEach(category => {
			if (category.level > 1) {
				for (let i = 0; i < categories.length; i++) {
					const subNavigator = categories[i];
					if (subNavigator.parent === category.id) {
						category.child.push(subNavigator);
					}
				}
				categoryIterationCount = categoryIterationCount + 1;
			}
		});
	categories && categoryClass &&
		categories.length > 0 && categoryClass.length > 0
		&& categoryIterationCount === categories.length
		&& categories.forEach(category => {
			for (let i = 0; i < categoryClass.length; i++) {
				const navigator = categoryClass[i];
				if (navigator.id === category.parent) {
					navigator.child.push(category);
				}
			}
		});

	return (
		<aside
			className={'uk-width-1-1@s uk-width-1-4@m uk-width-1-5@l uk-flex-last uk-margin-auto'}
			style={{ maxWidth: '480px' }}
		>
			<div className={'uk-card uk-card-default'}>
				<div className='uk-text-center uk-text-lead'>Categories</div>
				<ul className='uk-nav-default uk-nav-divider uk-nav-parent-icon uk-padding'
					style={{
						fontSize: 'larger', borderTop: '5px solid #612E35',
						paddingBottom: '5px', paddingTop: '13px'
					}}
					data-uk-nav>
					{categoryClass && categoryClass.length > 0 ?
						categoryClass.map((category) => {
							return (
								category.child.length > 0 ?
									<li key={category.id} className={'uk-parent'}>
										<SideBarCategory category={category} />
									</li>
									: ''
							)
						})
						: ''}
					<li>
						<Link to={'/category/in-stock'}>
							See All
						</Link>
					</li>
				</ul>
			</div>
		</aside>
	)
}

export default SideBar