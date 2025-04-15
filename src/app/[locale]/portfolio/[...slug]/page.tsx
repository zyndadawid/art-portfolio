import PortfolioDetail from "@/components/PortfolioDetail";
import { notFound } from "next/navigation";
import type { PageProps } from "next";

export default async function PortfolioDetailPage({
  params,
}: PageProps<{ locale: string; slug: string[] }>) {
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
