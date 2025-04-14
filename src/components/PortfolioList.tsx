"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FaFilePdf } from "react-icons/fa";
import portfolioData from "@/data/portfolio.json";
import Image from "next/image";

type PortfolioItem = {
  title: { en: string; pl: string };
  link: string;
  slug: string;
};

export default function PortfolioList() {
  const locale = useLocale() as "en" | "pl";
  const t = useTranslations();

  return (
    <>
      <div className="flex justify-center w-full mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          {t("theoryOfEverything")}
        </h1>
        <a
          href="/media/Dawid_Zynda_portfolio.pdf"
          download
          title={t("downloadPortfolio")}
          className="text-gray-800 hover:text-gray-600 ml-3"
        >
          <FaFilePdf className="w-8 h-8" />
        </a>
      </div>
      <div className="max-w-screen-md mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {(portfolioData as PortfolioItem[]).map((item, index) => (
          <Link key={index} href={`/${locale}/portfolio/${item.slug}`}>
            <div className="border rounded p-4 hover:shadow-lg">
              <Image
                src={item.link}
                alt={item.title[locale]}
                className="w-full h-auto object-cover mb-2"
                width={1920}
                height={1080}
              />
              <h2 className="text-base font-bold text-gray-800">
                {item.title[locale]}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
