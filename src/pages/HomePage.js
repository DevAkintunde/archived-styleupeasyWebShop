import { JsonLd } from "react-schemaorg";
import { lazy, Suspense } from "react";
import HomeFeaturedBlock from "../blocks/homepage/HomeFeaturedBlock";
import HomeNewArrivalBlock from "../blocks/homepage/HomeNewArrivalBlock";
import { config } from "../DrupalUrl";
import siteLogoImage from '../images/logo.png';

const HomeTrendingBlock = lazy(() => import('../blocks/homepage/HomeTrendingBlock'));
const HomeBlogPreviewBlock = lazy(() => import('../blocks/homepage/HomeBlogPreviewBlock'));
const siteUrl = config.url.SITE_URL;
const HomePage = () => {
  return (
    <>
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: 'Online E-commerce store homepage',
          image: siteLogoImage,
          description: 'Shop with style',
          url: siteUrl,
          author: 'StyleUpEasy',
          keywords: ['product', 'style', 'fashion', 'makeover', 'beauty', 'material', 'ecommerce']
        }}
      />
      <div>
        <HomeNewArrivalBlock />
        <HomeFeaturedBlock />
        <Suspense>
          <div className={'uk-margin-auto'}
            style={{ paddingLeft: '40px', paddingRight: '40px' }}>
            <HomeTrendingBlock />
            <HomeBlogPreviewBlock />
          </div>
        </Suspense>
      </div>
    </>
  )
}
export default HomePage