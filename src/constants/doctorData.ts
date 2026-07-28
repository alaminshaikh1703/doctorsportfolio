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
  title: "Lead Interventional Cardiologist & Cardiovascular Specialist",
  heroImage: "https://aavisstudio.com/wp-content/uploads/2026/07/farzana-khan-mohima.png",
  qualifications: [
    "MD - Johns Hopkins University School of Medicine",
    
  ],
  experienceYears: 4,
  patientsTreated: "500+",
  patientSatisfactionRate: 98.4,
  rating: 4.9,
  reviewCount: 42,
  bio: "Dr. Farzana Mohima  world-renowned Interventional ",
  mission: "To deliver world-class, human-centric cardiovascular health services with absolute medical precision, empathy, and transparent clinical care.",
  vision: "To pioneer preventive cardiac care models that empower patients to live longer, healthier lives free from cardiovascular compromise.",
  location: {
    address: "149 Health Avenue, Suite 400",
    city: "Dhaka",
    state: "Dhaka",
    zip: "10000",
    googleMapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215707164102!2d-73.98785312341804!3d40.75549297138541!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
  },
  contact: {
    phone: "(880) 13352 33 303",
    emergencyPhone: "(880) 13352 33 303",
    email: "consultations@drfarzana.com",
  },
  workingHours: [
    { days: "Monday – Thursday", hours: "08:00 AM – 05:00 PM" },
    { days: "Friday", hours: "08:00 AM – 03:00 PM" },
    { days: "Saturday", hours: "09:00 AM – 01:00 PM (Urgent Care)" },
    { days: "Sunday", hours: "Closed / Emergency On-Call" },
  ],
  socials: [
    { platform: "linkedin", url: "https://linkedin.com" },
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "facebook", url: "https://facebook.com" },
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
    numericValue: 4,
    suffix: "+",
    description: "practice in top hospitals",
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
    year: "2018 - Present",
    title: "Director of Interventional Cardiology",
    institution: "Metropolitan Heart & Vascular Institute, NY",
    degreeOrRole: "Chief Physician & Lead Practitioner",
    type: "position",
    description: "Leading a multi-disciplinary cardiac catheterization lab and managing complex coronary interventions.",
  },
  {
    id: "time-2",
    year: "2014 - 2018",
    title: "Fellowship in Interventional Cardiology",
    institution: "Johns Hopkins Hospital, Baltimore, MD",
    degreeOrRole: "Postdoctoral Clinical Fellow",
    type: "fellowship",
    description: "Specialized training in complex CTO angioplasty, transcatheter aortic valve therapies, and intravascular ultrasound.",
  },
  {
    id: "time-3",
    year: "2011 - 2014",
    title: "Internal Medicine Residency",
    institution: "Massachusetts General Hospital / Harvard Medical School",
    degreeOrRole: "Chief Resident Physician",
    type: "residency",
    description: "Completed intensive inpatient clinical rotations and received the Excellence in Clinical Teaching Award.",
  },
];

export const TESTIMONIALS_DATA: PatientTestimonial[] = [
  {
    id: "test-1",
    patientName: "Robert Sterling",
    patientRoleOrCondition: "Executive & Angioplasty Patient",
    patientAvatar: generateMedicalSvgPlaceholder("Robert S.", "Patient", "patient"),
    rating: 5,
    reviewText: "Dr. Marcus Vance saved my life when I experienced acute chest symptoms. His calm demeanor, extraordinary surgical precision, and meticulous follow-up care made me feel 100% safe. The entire clinic operates like a luxury private retreat.",
    date: "June 14, 2026",
    verifiedGoogleReview: true,
  },
  {
    id: "test-2",
    patientName: "Elena Rostova",
    patientRoleOrCondition: "Preventive Care & Hypertension Patient",
    patientAvatar: generateMedicalSvgPlaceholder("Elena R.", "Patient", "patient"),
    rating: 5,
    reviewText: "I had visited multiple specialists without finding a clear hypertension management plan. Dr. Vance listened attentively, conducted thorough diagnostics, and formulated a custom strategy that normalized my blood pressure within 3 weeks.",
    date: "May 28, 2026",
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

export const BLOG_DATA: BlogPost[] = [
  {
    id: "blog-1",
    title: "Understanding Coronary Calcium Scores: When Should You Get Screened?",
    slug: "understanding-coronary-calcium-scores",
    category: "Preventive Care",
    readTime: "5 min read",
    date: "July 18, 2026",
    excerpt: "Discover how non-invasive CT coronary calcium scoring detects hidden arterial plaque years before symptoms manifest.",
    content: "Coronary artery calcium scoring is one of the most effective non-invasive screening tools in modern cardiology...",
    featuredImage: generateMedicalSvgPlaceholder("Coronary Calcium", "Preventive Heart Health Article", "clinic"),
    author: {
      name: "Dr. Marcus Vance, MD",
      avatar: generateMedicalSvgPlaceholder("Dr. Vance", "Author", "doctor"),
      role: "Lead Cardiologist",
    },
  },
  
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do I schedule an appointment with Dr. Marcus Vance?",
    answer: "You can book directly using our online appointment form on this website, or call our concierge desk at +1 (800) 458-9221 during business hours. Same-day urgent slots are reserved for pressing cardiovascular symptoms.",
    category: "Appointment",
  },
  {
    id: "faq-2",
    question: "What medical documents should I bring to my first cardiac consultation?",
    answer: "Please bring a copy of your current medical history, any recent blood test results (lipid panel, metabolic panel), prior ECGs or echocardiogram reports, and a full list of your active medications.",
    category: "Preparation",
  },
  {
    id: "faq-3",
    question: "Are Dr. Vance's services covered by insurance?",
    answer: "Yes, Dr. Vance participates with major commercial PPO plans and Medicare. Our patient care coordinators will gladly verify your specific plan coverage and pre-authorization requirements prior to your visit.",
    category: "Billing",
  },
  {
    id: "faq-4",
    question: "What is radial artery catheterization and why is it preferred?",
    answer: "Radial artery catheterization enters through the wrist rather than the groin. It significantly reduces bleeding risks, enhances post-procedure comfort, and allows patients to walk and return home much faster.",
    category: "Procedures",
  },
];
