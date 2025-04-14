"use client";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const rawLocale = useLocale();
  const locale: "en" | "pl" =
    rawLocale === "en" || rawLocale === "pl" ? rawLocale : "en";
  const t = useTranslations();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 8000); // 8 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full-screen video background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/media/event-horizon-vid.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        {/* Button appears after 8 seconds */}
        {showButton && (
          <Link
            href={`/${locale}/portfolio`}
            className="flex items-center justify-center gap-2 mt-8 px-8 py-4 bg-black/50 hover:bg-black/80 transition duration-300 text-white rounded-full shadow-lg font-bold text-xl"
            style={{ animation: "fadeIn 2s ease-in-out forwards" }}
          >
            <span>{t("theoryOfEverything", { defaultValue: "Skip" })}</span>
            <FaArrowRight />
          </Link>
        )}
      </div>
      {/* Inline keyframes (scoped to this component) */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
