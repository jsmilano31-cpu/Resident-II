import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const indexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: "The Residence II — Light & Layers",
  description:
    "Explore the proposed residence through 41 architectural perspectives: the arrival, shared living spaces, private rooms and covered balcony.",
  robots: { index: indexing, follow: indexing },
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    title: "The Residence II",
    description:
      "A closer look at life ahead. Architectural design presentation.",
    type: "website",
    ...(siteUrl
      ? {
          images: [
            {
              url: "/residence/main-exterior-perspectives-2-1920.webp",
              width: 1920,
              height: 1641,
              alt: "The complete exterior of the proposed residence",
            },
          ],
        }
      : {}),
  },
  twitter: { card: "summary_large_image", title: "The Residence II" },
};
export const viewport: Viewport = {
  themeColor: "#F4F0E8",
  colorScheme: "dark light",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
