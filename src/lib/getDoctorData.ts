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
}

export async function getDoctorData(): Promise<FullPortfolioData> {
  // Try fetching profile from MySQL database
  const dbRows = await query<any[]>("SELECT * FROM doctor_profile LIMIT 1");

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
      },
      workingHours: typeof row.working_hours === 'string' ? JSON.parse(row.working_hours) : (row.working_hours || DOCTOR_PROFILE.workingHours),
      socials: typeof row.socials === 'string' ? JSON.parse(row.socials) : (row.socials || DOCTOR_PROFILE.socials),
    };

    // Query services from database if available
    const dbServicesRows = await query<any[]>("SELECT * FROM services");
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

    // Query gallery from database if available
    const dbGalleryRows = await query<any[]>("SELECT * FROM gallery");
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

    return {
      doctor: dbDoctorProfile,
      statistics: STATISTICS_DATA,
      specialties: SPECIALTIES_DATA,
      services: inMemoryServices || dbServices || SERVICES_DATA,
      timeline: TIMELINE_DATA,
      testimonials: inMemoryTestimonials || TESTIMONIALS_DATA,
      gallery: inMemoryGallery || dbGallery || GALLERY_DATA,
      blog: BLOG_DATA,
      faqs: FAQ_DATA,
      isDatabaseConnected: true,
    };
  }

  // Fallback to in-memory edited data or doctorData.ts constants
  return {
    doctor: inMemoryDoctorProfile || DOCTOR_PROFILE,
    statistics: STATISTICS_DATA,
    specialties: SPECIALTIES_DATA,
    services: inMemoryServices || SERVICES_DATA,
    timeline: TIMELINE_DATA,
    testimonials: inMemoryTestimonials || TESTIMONIALS_DATA,
    gallery: inMemoryGallery || GALLERY_DATA,
    blog: BLOG_DATA,
    faqs: FAQ_DATA,
    isDatabaseConnected: false,
  };
}
