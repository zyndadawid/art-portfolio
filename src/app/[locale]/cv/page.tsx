"use client";
import { useLocale, useTranslations } from "next-intl";
import { FaFilePdf } from "react-icons/fa";
import cv from "@/data/cv.json";

type TranslatedText = {
  en: string;
  pl: string;
};

type CVEntry = {
  year: string;
  bold: TranslatedText;
  italic: TranslatedText;
  regular: TranslatedText;
};

type CVData = {
  title: { en: string; pl: string };
  entries: CVEntry[];
};

export default function CV() {
  const locale = useLocale() as "en" | "pl";
  const t = useTranslations();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4 mt-10">
      <div className="flex flex-col bg-gray-100 w-full max-w-4xl p-6">
        <div className="flex justify-center w-full mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            {t("cv")}
          </h1>
          <a
            href="/media/Dawid_Zynda_CV.pdf"
            download
            title={t("downloadCV")}
            className="text-gray-800 hover:text-gray-600 ml-3"
          >
            <FaFilePdf className="w-8 h-8" />
          </a>
        </div>

        {(cv as CVData[]).map((section, index) => (
          <section key={index} className="mb-8">
            <h2 className="text-1xl font-semibold text-gray-800 mb-4">
              {section.title[locale]}
            </h2>
            {section.entries.map((entry, index) => (
              <div key={index} className="p-1 border-b border-gray-200">
                <p className="text-gray-800">
                  <span className="font-bold">{entry.year}:</span>{" "}
                  <span className="font-bold">{entry.bold[locale]} </span>
                  <span className="italic">{entry.italic[locale]} </span>
                  <span>{entry.regular[locale]}</span>
                </p>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
