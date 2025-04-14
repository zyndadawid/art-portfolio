"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";

type Lang = {
  en: string;
  pl: string;
};

type WorkObject = {
  slug: string;
  media: string[];
  title: Lang;
};

type Work = string | WorkObject;

type PortfolioDetailProps = {
  data: {
    title: Lang;
    media: Work[];
    description?: Lang;
    dimensions?: string;
    materials?: Lang;
    technique?: Lang;
    year?: string;
  };
};

export default function PortfolioPreview({ data }: PortfolioDetailProps) {
  const rawLocale = useLocale();
  const locale: "en" | "pl" =
    rawLocale === "en" || rawLocale === "pl" ? rawLocale : "en";
  const t = useTranslations();

  // Check if every element in the media array is a string
  const isArrayOfStrings = data.media.every((item) => typeof item === "string");

  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      {/* Full-width wrapper with responsive horizontal padding */}
      <div className=" w-1/2 px-4 py-6">
        {/* Header with back button and title */}
        <div className="flex items-center mb-6 mt-10">
          <Link
            href={`/${locale}/portfolio`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 mr-4"
          >
            <FaArrowLeft className="text-black" />
          </Link>
          <h3 className="text-2xl font-bold text-gray-800">
            {data.title[locale]}
          </h3>
        </div>

        {/* Description and details – left-aligned with full justification */}
        <div className="mb-8">
          {data.description && (
            <p
              className="text-lg text-gray-700 mb-4"
              style={{ textAlign: "justify" }}
            >
              {data.description[locale]}
            </p>
          )}
          <div className="flex flex-wrap flex-col gap-2 mb-4">
            {data.materials && (
              <p className="text-sm text-gray-700">
                <span className="font-bold">{t("materials")}: </span>
                {data.materials[locale]}
              </p>
            )}
            {data.technique && (
              <p className="text-sm text-gray-700">
                <span className="font-bold">{t("technique")}: </span>
                {data.technique[locale]}
              </p>
            )}
            {data.dimensions && (
              <p className="text-sm text-gray-700">
                <span className="font-bold">{t("dimensions")}: </span>
                {data.dimensions}
              </p>
            )}
            {data.year && (
              <p className="text-sm text-gray-700">
                <span className="font-bold">{t("year")}: </span>
                {data.year}
              </p>
            )}
          </div>
        </div>

        {/* Media grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.media.map((item, index) => {
            // Determine the image source: for strings, use them directly;
            // Otherwise, take the first image from the object's media array.
            const imageSrc = isArrayOfStrings
              ? (item as string)
              : (item as WorkObject).media[0];

            // If media items are objects, wrap the image in a Link using their slug.
            if (!isArrayOfStrings) {
              const work = item as WorkObject;
              return (
                <Link
                  key={index}
                  href={`/${locale}/portfolio/${work.slug}`}
                  // Ensure the link does not force a size change on the image.
                  className="block"
                >
                  <Image
                    src={imageSrc}
                    alt={`Slide ${index + 1}`}
                    className="max-w-full h-auto rounded shadow-md"
                    width={1920}
                    height={1080}
                  />
                </Link>
              );
            }
            // Otherwise, if media items are just strings, just render the image.
            return (
              <Image
                key={index}
                src={imageSrc}
                alt={`Slide ${index + 1}`}
                className="max-w-full h-auto rounded shadow-md col-span-2"
                width={1920}
                height={1080}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
