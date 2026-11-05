import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Dawid Żynda — Theory of Everything", description: "Sculpture, image and motion. Explore the interconnected worlds of Dawid Żynda." };
export default function RootLayout({ children }: {
    children: React.ReactNode;
}) { return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><main id="main">{children}</main></body></html>; }
