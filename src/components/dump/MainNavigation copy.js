import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const siteJsonUri = 'http://localhost/styleupeasy/jsonapi/'

const MainNavigation = () => {
  const [MainMenu, setMainMenu] = useState([])
  useEffect(() => {
    const getMainMenu = async () => {
      const MenuFromServer = await fetchMainMenu()
      setMainMenu(MenuFromServer)
    }

    getMainMenu()
  }, [])
  // Fetch MainMenu
  const fetchMainMenu = async () => {

    const res = await fetch(siteJsonUri + 'menu_items/main', {
      method: 'GET',
      headers: {
        'Content-type': 'application/vnd.api+json',
      },
    })
    console.log(siteJsonUri)
    console.log(res)
    const data = await res.json()
    console.log(data)

    return data
  }
  console.log('whats going on please')
  console.log({ fetchMainMenu })

  return (
    <nav>
      <h4>Version 1.0.0</h4>
      <Link to='/'>Go Back</Link>

      <div className='uk-card uk-card-body uk-float-right'>
        {fetchMainMenu}
      </div>
    </nav>
  )
}

export default MainNavigation

//const DrupalApiRoute = 'menu_items/main'
const apiCall = <JsonCall routeSuffix={'menu_items/main'} iD={'id'} attributeS={'attributes'} />
{ apiCall }