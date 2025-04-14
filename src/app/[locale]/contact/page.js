"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaInstagram } from "react-icons/fa";

export default function ContactPage() {
  const [showEmail, setShowEmail] = useState(false);
  const email = "zyndadawid@gmail.com";
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {showEmail ? (
        <a
          href={`mailto:${email}`}
          className="text-3xl font-bold text-gray-800"
        >
          {email}
        </a>
      ) : (
        <button
          onClick={() => setShowEmail(true)}
          className="text-3xl font-bold text-gray-800 underline focus:outline-none"
        >
          {t("showEmail")}
        </button>
      )}
      <a
        href="https://www.instagram.com/dawidzynda"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6"
      >
        <FaInstagram className="w-10 h-10 text-gray-800 hover:text-gray-600" />
      </a>
    </div>
  );
}
