/**
 * Domain Type Definitions for Doctor Portfolio Architecture & Appointment System
 */

export interface DoctorProfile {
  name: string;
  title: string;
  heroImage?: string;
  heroImagePublicId?: string;
  aboutImage?: string;
  aboutImagePublicId?: string;
  qualifications: string[];
  experienceYears: number;
  patientsTreated: string; // e.g. "5,000+"
  patientSatisfactionRate: number; // e.g. 98
  rating: number; // 4.9
  reviewCount: number;
  bio: string;
  mission: string;
  vision: string;
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    googleMapsEmbedUrl: string;
  };
  contact: {
    phone: string;
    emergencyPhone: string;
    email: string;
    whatsappNumber?: string;
  };
  workingHours: {
    days: string;
    hours: string;
  }[];
  socials: {
    platform: 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'instagram';
    url: string;
  }[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  ogImagePublicId?: string;
}

export interface Specialty {
  id: string;
  title: string;
  iconName: string;
  description: string;
  treatments: string[];
}

export interface MedicalService {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  image: string;
  imagePublicId?: string;
  keyBenefits: string[];
  estimatedDuration: string;
  category: 'clinical' | 'surgical' | 'preventive' | 'diagnostic';
}

export interface StatisticItem {
  id: string;
  label: string;
  numericValue: number;
  suffix: string;
  description: string;
  iconName: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  institution: string;
  degreeOrRole: string;
  type: 'education' | 'residency' | 'fellowship' | 'award' | 'position';
  description: string;
}

export interface PatientTestimonial {
  id: string;
  patientName: string;
  patientRoleOrCondition: string;
  patientAvatar: string;
  patientAvatarPublicId?: string;
  rating: number; // 1-5
  reviewText: string;
  date: string;
  verifiedGoogleReview: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'clinic' | 'reception' | 'consultation' | 'equipment' | 'certificates';
  image: string;
  imagePublicId?: string;
  caption: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImagePublicId?: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SectionTitleProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

// ============================================================================
// CLINICAL APPOINTMENT SYSTEM RELATIONAL TYPES
// ============================================================================

export interface PatientRecord {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  patientAge?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorEntity {
  id: string;
  name: string;
  specialization: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

export interface ClinicEntity {
  id: string;
  doctorId: string;
  clinicName: string;
  address: string;
  phone: string;
  workingDays: string[];
  openingTime: string;
  closingTime: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

export interface ServiceEntity {
  id: string;
  serviceName: string;
  duration: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

export interface AppointmentSlotEntity {
  id: string;
  clinicId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  bookedCount?: number;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No Show';
export type BookingSource = 'Website' | 'Website + WhatsApp' | 'Admin';
export type AppointmentType = 'Regular' | 'Emergency';

export interface AppointmentRecord {
  id: string;
  appointmentNumber: string; // e.g. APT-20260805-0001
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge?: number;
  doctorId: string;
  doctorName?: string;
  clinicId: string;
  clinicName?: string;
  clinicAddress?: string;
  serviceId: string;
  serviceName?: string;
  appointmentDate: string;
  appointmentSlotId: string;
  appointmentTime: string;
  appointmentType: AppointmentType;
  visited: boolean;
  confirmedAt?: string | null;
  completedAt?: string | null;
  reason?: string;
  status: AppointmentStatus;
  bookingSource: BookingSource;
  adminNote?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentStatusHistory {
  id: string;
  appointmentId: string;
  status: AppointmentStatus;
  changedBy: 'Patient' | 'Admin';
  createdAt: string;
}

export interface AppointmentBookingRequest {
  doctorId: string;
  clinicId: string;
  serviceId: string;
  appointmentDate: string;
  appointmentSlotId: string;
  appointmentTime: string;
  appointmentType: AppointmentType;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge?: number;
  reason?: string;
  bookingSource: BookingSource;
}

export interface FullPortfolioData {
  doctor: DoctorProfile;
  specialties: Specialty[];
  services: MedicalService[];
  statistics: StatisticItem[];
  timeline: TimelineItem[];
  testimonials: PatientTestimonial[];
  gallery: GalleryItem[];
  blog: BlogPost[];
  faqs: FAQItem[];
  isDatabaseConnected?: boolean;
  databaseUrl?: string;
}
