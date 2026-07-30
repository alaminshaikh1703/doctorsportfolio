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
  if (data.doctor) inMemoryDoctorProfile = { ...DOCTOR_PROFILE, ...inMemoryDoctorProfile, ...data.doctor };
  if (data.services) inMemoryServices = data.services;
  if (data.gallery) inMemoryGallery = data.gallery;
  if (data.testimonials) inMemoryTestimonials = data.testimonials;
}

export async function getDoctorData(): Promise<FullPortfolioData> {
  // Try fetching profile from MySQL database
  const dbRows = await query<any[]>("SELECT * FROM doctor_profile LIMIT 1");

  if (dbRows && dbRows.length > 0) {
    const row = dbRows[0];
    const dbDoctorProfile: DoctorProfile = {
      name: row.name || DOCTOR_PROFILE.name,
      title: row.title || DOCTOR_PROFILE.title,
      heroImage: row.hero_image || DOCTOR_PROFILE.heroImage,
      aboutImage: row.about_image || DOCTOR_PROFILE.aboutImage,
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

    return {
      doctor: dbDoctorProfile,
      statistics: STATISTICS_DATA,
      specialties: SPECIALTIES_DATA,
      services: inMemoryServices || SERVICES_DATA,
      timeline: TIMELINE_DATA,
      testimonials: inMemoryTestimonials || TESTIMONIALS_DATA,
      gallery: inMemoryGallery || GALLERY_DATA,
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
