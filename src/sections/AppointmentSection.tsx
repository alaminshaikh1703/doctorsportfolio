"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  Calendar as CalendarIcon,
  MessageSquare,
  FileText,
  AlertCircle,
  Stethoscope,
  Building2,
  User,
  Mail,
  ShieldCheck,
  Download,
  X,
  Sparkles,
} from "lucide-react";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { DOCTOR_PROFILE, SERVICES_DATA } from "../constants/doctorData";
import {
  DoctorProfile,
  MedicalService,
  ClinicEntity,
  AppointmentSlotEntity,
  AppointmentType,
  BookingSource,
} from "../types";
import { fadeUpVariant } from "../animations/variants";

interface AppointmentSectionProps {
  doctor?: DoctorProfile;
  services?: MedicalService[];
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  doctor = DOCTOR_PROFILE,
  services = SERVICES_DATA,
}) => {
  // Clinics & Dynamic Slots state
  const [clinics, setClinics] = useState<ClinicEntity[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<string>("clinic-1");
  const [slots, setSlots] = useState<AppointmentSlotEntity[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Form Fields
  const [patientName, setPatientName] = useState<string>("");
  const [patientPhone, setPatientPhone] = useState<string>("");
  const [patientEmail, setPatientEmail] = useState<string>("");
  const [patientAge, setPatientAge] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>(services[0]?.id || SERVICES_DATA[0].id);
  const [appointmentDate, setAppointmentDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [appointmentSlotId, setAppointmentSlotId] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<AppointmentType>("Regular");
  const [reason, setReason] = useState<string>("");

  // Booking process state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdAppointment, setCreatedAppointment] = useState<any | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Fetch Clinics on mount
  useEffect(() => {
    async function fetchClinics() {
      try {
        const res = await fetch("/api/clinics");
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setClinics(json.data);
          setSelectedClinicId(json.data[0].id);
        }
      } catch (err) {
        console.warn("Failed to fetch clinics, using default clinic.", err);
      }
    }
    fetchClinics();
  }, []);

  // Fetch Available Time Slots whenever selectedClinicId or appointmentDate changes
  useEffect(() => {
    async function fetchSlots() {
      if (!selectedClinicId || !appointmentDate) return;
      setLoadingSlots(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/appointment-slots?clinicId=${selectedClinicId}&date=${appointmentDate}`);
        const json = await res.json();
        if (json.success && json.data) {
          setSlots(json.data);
          const firstAvailable = json.data.find((s: AppointmentSlotEntity) => s.status === "Active");
          if (firstAvailable) {
            setAppointmentSlotId(firstAvailable.id);
            setAppointmentTime(`${firstAvailable.startTime} - ${firstAvailable.endTime}`);
          } else {
            setAppointmentSlotId("");
            setAppointmentTime("");
          }
        }
      } catch (err) {
        console.warn("Failed to fetch appointment slots.", err);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedClinicId, appointmentDate]);

  // Selected Objects
  const selectedClinic = clinics.find((c) => c.id === selectedClinicId) || clinics[0] || {
    id: "clinic-1",
    clinicName: "Mohakhali Specialised Dental Care",
    address: `${doctor.location.address}, ${doctor.location.city}`,
    phone: doctor.contact.phone,
  };
  const selectedService = services.find((s) => s.id === serviceId) || services[0];

  // Atomic Appointment Booking Handler
  const handleBookingSubmit = async (bookingSource: BookingSource) => {
    setErrorMsg(null);

    if (!patientName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!patientPhone.trim()) {
      setErrorMsg("Please enter a valid phone number.");
      return;
    }
    if (!appointmentSlotId) {
      setErrorMsg("Please select an available time slot for your appointment.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        doctorId: "doc-1",
        clinicId: selectedClinicId,
        serviceId,
        appointmentDate,
        appointmentSlotId,
        appointmentTime,
        appointmentType,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim() || undefined,
        patientAge: patientAge ? Number(patientAge) : undefined,
        reason: reason.trim() || undefined,
        bookingSource,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setCreatedAppointment(json.data);
        setShowSuccessModal(true);
      } else {
        setErrorMsg(json.error || "Failed to book appointment. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error submitting appointment request.");
    } finally {
      setSubmitting(false);
    }
  };

  // Build Formatted WhatsApp Message URL
  const buildWhatsappMessageUrl = () => {
    if (!createdAppointment) return "#";
    const rawNumber = doctor.contact.whatsappNumber || doctor.contact.phone || "+8801531714840";
    const cleanNumber = rawNumber.replace(/[^\d]/g, "");

    const msg = 
`Hello Doctor,

I have submitted an appointment request.

Appointment ID: ${createdAppointment.appointmentNumber}
Patient Name: ${createdAppointment.patientName}
Phone: ${createdAppointment.patientPhone}
Doctor: ${createdAppointment.doctorName || doctor.name}
Clinic: ${createdAppointment.clinicName}
Service: ${selectedService?.title || "Dental Consultation"}
Preferred Date: ${createdAppointment.appointmentDate}
Preferred Time: ${createdAppointment.appointmentTime}
Reason: ${createdAppointment.reason || "General Consultation"}

Thank You.`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  // Generate & Trigger Patient PDF Slip Print/Download
  const handleDownloadPDFSlip = () => {
    if (!createdAppointment) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download your appointment slip PDF.");
      return;
    }

    const slipHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Appointment Slip - ${createdAppointment.appointmentNumber}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.5; }
            .ticket { border: 2px solid #2563eb; border-radius: 16px; padding: 30px; max-width: 650px; margin: 0 auto; background: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
            .header { border-b: 2px border-dashed #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; text-align: center; }
            .logo-title { font-size: 22px; font-weight: 800; color: #1e3a8a; margin: 0; }
            .subtitle { font-size: 13px; font-weight: 600; color: #2563eb; text-transform: uppercase; margin-top: 4px; }
            .badge { display: inline-block; background: #dbeafe; color: #1e40af; font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 20px; margin-top: 12px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px; }
            .field { background: #f8fafc; padding: 12px 16px; border-radius: 10px; border: 1px solid #e2e8f0; }
            .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
            .value { font-size: 14px; font-weight: 700; color: #0f172a; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #64748b; border-t: 1px solid #e2e8f0; padding-top: 16px; }
            @media print { body { padding: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h1 class="logo-title">${doctor.name}</h1>
              <div class="subtitle">${doctor.title}</div>
              <div class="badge">APPOINTMENT CONFIRMATION SLIP</div>
            </div>
            
            <div class="grid">
              <div class="field"><div class="label">Appointment ID</div><div class="value">${createdAppointment.appointmentNumber}</div></div>
              <div class="field"><div class="label">Booking Status</div><div class="value" style="color: #d97706;">${createdAppointment.status}</div></div>
              <div class="field"><div class="label">Patient Name</div><div class="value">${createdAppointment.patientName}</div></div>
              <div class="field"><div class="label">Phone Number</div><div class="value">${createdAppointment.patientPhone}</div></div>
              <div class="field"><div class="label">Doctor Name</div><div class="value">${createdAppointment.doctorName || doctor.name}</div></div>
              <div class="field"><div class="label">Clinic / Chamber</div><div class="value">${createdAppointment.clinicName}</div></div>
              <div class="field"><div class="label">Appointment Date</div><div class="value">${createdAppointment.appointmentDate}</div></div>
              <div class="field"><div class="label">Time Slot</div><div class="value">${createdAppointment.appointmentTime}</div></div>
              <div class="field" style="grid-column: span 2;"><div class="label">Service Requested</div><div class="value">${selectedService?.title || "Dental Consultation"}</div></div>
              <div class="field" style="grid-column: span 2;"><div class="label">Clinic Address</div><div class="value">${createdAppointment.clinicAddress}</div></div>
            </div>

            <div class="footer">
              <p style="margin: 0 0 6px 0; font-weight: 600;">Please arrive 10 minutes before your scheduled appointment time.</p>
              <p style="margin: 0;">Clinic Hotline: ${doctor.contact.phone} • Emergency: ${doctor.contact.emergencyPhone}</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(slipHtml);
    printWindow.document.close();
  };

  return (
    <section id="appointment" className="py-20 lg:py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12 rounded-[32px] overflow-hidden shadow-2xl border border-slate-200"
        >
          {/* Left Panel — Clinical Information Suite */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-950 text-blue-400 border border-blue-800/60 mb-6">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Online Appointment System</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
                Schedule a Consultation
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed mb-8">
                Select your preferred clinic chamber, date, and available time slot below to secure your clinical appointment.
              </p>

              {/* Direct Info List */}
              <div className="flex flex-col gap-6 text-sm text-slate-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-800 text-blue-400 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white">Chamber Location</span>
                    <span className="text-xs text-slate-400">{selectedClinic.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-800 text-blue-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white">Clinical Hours</span>
                    <span className="text-xs text-slate-400">Saturday – Thursday: 09:00 AM – 08:00 PM</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-800 text-emerald-400 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white">WhatsApp Consultation Hotline</span>
                    <a
                      href={`https://wa.me/${(doctor.contact.whatsappNumber || doctor.contact.phone || "").replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      {doctor.contact.whatsappNumber || doctor.contact.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="mt-10 p-4 rounded-2xl bg-blue-950/80 border border-blue-800/60 text-xs">
              <span className="font-bold text-white block mb-1">Facing Severe Pain?</span>
              <span className="text-slate-300">Choose Emergency Appointment type or call hotline at {doctor.contact.emergencyPhone}.</span>
            </div>
          </div>

          {/* Right Panel — Interactive Booking Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 flex flex-col justify-center">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold mb-6 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
              {/* Step 1: Select Clinic / Chamber */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Clinic / Chamber <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedClinicId}
                  onChange={(e) => setSelectedClinicId(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-900 rounded-xl px-4 py-3 text-sm font-semibold border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                >
                  {clinics.length > 0 ? (
                    clinics.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.clinicName}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="clinic-1">Aveek&apos;s Dental and Implant Center(Sat-Thu)</option>
                      <option value="clinic-2">My Dentist & Maxillofcial Surgery(Sat-Thu)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Step 2: Select Date & Dynamic Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Appointment Date"
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                    <span>Available Time Slot <span className="text-red-500">*</span></span>
                    {loadingSlots && <span className="text-[10px] text-blue-600 font-semibold animate-pulse">Checking capacity...</span>}
                  </label>

                  <select
                    value={appointmentSlotId}
                    onChange={(e) => {
                      setAppointmentSlotId(e.target.value);
                      const target = slots.find((s) => s.id === e.target.value);
                      if (target) setAppointmentTime(`${target.startTime} - ${target.endTime}`);
                    }}
                    disabled={loadingSlots || slots.length === 0}
                    className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-900 rounded-xl px-4 py-3 text-sm font-semibold border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none disabled:opacity-60"
                  >
                    {slots.map((s) => {
                      const isFull = s.status === "Inactive";
                      return (
                        <option key={s.id} value={s.id} disabled={isFull}>
                          {s.startTime} - {s.endTime} {isFull ? "(Full Capacity)" : `(${s.maxCapacity - (s.bookedCount || 0)} left)`}
                        </option>
                      );
                    })}
                    {slots.length === 0 && <option value="">No slots available for date</option>}
                  </select>
                </div>
              </div>

              {/* Step 3: Patient Information & Service */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Patient Full Name"
                  placeholder="e.g. Eleanor Vance"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />

                <Input
                  label="Patient Phone Number"
                  type="tel"
                  placeholder="+880 1550-000000"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                />

                <Input
                  label="Patient Age (Years)"
                  type="number"
                  placeholder="e.g. 28"
                  min={1}
                  max={120}
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address (Optional)"
                  type="email"
                  placeholder="patient@example.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                />

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Requested Service <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-900 rounded-xl px-4 py-3 text-sm font-semibold border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                  >
                    {services.map((serv) => (
                      <option key={serv.id} value={serv.id}>
                        {serv.title} ({serv.estimatedDuration})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 4: Appointment Type & Medical Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Appointment Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAppointmentType("Regular")}
                      className={`py-3 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        appointmentType === "Regular"
                          ? "bg-blue-50 border-blue-600 text-blue-600"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Regular Visit
                    </button>

                    <button
                      type="button"
                      onClick={() => setAppointmentType("Emergency")}
                      className={`py-3 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        appointmentType === "Emergency"
                          ? "bg-red-50 border-red-600 text-red-600"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Emergency Care
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Clinic Address Preview
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium truncate">
                    {selectedClinic.address}
                  </div>
                </div>
              </div>

              <Textarea
                label="Medical Symptoms / Consultation Notes (Optional)"
                placeholder="Describe your current symptoms or consultation needs..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

              {/* Dual Booking Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <Button
                  type="button"
                  onClick={() => handleBookingSubmit("Website")}
                  variant="primary"
                  size="lg"
                  isLoading={submitting}
                  leftIcon={<ShieldCheck className="w-5 h-5 text-blue-200" />}
                  className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20"
                >
                  Book Appointment
                </Button>

                <Button
                  type="button"
                  onClick={() => handleBookingSubmit("Website + WhatsApp")}
                  variant="primary"
                  size="lg"
                  isLoading={submitting}
                  leftIcon={<MessageSquare className="w-5 h-5 text-emerald-300" />}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20"
                >
                  Book & Continue on WhatsApp
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Appointment Success Modal */}
      <AnimatePresence>
        {showSuccessModal && createdAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] p-6 sm:p-10 max-w-lg w-full shadow-2xl border border-slate-200 relative overflow-hidden text-slate-900 my-8"
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Appointment Saved Successfully!
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 mb-6">
                  Thank you. Your appointment request has been recorded in our clinical database.
                </p>

                {/* Appointment Detail Summary Card */}
                <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 text-left mb-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase">Appointment ID</span>
                    <span className="text-sm font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-mono">
                      {createdAppointment.appointmentNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Doctor</span>
                      <span className="font-bold text-slate-800">{createdAppointment.doctorName || doctor.name}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Status</span>
                      <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                        {createdAppointment.status}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="text-slate-400 block font-medium">Clinic Chamber</span>
                      <span className="font-bold text-slate-800">{createdAppointment.clinicName}</span>
                      <span className="text-[11px] text-slate-500 block truncate">{createdAppointment.clinicAddress}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Date</span>
                      <span className="font-bold text-slate-800">{createdAppointment.appointmentDate}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Time Slot</span>
                      <span className="font-bold text-slate-800">{createdAppointment.appointmentTime}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col w-full gap-3">
                  <Button
                    onClick={handleDownloadPDFSlip}
                    variant="outline"
                    className="w-full py-3.5 font-bold border-slate-300 text-slate-800 hover:bg-slate-100 flex items-center justify-center gap-2 rounded-2xl"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    <span>Download Appointment Slip (PDF)</span>
                  </Button>

                  <a
                    href={buildWhatsappMessageUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-200" />
                    <span>Continue on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors py-2"
                  >
                    Back to Website
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
