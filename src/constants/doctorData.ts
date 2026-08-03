import {
  DoctorProfile,
  Specialty,
  MedicalService,
  StatisticItem,
  TimelineItem,
  PatientTestimonial,
  GalleryItem,
  BlogPost,
  FAQItem,
} from "../types";
import { generateMedicalSvgPlaceholder } from "../lib/imagePlaceholders";

export const DOCTOR_PROFILE: DoctorProfile = {
  name: "Dr. Farzana Khan Mohima",
  title: "Lead Dental Surgeon Specialist",
  // heroImage: "https://aavisstudio.com/wp-content/uploads/2026/07/farzana-khan-mohima.png",
  qualifications: [
    "MD - Johns Hopkins University School of Medicine",
    
  ],
  experienceYears: 5,
  patientsTreated: "500+",
  patientSatisfactionRate: 98.4,
  rating: 4.9,
  reviewCount: 42,
  bio: "Dr. Farzana Mohima is a highly skilled dental surgeon with over 5 years of experience in advanced dental procedures.",
  mission: "To provide compassionate, ethical, and high-quality dental care using modern techniques, helping every patient achieve a healthy, confident smile in a comfortable and welcoming environment.",
  vision: "To become a trusted dental care provider recognized for clinical excellence, personalized treatment, and a commitment to improving lifelong oral health in our community.",
  location: {
    address: "Sector 3 , Rabindra Sharani Road, Uttara",
    city: "Dhaka",
    state: "Dhaka",
    zip: "1230",
    googleMapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215707164102!2d-73.98785312341804!3d40.75549297138541!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
  },
  contact: {
    phone: "+880 1531-714840",
    emergencyPhone: "+880 1531-714840",
    email: "fkmohima2@gmail.com",
  },
  workingHours: [
    { days: "Saturday – Thursday", hours: "10:00 AM – 02:00 PM" },
    // { days: "Saturday", hours: "09:00 AM – 01:00 PM (Urgent Care)" },
    // { days: "Sunday", hours: "Closed / Emergency On-Call" },
  ],
  socials: [
    { platform: "linkedin", url: "https://linkedin.com" },
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "facebook", url: "https://www.facebook.com/DrFarzanaDentist" },
    { platform: "youtube", url: "https://youtube.com" },
  ],
};

export const STATISTICS_DATA: StatisticItem[] = [
  {
    id: "stat-1",
    label: "Patients Treated",
    numericValue: 500,
    suffix: "+",
    description: "Satisfied Patient",
    iconName: "Users",
  },
  {
    id: "stat-2",
    label: "Experience",
    numericValue: 5,
    suffix: "+",
    description: "years of clinical experience",
    iconName: "Award",
  },
  {
    id: "stat-3",
    label: "Patient Satisfaction",
    numericValue: 98.4,
    suffix: "%",
    description: "Verified 5-star patient review feedback",
    iconName: "HeartPulse",
  },
  {
    id: "stat-4",
    label: "Expert Medical Care",
    numericValue: 24,
    suffix: "/7",
    description: "Emergency consultation support",
    iconName: "Clock",
  },
];

export const SPECIALTIES_DATA: Specialty[] = [
  {
    id: "spec-1",
    title: "Dental Surgeon",
    iconName: "Activity",
    description: "Advanced catheter-based treatments for coronary artery disease, angioplasty, and stenting.",
    treatments: ["Coronary Angioplasty", "Stent Placement", "Atherectomy", "Fractional Flow Reserve (FFR)"],
  },
  {
    id: "spec-2",
    title: "Preventive Cardiovascular Health",
    iconName: "ShieldCheck",
    description: "Comprehensive risk assessments, lipid management, and personalized hypertension protocols.",
    treatments: ["Advanced Lipid Panel", "Atherosclerosis Prevention", "Hypertension Control", "Metabolic Risk Analysis"],
  },
 
];

export const SERVICES_DATA: MedicalService[] = [
  {
    id: "serv-1",
    title: "Comprehensive Cardiac Consultation",
    shortDescription: "In-depth clinical evaluation including 12-lead ECG, blood pressure mapping, and risk analysis.",
    fullDescription: "A thorough 60-minute diagnostic session evaluating cardiovascular history, lifestyle risk factors, and vital metrics.",
    iconName: "ClipboardList",
    image: generateMedicalSvgPlaceholder("Cardiac Consultation", "Full Evaluation & Diagnostic Mapping", "consultation"),
    keyBenefits: ["Detailed diagnostic report", "Personalized treatment plan", "Same-day ECG analysis"],
    estimatedDuration: "45-60 mins",
    category: "clinical",
  },
  {
    id: "serv-2",
    title: "Coronary Angiography & Stenting",
    shortDescription: "Minimally invasive arterial evaluation and precise stent placement under fluoroscopic guidance.",
    fullDescription: "State-of-the-art radial approach cardiac catheterization ensuring minimal recovery time and optimal blood flow restoration.",
    iconName: "Zap",
    image: generateMedicalSvgPlaceholder("Coronary Stenting", "Advanced Minimally Invasive Procedure", "equipment"),
    keyBenefits: ["Radial access (quick recovery)", "High precision imaging", "Same-day discharge eligible"],
    estimatedDuration: "60-90 mins",
    category: "surgical",
  },
];

