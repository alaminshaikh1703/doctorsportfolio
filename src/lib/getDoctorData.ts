import { query } from "./db";
import {
  DOCTOR_PROFILE,
  STATISTICS_DATA,
  SPECIALTIES_DATA,
  SERVICES_DATA,
  TIMELINE_DATA,
  TESTIMONIALS_DATA,
  GALLERY_DATA,
  BLOG_DATA,
  FAQ_DATA,
} from "../constants/doctorData";
import {
  DoctorProfile,
  StatisticItem,
  Specialty,
  MedicalService,
  TimelineItem,
  PatientTestimonial,
  GalleryItem,
  BlogPost,
  FAQItem,
} from "../types";

export interface FullPortfolioData {
  doctor: DoctorProfile;
  statistics: StatisticItem[];
  specialties: Specialty[];
  services: MedicalService[];
  timeline: TimelineItem[];
  testimonials: PatientTestimonial[];
  gallery: GalleryItem[];
  blog: BlogPost[];
  faqs: FAQItem[];
  isDatabaseConnected: boolean;
}

// Memory cache for runtime admin edits if DB is not configured
let inMemoryDoctorProfile: DoctorProfile | null = null;
let inMemoryServices: MedicalService[] | null = null;
let inMemoryGallery: GalleryItem[] | null = null;
let inMemoryTestimonials: PatientTestimonial[] | null = null;
let inMemoryBlog: BlogPost[] | null = null;

// Fast Server Memory Cache for Lightning Performance (30-second TTL)
let cachedPortfolioData: FullPortfolioData | null = null;
let cacheExpiryTime: number = 0;
const CACHE_TTL_MS = 30000; // 30 seconds cache

export function invalidateDoctorDataCache() {
  cachedPortfolioData = null;
  cacheExpiryTime = 0;
}

export function updateInMemoryData(data: Partial<FullPortfolioData>) {
  if (data.doctor) {
    const updated = { ...DOCTOR_PROFILE, ...inMemoryDoctorProfile, ...data.doctor };
    if (updated.heroImage && typeof updated.heroImage === 'string' && updated.heroImage.startsWith("data:")) {
      updated.heroImage = DOCTOR_PROFILE.heroImage;
    }
    if (updated.aboutImage && typeof updated.aboutImage === 'string' && updated.aboutImage.startsWith("data:")) {
      updated.aboutImage = DOCTOR_PROFILE.aboutImage;
    }
    inMemoryDoctorProfile = updated;
  }
  if (data.services) inMemoryServices = data.services;
  if (data.gallery) inMemoryGallery = data.gallery;
  if (data.testimonials) inMemoryTestimonials = data.testimonials;
  if (data.blog) inMemoryBlog = data.blog;
  invalidateDoctorDataCache();
}

