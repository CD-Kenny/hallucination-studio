import "../styles/index.css";
import Layout from "../components/Layout";
import { groq } from "next-sanity";
import { getClient } from "../utils/sanity";

const query = groq`
  *[_type == "siteConfig"][0]{
    title,
    url,
    lang,
    "logo": {
      "url": logo.asset->url,
      "alt": logo.alt,
    },
    footerText,
    frontpage,
    "mainNavigation": *[_type == "route"][]{
      _key,
      "slug": slug.current,
      "title": page->title,
    },
    "footerNavigation": *[_type == "route"][]{
      _key,
      "slug": slug.current,
      "title": page->title,
    },
  }
`;

function MyApp({ Component, pageProps, siteConfig }) {
  return (
    <Layout siteConfig={siteConfig}>
      <Component {...pageProps} />
    </Layout>
  );
}
MyApp.getInitialProps = async (ctx) => {
  const siteConfig = await getClient().fetch(query);
  console.log("getStaticProps", { siteConfig });
  return {
    siteConfig,
  };
};

export default MyApp;
