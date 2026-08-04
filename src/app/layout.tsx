import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ScrollProgressProvider } from "../providers/ScrollProgressProvider";
import { DOCTOR_PROFILE, FAQ_DATA, TESTIMONIALS_DATA, BLOG_DATA } from "../constants/doctorData";
import { getDoctorData } from "../lib/getDoctorData";
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

export async function generateMetadata(): Promise<Metadata> {
  const data = await getDoctorData();
  const doctor = data.doctor;

  const title = doctor.seoTitle || `${doctor.name} | ${doctor.title}`;
  const description = doctor.seoDescription || doctor.bio || "Official medical portfolio & dental specialist clinic.";
  const keywordsList = doctor.seoKeywords
    ? doctor.seoKeywords.split(",").map((k) => k.trim())
    : [doctor.name, doctor.title, "Dental Surgeon", "Dental Specialist"];
  const ogImageUrl = doctor.ogImage || doctor.heroImage || "https://aavisstudio.com/wp-content/uploads/2026/07/farzana-khan-mohima.png";

  return {
    metadataBase: new URL("https://doctorsportfolio-zeta.vercel.app"),
    title: title,
    description: description,
    keywords: keywordsList,
    authors: [{ name: doctor.name }],
    creator: doctor.name,
    publisher: `${doctor.name} Dental & Implant Clinic`,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://doctorsportfolio-zeta.vercel.app",
      siteName: `${doctor.name} Portfolio & Clinic`,
      title: title,
      description: description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${doctor.name} - ${doctor.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

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
}
