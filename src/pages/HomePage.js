import { JsonLd } from "react-schemaorg";
import HomeFeaturedBlock from "../blocks/homepage/HomeFeaturedBlock";
import HomeNewArrivalBlock from "../blocks/homepage/HomeNewArrivalBlock";
import HomeTrendingBlock from "../blocks/homepage/HomeTrendingBlock";
import HomeBlogPreviewBlock from "../blocks/homepage/HomeBlogPreviewBlock";
import { config } from "../DrupalUrl";
import siteLogoImage from '../images/logo.png';

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
          keywords: ['product', 'style', 'fashion', 'makeover', 'beauty']
        }}
      />
      <div>
        <HomeNewArrivalBlock />
        <HomeFeaturedBlock />
        <div className={'uk-margin-auto'}
          style={{ paddingLeft: '40px', paddingRight: '40px' }}>
          <HomeTrendingBlock />
          <HomeBlogPreviewBlock />
        </div>
      </div>
    </>
  )
}

export default HomePage