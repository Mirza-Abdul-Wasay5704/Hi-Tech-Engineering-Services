import type { Metadata } from "next";
import { Archivo, Big_Shoulders, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { COMPANY, SITE_URL } from "@/lib/site";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"] });
const bigShoulders = Big_Shoulders({ variable: "--font-big-shoulders", subsets: ["latin"] });
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY.name} — Elevator Maintenance, Overhauling & Modernization in Karachi`,
    template: `%s | ${COMPANY.name}`,
  },
  description: `${COMPANY.name}: 26+ years of elevator maintenance, mechanical & electrical overhauling, retrofitting and modernization in Karachi, Pakistan. Trusted by Avari Hotel, Pearl Continental, Pakistan Stock Exchange and leading hospitals.`,
  keywords: [
    "elevator maintenance Karachi",
    "lift maintenance Pakistan",
    "elevator modernization",
    "elevator overhauling",
    "elevator spare parts Pakistan",
    "Sigma elevator panel repair",
    "elevator AMC Karachi",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: COMPANY.name,
    title: `${COMPANY.name} — Elevator Engineering, Perfected`,
    description:
      "26+ years of elevator maintenance, overhauling and modernization in Karachi, Pakistan.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.name} — Elevator Engineering, Perfected`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "./" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${bigShoulders.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
