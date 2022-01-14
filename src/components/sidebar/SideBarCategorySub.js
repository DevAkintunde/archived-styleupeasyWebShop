import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const SideBarCategorySub = ({ category }) => {
  const location = useLocation();

  return (
    <ul className={'uk-nav-sub uk-nav-default uk-nav-parent-icon'}
      data-uk-nav>{
        category.map((categoryChild) => {
          return (
            <li key={categoryChild.id}
              className={(categoryChild.child.length > 0 ?
                'uk-parent uk-position-relative' : 'uk-position-relative')
                + (location.pathname === categoryChild.path_alias ? ' uk-active' : '')}
            >
              {categoryChild.child.length > 0 ?
                <span><Link to={categoryChild.path_alias}
                  className={'uk-position-absolute'}>
                  {categoryChild.name_plural ? categoryChild.name_plural : categoryChild.name}
                </Link></span>
                : ''}
              <Link to={categoryChild.path_alias}>
                {categoryChild.child.length === 0 ?
                  categoryChild.name_plural ? categoryChild.name_plural : categoryChild.name
                  : ''}
              </Link>
              {categoryChild.child.length > 0 ?
                <SideBarCategorySub category={categoryChild.child} />
                : ''}
            </li>
          )
        })
      }</ul>
  )
}

export default SideBarCategorySub