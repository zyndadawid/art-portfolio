"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const { locale } = useParams();
  const pathname = usePathname();

  // Determine the alternate locale
  const switchLocale = locale === "en" ? "pl" : "en";

  // Replace the current locale segment in the URL
  const newPathname = pathname.replace(`/${locale}`, `/${switchLocale}`);

  return (
    <div style={{ position: "absolute", top: "10px", right: "10px" }}>
      <Link href={newPathname}>{switchLocale.toUpperCase()}</Link>
    </div>
  );
}
