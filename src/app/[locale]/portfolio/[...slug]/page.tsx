import PortfolioDetail from "@/components/PortfolioDetail";
import { notFound } from "next/navigation";

export default async function PortfolioDetailPage(
  props: Promise<{ params: { locale: string; slug: string[] } }>
) {
  const { params } = await props;
  const fileSlug = params.slug.join("-");

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
