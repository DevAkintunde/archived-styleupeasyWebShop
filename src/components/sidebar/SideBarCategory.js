import { Link } from "react-router-dom";
import SideBarCategorySub from "./SideBarCategorySub";

const SideBarCategory = ({ category }) => {

  return (
    category ?
      <>
        <Link to={'/#'}>
          {category.name_plural ? category.name_plural : category.name}
        </Link>
        {category.child.length > 0 ?
          <ul className={'uk-nav-sub uk-nav-default uk-nav-parent-icon'}
            data-uk-nav>{
              category.child.map((subCategory) => {
                return (
                  <li key={subCategory.id}
                    className={'uk-parent uk-position-relative'}
                  >
                    <span><Link to={subCategory.path_alias}
                      className={'uk-position-absolute'}>
                      {subCategory.name_plural ? subCategory.name_plural : subCategory.name}
                    </Link></span>
                    <Link to={subCategory.path_alias} />
                    {subCategory.child.length > 0 ?
                      <SideBarCategorySub category={subCategory.child} />
                      : ''}
                  </li>
                )
              })
            }
            <li>
              <Link to={'/category/' + category.name.toLowerCase()}>
                All {category.name} Items
              </Link>
            </li>
          </ul>
          : ''}
      </>
      : ''
  )
}

export default SideBarCategory