import { DoctorProfile, FAQItem, PatientTestimonial, BlogPost } from "../types";

/**
 * Structured JSON-LD Schemas for Maximum Healthcare SEO & Rich Snippets
 */

export function generatePhysicianSchema(doctor: DoctorProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": "https://drvancecardiology.com/#physician",
    name: doctor.name,
    jobTitle: doctor.title,
    description: doctor.bio,
    telephone: doctor.contact.phone,
    email: doctor.contact.email,
    url: "https://drvancecardiology.com",
    image: "https://aavisstudio.com/wp-content/uploads/2026/07/farzana-khan-mohima.png",
    medicalSpecialty: [
      "Cardiovascular Disease",
      "Interventional Cardiology",
      "Hypertension Management",
    ],
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "Johns Hopkins University School of Medicine",
      },
      {
        "@type": "EducationalOrganization",
        name: "Harvard Medical School",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: doctor.location.address,
      addressLocality: doctor.location.city,
      addressRegion: doctor.location.state,
      postalCode: doctor.location.zip,
      addressCountry: "US",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: doctor.rating.toString(),
      reviewCount: doctor.reviewCount.toString(),
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function generateMedicalClinicSchema(doctor: DoctorProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": "https://drvancecardiology.com/#clinic",
    name: `${doctor.name} - Heart & Vascular Center`,
    url: "https://drvancecardiology.com",
    telephone: doctor.contact.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: doctor.location.address,
      addressLocality: doctor.location.city,
      addressRegion: doctor.location.state,
      postalCode: doctor.location.zip,
      addressCountry: "US",
    },
    openingHoursSpecification: doctor.workingHours.map((wh) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: wh.days.includes("Monday")
        ? ["Monday", "Tuesday", "Wednesday", "Thursday"]
        : ["Friday"],
      opens: "08:00",
      closes: "17:00",
    })),
    medicalSpecialty: "Cardiovascular Disease",
    availableService: [
      {
        "@type": "MedicalProcedure",
        name: "Comprehensive Cardiac Consultation",
      },
      {
        "@type": "MedicalProcedure",
        name: "Coronary Angiography & Stenting",
      },
    ],
  };
}

export function generateReviewSchema(reviews: PatientTestimonial[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: reviews.map((rev, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: rev.patientName,
        },
        datePublished: rev.date,
        reviewBody: rev.reviewText,
        reviewRating: {
          "@type": "Rating",
          ratingValue: rev.rating.toString(),
          bestRating: "5",
        },
      },
    })),
  };
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateArticleSchema(posts: BlogPost[]) {
  return posts.map((post) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Dr. Marcus Vance Cardiology",
    },
  }));
}

export function generateBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://drvancecardiology.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://drvancecardiology.com/#services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "About Doctor",
        item: "https://drvancecardiology.com/#about",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Book Appointment",
        item: "https://drvancecardiology.com/#appointment",
      },
    ],
  };
}

export function generateVideoSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Doctor Marcus Vance - Philosophy of Patient-Centered Cardiology Care",
    description: "Learn about Dr. Vance's approach to interventional cardiology and preventive heart health.",
    thumbnailUrl: ["https://drvancecardiology.com/images/video-thumb.jpg"],
    uploadDate: "2026-01-15T08:00:00+08:00",
    contentUrl: "https://drvancecardiology.com/video/intro.mp4",
  };
}

export function generateOrganizationSchema(doctor: DoctorProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dr. Marcus Vance Heart & Vascular Center",
    url: "https://drvancecardiology.com",
    logo: "https://drvancecardiology.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: doctor.contact.phone,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: ["English"],
    },
  };
}
