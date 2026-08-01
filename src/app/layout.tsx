import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { ScrollProgressProvider } from "../providers/ScrollProgressProvider";
import { DOCTOR_PROFILE, FAQ_DATA, TESTIMONIALS_DATA, BLOG_DATA } from "../constants/doctorData";
import {
  generatePhysicianSchema,
  generateMedicalClinicSchema,
  generateReviewSchema,
  generateFAQSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateVideoSchema,
  generateOrganizationSchema,
} from "../schemas";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://drvancecardiology.com"),
  manifest: "/manifest.json",
  title: {
    default: `${DOCTOR_PROFILE.name} | ${DOCTOR_PROFILE.title}`,
    template: `%s | ${DOCTOR_PROFILE.name}`,
  },
  description: DOCTOR_PROFILE.bio,
  keywords: [
    "Cardiologist NY",
    "Interventional Cardiology",
    "Heart Specialist New York",
    "Coronary Angioplasty",
    "Preventive Heart Care",
    "3D Stress Echocardiogram",
    "Hypertension Management",
    "Dr Marcus Vance",
  ],
  authors: [{ name: DOCTOR_PROFILE.name }],
  creator: DOCTOR_PROFILE.name,
  publisher: "Metropolitan Heart & Vascular Center",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://drvancecardiology.com",
    siteName: `${DOCTOR_PROFILE.name} Portfolio & Cardiology Clinic`,
    title: `${DOCTOR_PROFILE.name} | Top Interventional Cardiologist in NY`,
    description: DOCTOR_PROFILE.bio,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${DOCTOR_PROFILE.name} - Interventional Cardiology Practice`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${DOCTOR_PROFILE.name} | Interventional Cardiologist`,
    description: DOCTOR_PROFILE.bio,
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://drvancecardiology.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const physicianSchema = generatePhysicianSchema(DOCTOR_PROFILE);
  const clinicSchema = generateMedicalClinicSchema(DOCTOR_PROFILE);
  const reviewSchema = generateReviewSchema(TESTIMONIALS_DATA);
  const faqSchema = generateFAQSchema(FAQ_DATA);
  const articleSchema = generateArticleSchema(BLOG_DATA);
  const breadcrumbSchema = generateBreadcrumbSchema();
  const videoSchema = generateVideoSchema();
  const orgSchema = generateOrganizationSchema(DOCTOR_PROFILE);

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* JSON-LD Schemas Embedding for SEO Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="antialiased bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-700 min-h-screen flex flex-col" suppressHydrationWarning>
        <ScrollProgressProvider />
        {children}
      </body>
    </html>
  );
};
