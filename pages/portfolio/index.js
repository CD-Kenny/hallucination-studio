import Error from "next/error";
import { useRouter } from "next/router";
import { getClient, usePreviewSubscription } from "../../utils/sanity";
import ProductsPage from "../../components/ProductsPage";
import { groq } from "next-sanity";

const query = groq`
  *[_type == "product" && defined(slug.current)]
`;

function PortfolioPageContainer({ portfolioData, preview }) {
  const router = useRouter();
  if (!router.isFallback && !portfolioData) {
    return <Error statusCode={404} />;
  }
  const { data: products } = usePreviewSubscription(query, {
    initialData: portfolioData,
    enabled: preview || router.query.preview !== null,
  });

  return <ProductsPage products={products} />;
}

export async function getStaticProps({ params = {}, preview = false }) {
  const portfolioData = await getClient(preview).fetch(query);

  return {
    props: { preview, portfolioData },
  };
}

export default PortfolioPageContainer;
