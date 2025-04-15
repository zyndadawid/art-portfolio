import PortfolioDetail from "@/components/PortfolioDetail";
import { notFound } from "next/navigation";

type Props = Promise<{
  slug: string[];
}>;

export default async function PortfolioDetailPage(props: { params: Props }) {
  const { slug } = await props.params;

  const fileSlug = slug.join("-");

  let data;
  try {
    data = (await import(`@/data/${fileSlug}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <PortfolioDetail data={data} />
    </div>
  );
}
