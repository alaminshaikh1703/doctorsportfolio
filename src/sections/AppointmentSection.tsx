"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Phone, Mail, MapPin, CheckCircle2, Calendar } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { DOCTOR_PROFILE, SERVICES_DATA } from "../constants/doctorData";
import { AppointmentFormData } from "../types";
import { fadeUpVariant } from "../animations/variants";

export const AppointmentSection: React.FC = () => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    serviceId: SERVICES_DATA[0].id,
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    preferredDate: "",
    preferredTime: "09:00 AM",
    reason: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Server Action submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        serviceId: SERVICES_DATA[0].id,
        patientName: "",
        patientPhone: "",
        patientEmail: "",
        preferredDate: "",
        preferredTime: "09:00 AM",
        reason: "",
      });
    }, 800);
  };

  return (
    <section id="appointment" className="py-20 lg:py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12 rounded-[24px] overflow-hidden shadow-2xl border border-slate-200"
        >
          {/* Left Panel — Dark Information Suite */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Background Accent Mesh */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-950 text-blue-400 border border-blue-800/60 mb-6">
                <Calendar className="w-3.5 h-3.5" />
                <span>Priority Booking</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
                Secure an Appointment
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed mb-8">
                We will confirm your consultation request promptly. Our care coordinators ensure quiet, acoustic privacy for your visit.
              </p>

              {/* Direct Info List */}
              <div className="flex flex-col gap-6 text-sm text-slate-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-800 text-blue-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white">Office Hours</span>
                    <span className="text-xs text-slate-400">Monday – Thursday: 08:00 AM – 05:00 PM</span>
                    <span className="text-xs text-slate-400">Friday: 08:00 AM – 03:00 PM</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-800 text-blue-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white">Direct Line</span>
                    <a href={`tel:${DOCTOR_PROFILE.contact.phone}`} className="text-xs text-blue-400 font-semibold hover:underline">
                      {DOCTOR_PROFILE.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-800 text-blue-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white">Clinic Address</span>
                    <span className="text-xs text-slate-400">
                      {DOCTOR_PROFILE.location.address}, {DOCTOR_PROFILE.location.city}, {DOCTOR_PROFILE.location.state}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Hotline Notice */}
            <div className="mt-10 p-4 rounded-xl bg-blue-950/80 border border-blue-800/60 text-xs">
              <span className="font-bold text-white block mb-1">Facing Acute Chest Symptoms?</span>
              <span className="text-slate-300">Call 911 immediately or contact our 24/7 emergency hotline at {DOCTOR_PROFILE.contact.emergencyPhone}.</span>
            </div>
          </div>

          {/* Right Panel — Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 flex flex-col justify-center">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Appointment Request Received!
                </h3>
                <p className="text-sm text-slate-600 max-w-md leading-relaxed mb-6">
                  Thank you. Our patient care coordinator will review your requested date and reach out via phone/email to finalize your slot.
                </p>
                <Button variant="primary" onClick={() => setSubmitted(false)}>
                  Book Another Appointment
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="e.g. Eleanor Vance"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    required
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="patient@example.com"
                    required
                    value={formData.patientEmail}
                    onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                  />

                  <div className="w-full flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Requested Service <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.serviceId}
                      onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                      className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 rounded-xl px-4 py-3 text-sm font-medium border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                    >
                      {SERVICES_DATA.map((serv) => (
                        <option key={serv.id} value={serv.id}>
                          {serv.title} ({serv.estimatedDuration})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Preferred Date"
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  />

                  <div className="w-full flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Preferred Time Slot <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 rounded-xl px-4 py-3 text-sm font-medium border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                    >
                      <option value="08:30 AM">08:30 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="01:30 PM">01:30 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                    </select>
                  </div>
                </div>

                <Textarea
                  label="Medical Notes / Reason for Visit"
                  placeholder="Describe your current symptoms or consultation needs..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  className="w-full mt-2"
                >
                  Book Appointment Now
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