export const TIMELINE_DATA: TimelineItem[] = [
  {
    id: "time-1",
    year: "2025-running",
    title: "MPH",
    institution: "Atish Diponkor University of Science & Technology",
    degreeOrRole: "Master of Public Health",
    type: "position",
    description: "Currently pursuing advanced public health studies.",
  },
  {
    id: "time-2",
    year: "2020",
    title: "BDS",
    institution: "Sapporo Dental College & Hospital",
    degreeOrRole: "Bachelor of Dental Surgery",
    type: "residency",
    description: "",
  },
   {
    id: "time-3",
    year: "2025",
    title: "Current Practice",
    institution: "Aveek's Dental & Implant Center",
    degreeOrRole: "Senior Dental Surgeon",
    type: "residency",
    description: "",
  },
  {
    id: "time-4",
    year: "2024",
    title: "Current Practice",
    institution: "My Dentist & Maxillofacial Surgery",
    degreeOrRole: "Senior Dental Surgeon",
    type: "residency",
    description: "",
  },

];

export const TESTIMONIALS_DATA: PatientTestimonial[] = [
  {
    id: "test-1",
    patientName: "Rebeca Sultana",
    patientRoleOrCondition: "Executive patient",
    patientAvatar: generateMedicalSvgPlaceholder("Rebeca S.", "Patient", "patient"),
    rating: 5,
    reviewText: "Dr.Farzana Khan Mohima saved my life when I experienced acute teeth pain. Her prompt diagnosis and treatment were exceptional. ",
    date: "June 14, 2026",
    verifiedGoogleReview: true,
  },
  {
    id: "test-2",
    patientName: "Naim Sheikh",
    patientRoleOrCondition: "teeth stone Patient",
    patientAvatar: generateMedicalSvgPlaceholder("Naim S.", "Patient", "patient"),
    rating: 5,
    reviewText: "I had visited multiple specialists without finding a good doctor for teeth cleaning. Dr. Farzana Khan Mohima is the best doctor I have ever met. She is very professional and caring.",
    date: "May 28, 2026",
    verifiedGoogleReview: true,
  },
   {
    id: "test-3",
    patientName: "Mehedi HAsan Aakib",
    patientRoleOrCondition: "Root Canel Patient",
    patientAvatar: generateMedicalSvgPlaceholder("Naim S.", "Patient", "patient"),
    rating: 4.5,
    reviewText: "I had a root canal treatment done by Dr. Farzana Khan Mohima, and I must say it was a painless experience. She explained the procedure thoroughly and made me feel comfortable throughout.",
    date: "November 28, 2025",
    verifiedGoogleReview: true,
  },
];

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Private Consultation Lounge",
    category: "consultation",
    image: generateMedicalSvgPlaceholder("Consultation Room", "Private & Quiet Patient Suite", "consultation"),
    caption: "Designed with acoustic privacy and soothing ergonomics for relaxed doctor-patient dialogues.",
  },
  {
    id: "gal-2",
    title: "State-of-the-Art Cath Lab",
    category: "equipment",
    image: generateMedicalSvgPlaceholder("Cath Laboratory", "Ultra-Low Dose Fluoroscopy System", "equipment"),
    caption: "Equipped with high-resolution digital imaging systems for millimeter-precise stent placement.",
  },
  {
    id: "gal-3",
    title: "Reception & Hospitality Suite",
    category: "reception",
    image: generateMedicalSvgPlaceholder("Clinic Reception", "Warm & Hospitality-Focused Lounge", "reception"),
    caption: "Minimizing waiting room anxiety with warm interior design and dedicated concierge support.",
  },
];

// export const BLOG_DATA: BlogPost[] = [
//   {
//     id: "blog-1",
//     title: "Understanding Coronary Calcium Scores: When Should You Get Screened?",
//     slug: "understanding-coronary-calcium-scores",
//     category: "Preventive Care",
//     readTime: "5 min read",
//     date: "July 18, 2026",
//     excerpt: "Discover how non-invasive CT coronary calcium scoring detects hidden arterial plaque years before symptoms manifest.",
//     content: "Coronary artery calcium scoring is one of the most effective non-invasive screening tools in modern cardiology...",
//     featuredImage: generateMedicalSvgPlaceholder("Coronary Calcium", "Preventive Heart Health Article", "clinic"),
//     author: {
//       name: "Dr. Marcus Vance, MD",
//       avatar: generateMedicalSvgPlaceholder("Dr. Vance", "Author", "doctor"),
//       role: "Lead Cardiologist",
//     },
//   },
  
// ];

export const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    question: "How often should I visit a dentist?",
    answer: "Most patients should have a dental check-up every six months, although some conditions may require more frequent visits.",
    category: "Appointment",
  },
  {
    id: "faq-2",
    question: "Is scaling harmful for teeth?",
    answer: "No. Professional scaling removes plaque and tartar without damaging healthy teeth when performed correctly.",
    category: "Preparation",
  },
  {
    id: "faq-3",
    question: "Do root canal treatments hurt?",
    answer: "Modern techniques and local anesthesia make root canal treatment much more comfortable than many people expect.",
    category: "Billing",
  },
  {
    id: "faq-4",
    question: "How can I book an appointment?",
    answer: "Simply call us or use the online appointment form.",
    category: "Procedures",
  },
];
