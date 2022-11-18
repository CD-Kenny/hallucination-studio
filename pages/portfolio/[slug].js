import Error from "next/error";
import { groq } from "next-sanity";
import { useRouter } from "next/router";
import ProductPage from "../../components/ProductPage";
import { getClient, usePreviewSubscription } from "../../utils/sanity";

const query = groq`*[_type == "product" && slug.current == $slug][0]`;

function PortfolioItemPageContainer({ portfolioItemData, preview }) {
  const router = useRouter();
  if (!router.isFallback && !portfolioItemData?.slug) {
    return <Error statusCode={404} />;
  }

  const { data: item = {} } = usePreviewSubscription(query, {
    params: { slug: portfolioItemData?.slug?.current },
    initialData: portfolioItemData,
    enabled: preview || router.query.preview !== null,
  });

  const {
    _id,
    title,
    defaultProductVariant,
    mainImage,
    blurb,
    body,
    tags,
    vendor,
    categories,
    slug,
  } = item;
  return (
    <ProductPage
      id={_id}
      title={title}
      defaultProductVariant={defaultProductVariant}
      mainImage={mainImage}
      blurb={blurb}
      body={body}
      tags={tags}
      vendor={vendor}
      categories={categories}
      slug={slug?.current}
    />
  );
}

export async function getStaticProps({ params, preview = false }) {
  const portfolioItemData = await getClient(preview).fetch(query, {
    slug: params.slug,
  });

  return {
    props: { preview, portfolioItemData },
  };
}

export async function getStaticPaths() {
  const paths = await getClient().fetch(
    `*[_type == "product" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export default PortfolioItemPageContainer;
