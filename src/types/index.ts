/**
 * Domain Type Definitions for Doctor Portfolio Architecture
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
  };
  workingHours: {
    days: string;
    hours: string;
  }[];
  socials: {
    platform: 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'instagram';
    url: string;
  }[];
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

export interface AppointmentFormData {
  serviceId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
}

export interface SectionTitleProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}