export async function getDoctorData(): Promise<FullPortfolioData> {
  const now = Date.now();
  // Return cached result if valid (Instant < 1ms response)
  if (cachedPortfolioData && now < cacheExpiryTime) {
    return cachedPortfolioData;
  }

  try {
    // Run all MySQL queries in PARALLEL via Promise.all (cuts DB latency from 4s -> ~0.7s)
    const [dbRows, dbServicesRows, dbGalleryRows, dbBlogRows, dbTestimonialRows] = await Promise.all([
      query<any[]>("SELECT * FROM doctor_profile LIMIT 1"),
      query<any[]>("SELECT * FROM services"),
      query<any[]>("SELECT * FROM gallery"),
      query<any[]>("SELECT * FROM blog"),
      query<any[]>("SELECT * FROM testimonials"),
    ]);

    if (dbRows && dbRows.length > 0) {
      const row = dbRows[0];
      const rawHero = row.hero_image;
      const cleanHeroImage = (rawHero && typeof rawHero === 'string' && rawHero.startsWith("data:")) ? DOCTOR_PROFILE.heroImage : (rawHero || DOCTOR_PROFILE.heroImage);

      const rawAbout = row.about_image;
      const cleanAboutImage = (rawAbout && typeof rawAbout === 'string' && rawAbout.startsWith("data:")) ? DOCTOR_PROFILE.aboutImage : (rawAbout || DOCTOR_PROFILE.aboutImage);

      const dbDoctorProfile: DoctorProfile = {
        name: row.name || DOCTOR_PROFILE.name,
        title: row.title || DOCTOR_PROFILE.title,
        heroImage: cleanHeroImage,
        heroImagePublicId: row.hero_image_public_id || undefined,
        aboutImage: cleanAboutImage,
        aboutImagePublicId: row.about_image_public_id || undefined,
        qualifications: typeof row.qualifications === 'string' ? JSON.parse(row.qualifications) : (row.qualifications || DOCTOR_PROFILE.qualifications),
        experienceYears: row.experience_years || DOCTOR_PROFILE.experienceYears,
        patientsTreated: row.patients_treated || DOCTOR_PROFILE.patientsTreated,
        patientSatisfactionRate: row.patient_satisfaction_rate || DOCTOR_PROFILE.patientSatisfactionRate,
        rating: row.rating || DOCTOR_PROFILE.rating,
        reviewCount: row.review_count || DOCTOR_PROFILE.reviewCount,
        bio: row.bio || DOCTOR_PROFILE.bio,
        mission: row.mission || DOCTOR_PROFILE.mission,
        vision: row.vision || DOCTOR_PROFILE.vision,
        seoTitle: row.seo_title || DOCTOR_PROFILE.seoTitle,
        seoDescription: row.seo_description || DOCTOR_PROFILE.seoDescription,
        seoKeywords: row.seo_keywords || DOCTOR_PROFILE.seoKeywords,
        ogImage: row.og_image || DOCTOR_PROFILE.ogImage,
        ogImagePublicId: row.og_image_public_id || undefined,
        location: {
          address: row.address || DOCTOR_PROFILE.location.address,
          city: row.city || DOCTOR_PROFILE.location.city,
          state: row.state || DOCTOR_PROFILE.location.state,
          zip: row.zip || DOCTOR_PROFILE.location.zip,
          googleMapsEmbedUrl: row.google_maps_url || DOCTOR_PROFILE.location.googleMapsEmbedUrl,
        },
        contact: {
          phone: row.phone || DOCTOR_PROFILE.contact.phone,
          emergencyPhone: row.emergency_phone || DOCTOR_PROFILE.contact.emergencyPhone,
          email: row.email || DOCTOR_PROFILE.contact.email,
          whatsappNumber: row.whatsapp_number || DOCTOR_PROFILE.contact.whatsappNumber || row.phone || DOCTOR_PROFILE.contact.phone,
        },
        workingHours: typeof row.working_hours === 'string' ? JSON.parse(row.working_hours) : (row.working_hours || DOCTOR_PROFILE.workingHours),
        socials: typeof row.socials === 'string' ? JSON.parse(row.socials) : (row.socials || DOCTOR_PROFILE.socials),
      };

      let dbServices: MedicalService[] | null = null;
      if (dbServicesRows && dbServicesRows.length > 0) {
        dbServices = dbServicesRows.map((s) => ({
          id: s.id,
          title: s.title,
          shortDescription: s.short_description || "",
          fullDescription: s.full_description || "",
          iconName: s.icon_name || "ClipboardList",
          image: s.image || "",
          imagePublicId: s.image_public_id || undefined,
          keyBenefits: s.key_benefits ? (typeof s.key_benefits === 'string' ? JSON.parse(s.key_benefits) : s.key_benefits) : [],
          estimatedDuration: s.estimated_duration || "45-60 mins",
          category: s.category || "clinical",
        }));
      }

      let dbGallery: GalleryItem[] | null = null;
      if (dbGalleryRows && dbGalleryRows.length > 0) {
        dbGallery = dbGalleryRows.map((g) => ({
          id: g.id,
          title: g.title,
          category: g.category || "clinic",
          image: g.image || "",
          imagePublicId: g.image_public_id || undefined,
          caption: g.caption || "",
        }));
      }

      let dbBlog: BlogPost[] | null = null;
      if (dbBlogRows && dbBlogRows.length > 0) {
        dbBlog = dbBlogRows.map((b) => ({
          id: b.id,
          title: b.title,
          slug: b.slug || b.id,
          category: b.category || "Dental Health",
          readTime: b.read_time || "5 min read",
          date: b.date || "Recent",
          excerpt: b.excerpt || "",
          content: b.content || "",
          featuredImage: b.featured_image || "",
          featuredImagePublicId: b.featured_image_public_id || undefined,
          author: {
            name: b.author_name || DOCTOR_PROFILE.name,
            avatar: DOCTOR_PROFILE.heroImage || "",
            role: b.author_role || DOCTOR_PROFILE.title,
          },
        }));
      }

      let dbTestimonials: PatientTestimonial[] | null = null;
      if (dbTestimonialRows && dbTestimonialRows.length > 0) {
        dbTestimonials = dbTestimonialRows.map((t) => ({
          id: t.id,
          patientName: t.patient_name,
          patientRoleOrCondition: t.patient_role_or_condition || "Patient",
          patientAvatar: t.patient_avatar || "",
          patientAvatarPublicId: t.patient_avatar_public_id || undefined,
          rating: t.rating || 5,
          reviewText: t.review_text || "",
          date: t.date || "",
          verifiedGoogleReview: Boolean(t.verified_google_review),
        }));
      }

      const result: FullPortfolioData = {
        doctor: dbDoctorProfile,
        statistics: STATISTICS_DATA,
        specialties: SPECIALTIES_DATA,
        services: inMemoryServices || dbServices || SERVICES_DATA,
        timeline: TIMELINE_DATA,
        testimonials: inMemoryTestimonials || dbTestimonials || TESTIMONIALS_DATA,
        gallery: inMemoryGallery || dbGallery || GALLERY_DATA,
        blog: inMemoryBlog || dbBlog || BLOG_DATA,
        faqs: FAQ_DATA,
        isDatabaseConnected: true,
      };

      cachedPortfolioData = result;
      cacheExpiryTime = now + CACHE_TTL_MS;
      return result;
    }
  } catch (error) {
    console.warn("Failed to fetch database portfolio data in parallel:", error);
  }

  // Fallback to in-memory edited data or doctorData.ts constants
  const fallbackResult: FullPortfolioData = {
    doctor: inMemoryDoctorProfile || DOCTOR_PROFILE,
    statistics: STATISTICS_DATA,
    specialties: SPECIALTIES_DATA,
    services: inMemoryServices || SERVICES_DATA,
    timeline: TIMELINE_DATA,
    testimonials: inMemoryTestimonials || TESTIMONIALS_DATA,
    gallery: inMemoryGallery || GALLERY_DATA,
    blog: inMemoryBlog || BLOG_DATA,
    faqs: FAQ_DATA,
    isDatabaseConnected: false,
  };

  cachedPortfolioData = fallbackResult;
  cacheExpiryTime = now + 10000; // 10s fallback cache
  return fallbackResult;
}
