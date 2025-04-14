// "use client";
// import Link from "next/link";
// import { useTranslations } from "next-intl";
// import { useParams, usePathname } from "next/navigation";

// export default function Navbar() {
//   const t = useTranslations();
//   const { locale } = useParams();
//   const pathname = usePathname();

//   // Determine the alternate locale
//   const switchLocale = locale === "en" ? "pl" : "en";

//   // Replace the current locale segment in the URL
//   const newPathname = pathname.replace(`/${locale}`, `/${switchLocale}`);

//   return (
//     <>
//       <nav className="flex justify-between items-center min-h-24 p-4 pr-20 bg-gray-200">
//         {/* Left Side: Name */}
//         <div className="flex items-center space-x-4">
//           <span className="font-bold text-gray-800 text-xl">{t("name")}</span>
//         </div>

//         {/* Center: Navigation Links */}
//         <ul className="flex space-x-4">
//           <li>
//             <Link
//               href={`/${locale}/portfolio`}
//               className="text-gray-800 hover:text-gray-600"
//             >
//               {t("portfolio")}
//             </Link>
//           </li>
//           <li>
//             <Link
//               href={`/${locale}/cv`}
//               className="text-gray-800 hover:text-gray-600"
//             >
//               {t("cv")}
//             </Link>
//           </li>
//           <li>
//             <Link
//               href={`/${locale}/contact`}
//               className="text-gray-800 hover:text-gray-600"
//             >
//               {t("contact")}
//             </Link>
//           </li>
//         </ul>
//         <div className="text-gray-800">
//           <Link href={newPathname}>{switchLocale.toUpperCase()}</Link>
//         </div>
//       </nav>
//     </>
//   );
// }
"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";

export default function Navbar() {
  const t = useTranslations();
  const { locale } = useParams();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Determine the alternate locale and update pathname accordingly
  const switchLocale = locale === "en" ? "pl" : "en";
  const newPathname = pathname.replace(`/${locale}`, `/${switchLocale}`);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-200 p-4 flex items-center justify-between shadow-md">
        {/* Left Side: Name */}
        <div className="flex items-center space-x-4">
          <span className="font-bold text-gray-800 text-xl">{t("name")}</span>
        </div>
        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-4">
          <li>
            <Link
              href={`/${locale}/portfolio`}
              className="text-gray-800 hover:text-gray-600"
            >
              {t("portfolio")}
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/cv`}
              className="text-gray-800 hover:text-gray-600"
            >
              {t("cv")}
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/contact`}
              className="text-gray-800 hover:text-gray-600"
            >
              {t("contact")}
            </Link>
          </li>
          <li>
            <Link
              href={newPathname}
              className="text-gray-800 hover:text-gray-600"
            >
              {switchLocale.toUpperCase()}
            </Link>
          </li>
        </ul>
        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-800 focus:outline-none"
          >
            {isOpen ? (
              // Close (X) icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              // Hamburger icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </button>
        </div>
      </nav>
      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-200 p-4 mt-16">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link
                onClick={closeMenu}
                href={`/${locale}/portfolio`}
                className="text-gray-800 hover:text-gray-600"
              >
                {t("portfolio")}
              </Link>
            </li>
            <li>
              <Link
                onClick={closeMenu}
                href={`/${locale}/cv`}
                className="text-gray-800 hover:text-gray-600"
              >
                {t("cv")}
              </Link>
            </li>
            <li>
              <Link
                onClick={closeMenu}
                href={`/${locale}/contact`}
                className="text-gray-800 hover:text-gray-600"
              >
                {t("contact")}
              </Link>
            </li>
            <li>
              <Link
                onClick={closeMenu}
                href={newPathname}
                className="text-gray-800 hover:text-gray-600"
              >
                {switchLocale.toUpperCase()}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
