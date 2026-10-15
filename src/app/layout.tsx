import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE_URL, SITE_NAME, absolute } from "@/lib/site";
import { siteMeta } from "@/lib/content";

// drmsa.org uses Noto Sans for everything, so every font role points at it.
const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const DESCRIPTION =
  "DRM SA Group leads the adoption of Digital Radio Mondiale (DRM), the ITU-recommended open standard for digital radio, across South Africa and Southern Africa.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DRM South Africa – Digital Radio Mondiale | DRM SA Group",
    template: "%s | DRM SA Group",
  },
  description: DESCRIPTION,
  keywords: [
    "DRM South Africa",
    "Digital Radio Mondiale",
    "digital radio South Africa",
    "DRM SA Group",
    "DRM digital radio",
    "DRM in FM",
    "digital sound broadcasting South Africa",
    "DRM membership",
    "community radio digital",
    "ICASA digital radio",
  ],
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: SITE_NAME,
    title: "DRM South Africa – Digital Radio Mondiale",
    description: DESCRIPTION,
    url: "/",
    images: [{ url: "/images/hero-radios.jpg", width: 1920, height: 2880, alt: "DRM SA Group" }],
  },
  twitter: { card: "summary_large_image", title: "DRM South Africa – Digital Radio Mondiale", description: DESCRIPTION, images: ["/images/hero-radios.jpg"] },
  robots: { index: true, follow: true },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: ["DRM South Africa", "DRM Southern Africa Group", "DRM SA"],
  url: absolute("/"),
  logo: absolute("/images/logo-transparent.png"),
  email: siteMeta.email,
  telephone: siteMeta.phone,
  areaServed: ["ZA", "Southern Africa"],
  sameAs: [siteMeta.linkedin],
  memberOf: { "@type": "Organization", name: "DRM Consortium", url: "https://www.drm.org" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={notoSans.variable}>

      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
