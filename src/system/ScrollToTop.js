import { useEffect } from "react";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const ScrollToTop = ({ children, location: { pathname } }) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, [pathname])

  return children || null
}

export default withRouter(ScrollToTop)