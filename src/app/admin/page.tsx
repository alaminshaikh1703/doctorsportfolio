"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Save,
  Database,
  Image as ImageIcon,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Plus,
  Trash2,
  BookOpen,
  Globe,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
  Calendar,
  Search,
  Filter,
  Check,
  XCircle,
  MessageSquare,
  Phone,
  Clock,
  User,
  FileText,
  X,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  LayoutGrid,
  MoreVertical,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { ImageUploader } from "../../components/ui/ImageUploader";
import { FullPortfolioData, BlogPost, AppointmentRecord, AppointmentStatus, ClinicEntity, AppointmentSlotEntity } from "../../types";

export default function AdminPage() {
  const [data, setData] = useState<FullPortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "appointments" | "profile" | "images" | "services" | "gallery" | "blog" | "seo" | "database"
  >("appointments");

  // Mobile Navigation Menu Toggle State (Mobile View)
  const [showMobileNavMenu, setShowMobileNavMenu] = useState<boolean>(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Appointment Management State (Phase 8)
  const [appointmentsList, setAppointmentsList] = useState<AppointmentRecord[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(false);
  const [apptSearch, setApptSearch] = useState<string>("");
  const [apptStatusFilter, setApptStatusFilter] = useState<string>("All");
  const [apptDateFilter, setApptDateFilter] = useState<string>("");
  const [selectedAppt, setSelectedAppt] = useState<AppointmentRecord | null>(null);
  const [editingAdminNote, setEditingAdminNote] = useState<string>("");
  const [updatingApptId, setUpdatingApptId] = useState<string | null>(null);

  // Phase 10: View Mode & Calendar Month State
  const [adminViewMode, setAdminViewMode] = useState<"table" | "calendar">("table");
  const [calendarMonthDate, setCalendarMonthDate] = useState<Date>(new Date());

  // Manual Appointment State (Admin Panel)
  const [showAddApptModal, setShowAddApptModal] = useState<boolean>(false);
  const [manualClinics, setManualClinics] = useState<ClinicEntity[]>([]);
  const [manualClinicId, setManualClinicId] = useState<string>("clinic-1");
  const [manualSlots, setManualSlots] = useState<AppointmentSlotEntity[]>([]);
  const [loadingManualSlots, setLoadingManualSlots] = useState<boolean>(false);
  const [manualPatientName, setManualPatientName] = useState<string>("");
  const [manualPatientPhone, setManualPatientPhone] = useState<string>("");
  const [manualPatientEmail, setManualPatientEmail] = useState<string>("");
  const [manualPatientAge, setManualPatientAge] = useState<string>("");
  const [manualServiceId, setManualServiceId] = useState<string>("");
  const [manualDate, setManualDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [manualSlotId, setManualSlotId] = useState<string>("");
  const [manualTime, setManualTime] = useState<string>("");
  const [manualType, setManualType] = useState<"Regular" | "Emergency">("Regular");
  const [manualReason, setManualReason] = useState<string>("");
  const [submittingManual, setSubmittingManual] = useState<boolean>(false);
  const [manualErrorMsg, setManualErrorMsg] = useState<string | null>(null);

  // Admin Clinics Management State
  const [adminClinicsList, setAdminClinicsList] = useState<ClinicEntity[]>([]);
  const [loadingAdminClinics, setLoadingAdminClinics] = useState<boolean>(false);
  const [showClinicModal, setShowClinicModal] = useState<boolean>(false);
  const [editingClinic, setEditingClinic] = useState<Partial<ClinicEntity> | null>(null);
  const [savingClinic, setSavingClinic] = useState<boolean>(false);

  // Admin Appointment Slots Editor State
  const [selectedSlotClinicId, setSelectedSlotClinicId] = useState<string>("clinic-1");
  const [adminSlotsList, setAdminSlotsList] = useState<AppointmentSlotEntity[]>([]);
  const [loadingAdminSlots, setLoadingAdminSlots] = useState<boolean>(false);
  const [showSlotModal, setShowSlotModal] = useState<boolean>(false);
  const [editingSlot, setEditingSlot] = useState<Partial<AppointmentSlotEntity> | null>(null);
  const [savingSlot, setSavingSlot] = useState<boolean>(false);

  // Fetch clinics when manual modal opens
  useEffect(() => {
    if (showAddApptModal) {
      async function fetchClinics() {
        try {
          const res = await fetch("/api/clinics");
          const json = await res.json();
          if (json.success && json.data) {
            setManualClinics(json.data);
            if (json.data.length > 0 && !manualClinicId) {
              setManualClinicId(json.data[0].id);
            }
          }
        } catch (e) {}
      }
      fetchClinics();
    }
  }, [showAddApptModal, manualClinicId]);

  // Fetch available slots for manual appointment modal
  useEffect(() => {
    if (showAddApptModal && manualClinicId && manualDate) {
      async function fetchSlots() {
        setLoadingManualSlots(true);
        try {
          const res = await fetch(`/api/appointment-slots?clinicId=${manualClinicId}&date=${manualDate}`);
          const json = await res.json();
          if (json.success && json.data) {
            setManualSlots(json.data);
            const firstActive = json.data.find((s: AppointmentSlotEntity) => s.status === "Active");
            if (firstActive) {
              setManualSlotId(firstActive.id);
              setManualTime(`${firstActive.startTime} - ${firstActive.endTime}`);
            } else {
              setManualSlotId("");
              setManualTime("");
            }
          }
        } catch (e) {} finally {
          setLoadingManualSlots(false);
        }
      }
      fetchSlots();
    }
  }, [showAddApptModal, manualClinicId, manualDate]);

  const handleCreateManualAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualErrorMsg(null);

    if (!manualPatientName.trim()) {
      setManualErrorMsg("Patient name is required.");
      return;
    }
    if (!manualPatientPhone.trim()) {
      setManualErrorMsg("Patient phone number is required.");
      return;
    }
    if (!manualSlotId) {
      setManualErrorMsg("Please select an available time slot.");
      return;
    }

    setSubmittingManual(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: "doc-1",
          clinicId: manualClinicId,
          serviceId: manualServiceId || (data?.services?.[0]?.id || "service-1"),
          appointmentDate: manualDate,
          appointmentSlotId: manualSlotId,
          appointmentTime: manualTime,
          appointmentType: manualType,
          patientName: manualPatientName.trim(),
          patientPhone: manualPatientPhone.trim(),
          patientEmail: manualPatientEmail.trim() || undefined,
          patientAge: manualPatientAge ? Number(manualPatientAge) : undefined,
          reason: manualReason.trim() || undefined,
          bookingSource: "Admin",
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMessage({ text: `Manual appointment ${json.data.appointmentNumber} created successfully!`, type: "success" });
        setShowAddApptModal(false);
        setManualPatientName("");
        setManualPatientPhone("");
        setManualPatientEmail("");
        setManualReason("");
        fetchAppointments();
      } else {
        setManualErrorMsg(json.error || "Failed to create manual appointment.");
      }
    } catch (err) {
      setManualErrorMsg("Network error creating manual appointment.");
    } finally {
      setSubmittingManual(false);
    }
  };

  const getClinicBadgeClass = (clinicName?: string) => {
    if (!clinicName) return "bg-indigo-50 text-indigo-800 border-indigo-200";
    const name = clinicName.toLowerCase();
    if (name.includes("mohakhali") || name.includes("main")) {
      return "bg-indigo-50 text-indigo-800 border-indigo-200";
    } else if (name.includes("gulshan") || name.includes("branch 2") || name.includes("2")) {
      return "bg-purple-50 text-purple-800 border-purple-200";
    } else if (name.includes("dhanmondi") || name.includes("branch 3") || name.includes("3")) {
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    }
    return "bg-sky-50 text-sky-800 border-sky-200";
  };

  useEffect(() => {
    // Check sessionStorage (cleared automatically when browser window/tab closes)
    const sessionToken = sessionStorage.getItem("admin_session_token");
    if (sessionToken === "aavisit_admin_authenticated_session") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      async function fetchData() {
        try {
          const res = await fetch("/api/doctor-data");
          const json = await res.json();
          setData(json);
        } catch (err) {
          setMessage({ text: "Failed to load doctor profile data", type: "error" });
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [isAuthenticated]);

  // Fetch Admin Clinics
  const fetchAdminClinics = React.useCallback(async () => {
    setLoadingAdminClinics(true);
    try {
      const res = await fetch("/api/admin/clinics");
      const json = await res.json();
      if (json.success && json.data) {
        setAdminClinicsList(json.data);
      }
    } catch (e) {
      console.warn("Failed to fetch admin clinics", e);
    } finally {
      setLoadingAdminClinics(false);
    }
  }, []);

  // Fetch Admin Slots for selected clinic
  const fetchAdminSlots = React.useCallback(async (clinicId: string) => {
    setLoadingAdminSlots(true);
    try {
      const res = await fetch(`/api/admin/slots?clinicId=${clinicId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setAdminSlotsList(json.data);
      }
    } catch (e) {
      console.warn("Failed to fetch admin slots", e);
    } finally {
      setLoadingAdminSlots(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === "profile") {
      fetchAdminClinics();
    }
  }, [isAuthenticated, activeTab, fetchAdminClinics]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "profile" && selectedSlotClinicId) {
      fetchAdminSlots(selectedSlotClinicId);
    }
  }, [isAuthenticated, activeTab, selectedSlotClinicId, fetchAdminSlots]);

  // Handle Save / Update Clinic
  const handleSaveClinicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClinic || !editingClinic.clinicName) return;
    setSavingClinic(true);
    try {
      const isNew = !editingClinic.id;
      const res = await fetch("/api/admin/clinics", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingClinic),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: isNew ? "New chamber / clinic added!" : "Chamber / clinic updated!", type: "success" });
        setShowClinicModal(false);
        setEditingClinic(null);
        fetchAdminClinics();
      } else {
        setMessage({ text: json.error || "Failed to save clinic.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error saving clinic.", type: "error" });
    } finally {
      setSavingClinic(false);
    }
  };

  // Handle Delete Clinic
  const handleDeleteClinic = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chamber / clinic?")) return;
    try {
      const res = await fetch(`/api/admin/clinics?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: "Chamber / clinic deleted.", type: "success" });
        fetchAdminClinics();
      }
    } catch (e) {}
  };

  // Handle Save / Update Slot
  const handleSaveSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot || !editingSlot.startTime || !editingSlot.endTime) return;
    setSavingSlot(true);
    try {
      const isNew = !editingSlot.id;
      const payload = {
        ...editingSlot,
        clinicId: editingSlot.clinicId || selectedSlotClinicId,
      };
      const res = await fetch("/api/admin/slots", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: isNew ? "Time slot created!" : "Time slot updated!", type: "success" });
        setShowSlotModal(false);
        setEditingSlot(null);
        fetchAdminSlots(selectedSlotClinicId);
      } else {
        setMessage({ text: json.error || "Failed to save time slot.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error saving time slot.", type: "error" });
    } finally {
      setSavingSlot(false);
    }
  };

  // Handle Toggle Slot Status
  const handleToggleSlotStatus = async (slot: AppointmentSlotEntity) => {
    const newStatus = slot.status === "Active" ? "Inactive" : "Active";
    setAdminSlotsList((prev) => prev.map((s) => (s.id === slot.id ? { ...s, status: newStatus } : s)));
    try {
      await fetch("/api/admin/slots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slot.id, status: newStatus }),
      });
    } catch (e) {
      fetchAdminSlots(selectedSlotClinicId);
    }
  };

  // Handle Delete Slot
  const handleDeleteSlot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this time slot?")) return;
    try {
      const res = await fetch(`/api/admin/slots?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: "Time slot deleted.", type: "success" });
        fetchAdminSlots(selectedSlotClinicId);
      }
    } catch (e) {}
  };

  // Fetch Appointments List (all records for total KPI stats)
  const fetchAppointments = React.useCallback(async (silent: boolean = false) => {
    if (!silent) setLoadingAppointments(true);
    try {
      const res = await fetch("/api/admin/appointments");
      const json = await res.json();
      if (json.success && json.data) {
        setAppointmentsList(json.data);
      }
    } catch (err) {
      console.warn("Failed to fetch appointments list.", err);
    } finally {
      if (!silent) setLoadingAppointments(false);
    }
  }, []);

  // Automatic 10-Second Polling Interval for Live Appointments Auto-Refresh
  useEffect(() => {
    if (isAuthenticated && activeTab === "appointments") {
      fetchAppointments();
      const intervalId = setInterval(() => {
        fetchAppointments(true); // Silent background auto-refresh every 10 seconds
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, activeTab, fetchAppointments]);

  // Client-Side Filtered Appointments for Table & Calendar Views
  const filteredAppointments = React.useMemo(() => {
    return appointmentsList.filter((appt) => {
      // 1. Search filter
      if (apptSearch && apptSearch.trim()) {
        const q = apptSearch.trim().toLowerCase();
        const matchNum = appt.appointmentNumber?.toLowerCase().includes(q);
        const matchName = appt.patientName?.toLowerCase().includes(q);
        const matchPhone = appt.patientPhone?.toLowerCase().includes(q);
        if (!matchNum && !matchName && !matchPhone) return false;
      }

      // 2. Status filter
      if (apptStatusFilter && apptStatusFilter !== "All") {
        if (appt.status !== apptStatusFilter) return false;
      }

      // 3. Date filter
      if (apptDateFilter) {
        if (appt.appointmentDate !== apptDateFilter) return false;
      }

      return true;
    });
  }, [appointmentsList, apptSearch, apptStatusFilter, apptDateFilter]);

  // Instant Optimistic Status Update (0ms delay for Complete / Cancel / Confirm)
  const handleUpdateStatus = async (id: string, newStatus: AppointmentStatus) => {
    setUpdatingApptId(id);

    // 1. Optimistic UI update - instantly reflect in table & drawer
    setAppointmentsList((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status: newStatus } : appt))
    );
    if (selectedAppt && selectedAppt.id === id) {
      setSelectedAppt({ ...selectedAppt, status: newStatus });
    }

    try {
      const res = await fetch(`/api/admin/appointments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, changedBy: "Admin" }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: `Appointment status updated to ${newStatus}`, type: "success" });
      } else {
        // Revert on failure
        fetchAppointments(true);
        setMessage({ text: json.error || "Failed to update status", type: "error" });
      }
    } catch (err) {
      fetchAppointments(true);
      setMessage({ text: "Network error updating status", type: "error" });
    } finally {
      setUpdatingApptId(null);
    }
  };

  const handleSaveAdminNote = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: editingAdminNote }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: "Admin note saved successfully", type: "success" });
        fetchAppointments();
        if (selectedAppt && selectedAppt.id === id) {
          setSelectedAppt({ ...selectedAppt, adminNote: editingAdminNote });
        }
      }
    } catch (err) {
      setMessage({ text: "Failed to save admin note", type: "error" });
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment record?")) return;
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: "Appointment record deleted", type: "success" });
        fetchAppointments();
        setSelectedAppt(null);
      }
    } catch (err) {
      setMessage({ text: "Failed to delete appointment", type: "error" });
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticating(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const result = await res.json();
      if (result.success && result.token) {
        sessionStorage.setItem("admin_session_token", result.token);
        setIsAuthenticated(true);
      } else {
        setAuthError(result.error || "Invalid credentials. Access denied.");
      }
    } catch (err) {
      setAuthError("Network error authenticating credentials.");
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("admin_session_token");
    await fetch("/api/admin-auth", { method: "DELETE" }).catch(() => {});
    setIsAuthenticated(false);
    setLoginPassword("");
  };

  const handleAddService = () => {
    if (!data) return;
    const newService = {
      id: `service-${Date.now()}`,
      title: "New Dental Treatment",
      shortDescription: "Short description of the treatment...",
      fullDescription: "Full description...",
      iconName: "Stethoscope",
      image: "",
      keyBenefits: ["Pain-free procedure", "High success rate", "Quick recovery"],
      estimatedDuration: "30-45 mins",
      category: "clinical" as const,
    };
    setData({ ...data, services: [...(data.services || []), newService] });
  };

  const handleDeleteService = (id: string) => {
    if (!data) return;
    setData({ ...data, services: (data.services || []).filter((s) => s.id !== id) });
  };

  const handleAddGalleryItem = () => {
    if (!data) return;
    const newItem = {
      id: `gallery-${Date.now()}`,
      title: "New Clinic Photo",
      category: "clinic" as const,
      image: "",
      caption: "Description of the facility photo...",
    };
    setData({ ...data, gallery: [...(data.gallery || []), newItem] });
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (!data) return;
    setData({ ...data, gallery: (data.gallery || []).filter((g) => g.id !== id) });
  };

  const handleAddBlogPost = () => {
    if (!data) return;
    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      title: "New Dental Health Article",
      slug: `new-dental-article-${Date.now().toString().slice(-4)}`,
      category: "Dental Care",
      readTime: "5 min read",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      excerpt: "Short summary of the article for patient guidance...",
      content: "Detailed article content discussing oral health recommendations...",
      featuredImage: "",
      author: {
        name: data.doctor.name,
        avatar: data.doctor.heroImage || "",
        role: data.doctor.title,
      },
    };
    setData({ ...data, blog: [newPost, ...(data.blog || [])] });
  };

  const handleDeleteBlogPost = (id: string) => {
    if (!data) return;
    setData({ ...data, blog: (data.blog || []).filter((b) => b.id !== id) });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!data) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/doctor-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor: data.doctor,
          services: data.services,
          gallery: data.gallery,
          testimonials: data.testimonials,
          blog: data.blog,
          databaseUrl: (data as any).databaseUrl || "",
        }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage({ text: "Portfolio details, articles, SEO & images synced successfully!", type: "success" });
        setData(result.data);
      } else {
        setMessage({ text: result.error || "Failed to update portfolio data", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error updating portfolio data", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Render Admin Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-blue-400/15 via-indigo-300/10 to-sky-400/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none"></div>

        <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-slate-900/10 relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30 mb-4 transform hover:scale-105 transition-transform">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Portal Access</h1>
            <p className="text-xs font-semibold text-blue-600 tracking-wide uppercase mt-1.5">
              Doctor&apos;s Data • Management
            </p>
          </div>

          {authError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold mb-6 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
            <Input
              label="Admin Username / Email"
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="adminlogin@aavisit.com"
              className="bg-white text-slate-900 font-semibold border-slate-300 focus:border-blue-600"
            />

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white text-slate-900 font-semibold border border-slate-300 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 placeholder-slate-400 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 py-4 text-sm font-bold rounded-2xl shadow-xl shadow-blue-600/25 active:scale-[0.99] transition-transform"
              isLoading={authenticating}
              leftIcon={<ShieldCheck className="w-5 h-5" />}
            >
              Sign In to Admin Panel
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Main Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-blue-600 font-semibold text-sm">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading Admin Panel Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white py-4 sm:py-6 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
              title="View Live Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm sm:text-lg font-bold text-white tracking-tight leading-tight">Admin Panel</h1>
                <span className="text-xs text-blue-400 font-medium hidden md:block">Manage Patient Appointments, Clinical Content & SEO</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop DB Status Badge */}
            <div
              className={`hidden md:flex px-3 py-1 rounded-full text-xs font-bold items-center gap-1.5 ${
                data.isDatabaseConnected
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                  : "bg-amber-950 text-amber-400 border border-amber-800"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{data.isDatabaseConnected ? "MySQL Connected" : "Static / Fallback Mode"}</span>
            </div>

            {/* Desktop Save Changes Button */}
            <div className="hidden md:block">
              <Button
                onClick={handleSave}
                isLoading={saving}
                variant="primary"
                size="sm"
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>

            {/* Desktop Log Out Button */}
            <button
              onClick={handleLogout}
              className="hidden md:flex p-2.5 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-800 transition-colors items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Log Out of Admin Session"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>

            {/* 3-Dot Mobile Navigation Toggle Button */}
            <button
              onClick={() => setShowMobileNavMenu(!showMobileNavMenu)}
              className="md:hidden p-2.5 rounded-xl bg-slate-800 hover:bg-blue-900/50 text-slate-300 hover:text-white border border-slate-700 hover:border-blue-500 transition-colors flex items-center justify-center cursor-pointer"
              title="Toggle Navigation Menu"
            >
              <MoreVertical className="w-5 h-5 text-blue-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Status Notification Toast */}
        {message && (
          <div
            className={`p-4 rounded-2xl mb-6 flex items-center gap-3 border ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span className="text-sm font-semibold">{message.text}</span>
          </div>
        )}

        {/* Mobile View Active Tab Bar & 3-Dot Trigger */}
        <div className="md:hidden flex items-center justify-between p-3.5 mb-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Active View:</span>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-extrabold flex items-center gap-1.5">
              {activeTab === "appointments" ? "Appointments Manager" : activeTab === "profile" ? "Doctor Profile" : activeTab === "images" ? "Hero & Section Images" : activeTab === "services" ? "Clinical Services" : activeTab === "gallery" ? "Clinic Gallery" : activeTab === "blog" ? "Health Articles & Blog" : activeTab === "seo" ? "SEO & Meta Tags" : "MySQL Setup & Schema"}
            </span>
          </div>
          <button
            onClick={() => setShowMobileNavMenu(!showMobileNavMenu)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            <MoreVertical className="w-4 h-4 text-blue-600" />
            <span>Menu</span>
          </button>
        </div>

        {/* Mobile Navigation Dropdown Menu (Visible on Mobile only when 3-Dot Clicked) */}
        {showMobileNavMenu && (
          <div className="md:hidden mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col gap-4 transition-all animate-in fade-in slide-in-from-top-2">
            {/* Header Mobile Quick Actions */}
            <div className="pb-3 border-b border-slate-100 flex flex-col gap-2.5">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Quick Actions</span>
                <button
                  onClick={() => setShowMobileNavMenu(false)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>Database:</span>
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                    data.isDatabaseConnected ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {data.isDatabaseConnected ? "MySQL Connected" : "Static Mode"}
                </span>
              </div>

              <Button
                onClick={() => {
                  handleSave();
                  setShowMobileNavMenu(false);
                }}
                isLoading={saving}
                variant="primary"
                size="sm"
                leftIcon={<Save className="w-4 h-4" />}
                className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-2.5"
              >
                Save All Changes
              </Button>

              <button
                onClick={handleLogout}
                className="w-full p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Admin</span>
              </button>
            </div>

            {/* Navigation Tabs List */}
            <div className="flex flex-col gap-1.5">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-1 pb-1">
                Navigation Tabs
              </div>
              {[
                { id: "appointments", label: "Appointments Manager", icon: Calendar },
                { id: "profile", label: "Doctor Profile", icon: UserCheck },
                { id: "images", label: "Hero & Section Images", icon: ImageIcon },
                { id: "services", label: "Clinical Services", icon: Stethoscope },
                { id: "gallery", label: "Clinic Gallery", icon: ImageIcon },
                { id: "blog", label: "Health Articles & Blog", icon: BookOpen },
                { id: "seo", label: "SEO & Meta Tags", icon: Globe },
                { id: "database", label: "MySQL Setup & Schema", icon: Database },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setShowMobileNavMenu(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Desktop Navigation Tabs (Hidden on Mobile View) */}
        <div className="hidden md:flex items-center gap-2 border-b border-slate-200 pb-4 mb-8 overflow-x-auto">
          {[
            { id: "appointments", label: "Appointments Manager", icon: Calendar },
            { id: "profile", label: "Doctor Profile", icon: UserCheck },
            { id: "images", label: "Hero & Section Images", icon: ImageIcon },
            { id: "services", label: "Clinical Services", icon: Stethoscope },
            { id: "gallery", label: "Clinic Gallery", icon: ImageIcon },
            { id: "blog", label: "Health Articles & Blog", icon: BookOpen },
            { id: "seo", label: "SEO & Meta Tags", icon: Globe },
            { id: "database", label: "MySQL Setup & Schema", icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 0: Phase 8 — Appointments Manager */}
        {activeTab === "appointments" && (
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">Clinical Appointment Management</h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Auto-syncing (10s)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Search, filter, confirm, reschedule, and manage patient bookings in real time.</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                  <button
                    onClick={() => setAdminViewMode("table")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      adminViewMode === "table"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Table View</span>
                  </button>

                  <button
                    onClick={() => setAdminViewMode("calendar")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      adminViewMode === "calendar"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Calendar View</span>
                  </button>
                </div>

                <Button
                  onClick={() => setShowAddApptModal(true)}
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="bg-blue-600 hover:bg-blue-700 font-bold"
                >
                  Add Appointment
                </Button>

                <Button
                  onClick={fetchAppointments}
                  variant="outline"
                  size="sm"
                  isLoading={loadingAppointments}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                  Refresh
                </Button>
              </div>
            </div>

            {/* Phase 9: Dashboard KPI Summary Cards */}
            {(() => {
              const todayStr = new Date().toISOString().split("T")[0];
              const todaysTotal = appointmentsList.filter((a) => a.appointmentDate === todayStr).length;
              const upcomingTotal = appointmentsList.filter((a) => a.appointmentDate > todayStr).length;
              const todaysPending = appointmentsList.filter((a) => a.appointmentDate === todayStr && a.status === "Pending").length;
              const todaysConfirmed = appointmentsList.filter((a) => a.appointmentDate === todayStr && a.status === "Confirmed").length;
              const pendingTotal = appointmentsList.filter((a) => a.status === "Pending").length;
              const confirmedTotal = appointmentsList.filter((a) => a.status === "Confirmed").length;
              const completedTotal = appointmentsList.filter((a) => a.status === "Completed").length;
              const cancelledTotal = appointmentsList.filter((a) => a.status === "Cancelled").length;
              const uniquePatients = new Set(appointmentsList.map((a) => a.patientPhone)).size;

              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
                  <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-tight">Today&apos;s Total</span>
                    <span className="text-2xl font-extrabold text-blue-900 mt-1">{todaysTotal}</span>
                  </div>

                  <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-2xl flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-tight">Upcoming</span>
                    <span className="text-2xl font-extrabold text-indigo-900 mt-1">{upcomingTotal}</span>
                  </div>

                  <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-tight">Today Pending</span>
                    <span className="text-2xl font-extrabold text-amber-900 mt-1">{todaysPending}</span>
                  </div>

                  <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-tight">Today Confirmed</span>
                    <span className="text-2xl font-extrabold text-emerald-900 mt-1">{todaysConfirmed}</span>
                  </div>

                  <div className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-2xl flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-tight">Pending</span>
                    <span className="text-xl font-bold text-amber-800 mt-1">{pendingTotal}</span>
                  </div>

                  <div className="p-3.5 bg-blue-50/50 border border-blue-200/80 rounded-2xl flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-tight">Confirmed</span>
                    <span className="text-xl font-bold text-blue-800 mt-1">{confirmedTotal}</span>
                  </div>

                  <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-tight">Completed</span>
                    <span className="text-xl font-bold text-emerald-800 mt-1">{completedTotal}</span>
                  </div>

                  <div className="p-3.5 bg-red-50/50 border border-red-200/80 rounded-2xl flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-red-600 uppercase tracking-tight">Cancelled</span>
                    <span className="text-xl font-bold text-red-800 mt-1">{cancelledTotal}</span>
                  </div>

                  <div className="p-3.5 bg-purple-50/80 border border-purple-200 rounded-2xl flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-purple-700 uppercase tracking-tight">Total Patients</span>
                    <span className="text-2xl font-extrabold text-purple-900 mt-1">{uniquePatients}</span>
                  </div>
                </div>
              );
            })()}

            {/* Search & Multi-Filter Control Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID (e.g. APT-), Patient Name, or Phone..."
                  value={apptSearch}
                  onChange={(e) => setApptSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 placeholder-slate-400"
                />
              </div>

              <div className="sm:col-span-3 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={apptStatusFilter}
                  onChange={(e) => setApptStatusFilter(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="No Show">No Show</option>
                </select>
              </div>

              <div className="sm:col-span-4 flex items-center gap-2">
                <input
                  type="date"
                  value={apptDateFilter}
                  onChange={(e) => setApptDateFilter(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                />
                {(apptSearch || apptDateFilter || apptStatusFilter !== "All") && (
                  <button
                    type="button"
                    onClick={() => {
                      setApptSearch("");
                      setApptStatusFilter("All");
                      setApptDateFilter("");
                    }}
                    className="px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs whitespace-nowrap transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Appointments Data Table */}
            {adminViewMode === "table" && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-100/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                    <th className="p-4">Appointment ID</th>
                    <th className="p-4">Patient Name & Phone</th>
                    <th className="p-4">Clinic / Chamber</th>
                    <th className="p-4">Service Requested</th>
                    <th className="p-4">Date & Time Slot</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Source</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs font-semibold text-slate-800">
                  {filteredAppointments.map((appt) => {
                    const isPending = appt.status === "Pending";
                    const isConfirmed = appt.status === "Confirmed";
                    const isCompleted = appt.status === "Completed";
                    const isCancelled = appt.status === "Cancelled";

                    return (
                      <tr key={appt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-mono font-bold text-blue-600">{appt.appointmentNumber}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{appt.patientName}</span>
                            {appt.patientAge && (
                              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold border border-slate-200">
                                {appt.patientAge} yrs
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">{appt.patientPhone}</div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${getClinicBadgeClass(appt.clinicName)}`}
                          >
                            {appt.clinicName || "Mohakhali Specialised Dental Care"}
                          </span>
                        </td>
                        <td className="p-4">{appt.serviceName || "Dental Consultation"}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{appt.appointmentDate}</div>
                          <div className="text-[11px] text-slate-500">{appt.appointmentTime}</div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                              isPending
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : isConfirmed
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : isCompleted
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isCancelled
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-slate-100 text-slate-600 border-slate-300"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>
                        <td className="p-4 text-[11px] text-slate-500 font-medium">{appt.bookingSource}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Action: Confirm */}
                            {isPending && (
                              <button
                                onClick={() => handleUpdateStatus(appt.id, "Confirmed")}
                                disabled={updatingApptId === appt.id}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                                title="Confirm Appointment"
                              >
                                Confirm
                              </button>
                            )}

                            {/* Action: Complete */}
                            {isConfirmed && (
                              <button
                                onClick={() => handleUpdateStatus(appt.id, "Completed")}
                                disabled={updatingApptId === appt.id}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                                title="Mark Completed"
                              >
                                Complete
                              </button>
                            )}

                            {/* Action: Cancel */}
                            {!isCancelled && !isCompleted && (
                              <button
                                onClick={() => handleUpdateStatus(appt.id, "Cancelled")}
                                disabled={updatingApptId === appt.id}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                                title="Cancel Appointment"
                              >
                                Cancel
                              </button>
                            )}

                            {/* Action: Open WhatsApp */}
                            <a
                              href={`https://wa.me/${appt.patientPhone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(`Hello ${appt.patientName}, regarding your appointment ${appt.appointmentNumber}...`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-colors"
                              title="Open WhatsApp Chat with Patient"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>

                            {/* Action: View Detail & Edit Notes */}
                            <button
                              onClick={() => {
                                setSelectedAppt(appt);
                                setEditingAdminNote(appt.adminNote || "");
                              }}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                              title="View Patient Details & Notes"
                            >
                              <FileText className="w-4 h-4" />
                            </button>

                            {/* Action: Delete */}
                            <button
                              onClick={() => handleDeleteAppointment(appt.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                              title="Delete Appointment Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold text-xs">
                        {loadingAppointments
                          ? "Loading appointments..."
                          : (apptSearch || apptDateFilter || apptStatusFilter !== "All")
                          ? "No appointments match your active filter criteria. Click 'Clear' above to see all appointments."
                          : "No appointment records found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            )}

            {/* Phase 10: Interactive Monthly Calendar View */}
            {adminViewMode === "calendar" && (
              <div className="flex flex-col gap-4">
                {/* Month Navigator Header */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => {
                      const prev = new Date(calendarMonthDate);
                      prev.setMonth(prev.getMonth() - 1);
                      setCalendarMonthDate(prev);
                    }}
                    className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Month</span>
                  </button>

                  <h3 className="text-base font-extrabold text-slate-900">
                    {calendarMonthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h3>

                  <button
                    onClick={() => {
                      const next = new Date(calendarMonthDate);
                      next.setMonth(next.getMonth() + 1);
                      setCalendarMonthDate(next);
                    }}
                    className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Next Month</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-2 text-center font-bold text-xs">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="py-2.5 bg-slate-100 rounded-xl text-slate-600 uppercase text-[11px] font-extrabold">
                      {day}
                    </div>
                  ))}

                  {(() => {
                    const year = calendarMonthDate.getFullYear();
                    const month = calendarMonthDate.getMonth();
                    const firstDayIdx = new Date(year, month, 1).getDay();
                    const totalDays = new Date(year, month + 1, 0).getDate();
                    const todayStr = new Date().toISOString().split("T")[0];

                    const cells = [];

                    // Padding before 1st of month
                    for (let i = 0; i < firstDayIdx; i++) {
                      cells.push(
                        <div key={`pad-${i}`} className="min-h-[110px] p-2 bg-slate-50/40 rounded-2xl border border-slate-100 opacity-30" />
                      );
                    }

                    // Days of month
                    for (let d = 1; d <= totalDays; d++) {
                      const monthStr = (month + 1).toString().padStart(2, "0");
                      const dayStr = d.toString().padStart(2, "0");
                      const dateStr = `${year}-${monthStr}-${dayStr}`;
                      const isToday = dateStr === todayStr;

                      const dayAppts = appointmentsList.filter((a) => a.appointmentDate === dateStr);

                      cells.push(
                        <div
                          key={`day-${d}`}
                          className={`min-h-[110px] p-2.5 rounded-2xl border flex flex-col gap-1.5 transition-all ${
                            isToday ? "bg-blue-50/50 border-blue-400 shadow-sm" : "bg-white border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${isToday ? "bg-blue-600 text-white" : "text-slate-800"}`}>
                              {d}
                            </span>
                            {dayAppts.length > 0 && (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                                {dayAppts.length} visit{dayAppts.length > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[85px] custom-scrollbar">
                            {dayAppts.map((a) => {
                              const isPending = a.status === "Pending";
                              const isConfirmed = a.status === "Confirmed";
                              const isCompleted = a.status === "Completed";

                              return (
                                <button
                                  key={a.id}
                                  onClick={() => {
                                    setSelectedAppt(a);
                                    setEditingAdminNote(a.adminNote || "");
                                  }}
                                  className={`p-1.5 rounded-lg text-[10px] text-left font-bold truncate border transition-transform hover:scale-102 cursor-pointer ${
                                    isPending
                                      ? "bg-amber-50 text-amber-900 border-amber-300"
                                      : isConfirmed
                                      ? "bg-blue-50 text-blue-900 border-blue-300"
                                      : isCompleted
                                      ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                                      : "bg-slate-100 text-slate-700 border-slate-300"
                                  }`}
                                  title={`${a.patientName} (${a.appointmentTime}) - ${a.status}`}
                                >
                                  <span className="truncate block font-bold">{a.patientName}</span>
                                  <span className="text-[9px] opacity-80 block truncate">{a.appointmentTime}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }

                    return cells;
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Patient Detail & Admin Notes Drawer Modal */}
        {selectedAppt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-[28px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative text-slate-900">
              <button
                onClick={() => setSelectedAppt(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span>Appointment Detail</span>
                <span className="text-xs font-mono font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  {selectedAppt.appointmentNumber}
                </span>
              </h3>

              <div className="flex flex-col gap-4 text-xs font-medium mt-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2">
                  <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                    <span>{selectedAppt.patientName}</span>
                    {selectedAppt.patientAge && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-bold border border-blue-200">
                        Age: {selectedAppt.patientAge} Years
                      </span>
                    )}
                  </div>
                  <div>Phone: <a href={`tel:${selectedAppt.patientPhone}`} className="text-blue-600 font-bold hover:underline">{selectedAppt.patientPhone}</a></div>
                  {selectedAppt.patientEmail && <div>Email: {selectedAppt.patientEmail}</div>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Date & Time</span>
                    <span className="font-bold text-slate-900">{selectedAppt.appointmentDate}</span>
                    <span className="block text-slate-500">{selectedAppt.appointmentTime}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Status</span>
                    <span className="font-bold text-amber-600">{selectedAppt.status}</span>
                  </div>
                </div>

                {selectedAppt.reason && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Patient Medical Symptoms / Reason</span>
                    <p className="text-slate-700">{selectedAppt.reason}</p>
                  </div>
                )}

                {/* Admin Note Input */}
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Internal Admin / Doctor Clinical Note
                  </label>
                  <textarea
                    rows={3}
                    value={editingAdminNote}
                    onChange={(e) => setEditingAdminNote(e.target.value)}
                    placeholder="Type internal medical recommendations or patient history notes..."
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                  />
                  <Button
                    onClick={() => handleSaveAdminNote(selectedAppt.id)}
                    size="sm"
                    variant="primary"
                    className="self-end"
                  >
                    Save Clinical Note
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manual Add Appointment Modal (Admin Panel) */}
        {showAddApptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 relative text-slate-900 my-8">
              <button
                onClick={() => setShowAddApptModal(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Add Patient Appointment Live</h3>
                  <p className="text-xs text-slate-500 font-medium">Create a live appointment booking directly for patient in real time.</p>
                </div>
              </div>

              {manualErrorMsg && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold mb-5 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{manualErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateManualAppointment} className="flex flex-col gap-4">
                {/* Clinic Chamber & Service */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Select Clinic / Chamber <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={manualClinicId}
                      onChange={(e) => setManualClinicId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600"
                    >
                      {manualClinics.length > 0 ? (
                        manualClinics.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.clinicName}
                          </option>
                        ))
                      ) : (
                        <option value="clinic-1">Mohakhali Specialised Dental Care</option>
                      )}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Requested Service <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={manualServiceId}
                      onChange={(e) => setManualServiceId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600"
                    >
                      {(data?.services || []).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.estimatedDuration})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Date & Dynamic Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Appointment Date"
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                  />

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                      <span>Available Time Slot <span className="text-red-500">*</span></span>
                      {loadingManualSlots && <span className="text-[10px] text-blue-600 animate-pulse font-semibold">Loading...</span>}
                    </label>
                    <select
                      value={manualSlotId}
                      onChange={(e) => {
                        setManualSlotId(e.target.value);
                        const target = manualSlots.find((s) => s.id === e.target.value);
                        if (target) setManualTime(`${target.startTime} - ${target.endTime}`);
                      }}
                      disabled={loadingManualSlots || manualSlots.length === 0}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600 disabled:opacity-60"
                    >
                      {manualSlots.map((s) => {
                        const isFull = s.status === "Inactive";
                        return (
                          <option key={s.id} value={s.id} disabled={isFull}>
                            {s.startTime} - {s.endTime} {isFull ? "(Full Capacity)" : `(${s.maxCapacity - (s.bookedCount || 0)} left)`}
                          </option>
                        );
                      })}
                      {manualSlots.length === 0 && <option value="">No slots available for date</option>}
                    </select>
                  </div>
                </div>

                {/* Patient Name, Phone & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Patient Full Name"
                    placeholder="e.g. John Doe"
                    required
                    value={manualPatientName}
                    onChange={(e) => setManualPatientName(e.target.value)}
                  />

                  <Input
                    label="Patient Phone Number"
                    type="tel"
                    placeholder="+880 1550-000000"
                    required
                    value={manualPatientPhone}
                    onChange={(e) => setManualPatientPhone(e.target.value)}
                  />

                  <Input
                    label="Patient Age (Years)"
                    type="number"
                    placeholder="e.g. 28"
                    min={1}
                    max={120}
                    value={manualPatientAge}
                    onChange={(e) => setManualPatientAge(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address (Optional)"
                    type="email"
                    placeholder="patient@example.com"
                    value={manualPatientEmail}
                    onChange={(e) => setManualPatientEmail(e.target.value)}
                  />

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Visit Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setManualType("Regular")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          manualType === "Regular" ? "bg-blue-50 border-blue-600 text-blue-600" : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        Regular
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualType("Emergency")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          manualType === "Emergency" ? "bg-red-50 border-red-600 text-red-600" : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        Emergency
                      </button>
                    </div>
                  </div>
                </div>

                <Textarea
                  label="Consultation Notes / Patient Symptoms (Optional)"
                  placeholder="Enter medical notes or consultation reason..."
                  value={manualReason}
                  onChange={(e) => setManualReason(e.target.value)}
                />

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddApptModal(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={submittingManual}
                    leftIcon={<Check className="w-4 h-4" />}
                    className="bg-blue-600 hover:bg-blue-700 font-bold"
                  >
                    Save Patient Appointment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 1: Doctor Profile */}
        {activeTab === "profile" && (
          <div className="flex flex-col gap-8">
            <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100">
                Basic Doctor Profile Information
              </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Doctor Name"
                value={data.doctor.name}
                onChange={(e) =>
                  setData({ ...data, doctor: { ...data.doctor, name: e.target.value } })
                }
              />

              <Input
                label="Medical Specialty Title"
                value={data.doctor.title}
                onChange={(e) =>
                  setData({ ...data, doctor: { ...data.doctor, title: e.target.value } })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Phone Number"
                value={data.doctor.contact.phone}
                onChange={(e) =>
                  setData({
                    ...data,
                    doctor: { ...data.doctor, contact: { ...data.doctor.contact, phone: e.target.value } },
                  })
                }
              />

              <Input
                label="WhatsApp Number (for Appointments)"
                value={data.doctor.contact.whatsappNumber || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    doctor: { ...data.doctor, contact: { ...data.doctor.contact, whatsappNumber: e.target.value } },
                  })
                }
                placeholder="e.g. +8801531714840"
              />

              <Input
                label="Email Address"
                value={data.doctor.contact.email}
                onChange={(e) =>
                  setData({
                    ...data,
                    doctor: { ...data.doctor, contact: { ...data.doctor.contact, email: e.target.value } },
                  })
                }
              />

              <Input
                label="Clinic Address"
                value={data.doctor.location.address}
                onChange={(e) =>
                  setData({
                    ...data,
                    doctor: { ...data.doctor, location: { ...data.doctor.location, address: e.target.value } },
                  })
                }
              />
            </div>

            <Textarea
              label="Professional Biography"
              value={data.doctor.bio}
              onChange={(e) =>
                setData({ ...data, doctor: { ...data.doctor, bio: e.target.value } })
              }
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
                Save Profile Changes
              </Button>
            </div>
          </form>

          {/* Section 1: Chambers & Clinics Management */}
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Chambers & Clinics Location Management</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">Add, edit, or update doctor chamber names, addresses, phone numbers, and visiting schedules.</p>
              </div>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  setEditingClinic({
                    clinicName: "",
                    address: "",
                    phone: "+8801531714840",
                    openingTime: "09:00 AM",
                    closingTime: "08:00 PM",
                    workingDays: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
                    status: "Active",
                  });
                  setShowClinicModal(true);
                }}
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-blue-600 hover:bg-blue-700 font-bold"
              >
                + Add New Chamber / Clinic
              </Button>
            </div>

            {loadingAdminClinics ? (
              <div className="py-8 text-center text-xs font-semibold text-slate-400 animate-pulse">
                Loading chambers & clinics list...
              </div>
            ) : adminClinicsList.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-500 font-semibold">
                No chambers configured yet. Click &quot;+ Add New Chamber / Clinic&quot; to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminClinicsList.map((c) => {
                  const daysStr = Array.isArray(c.workingDays) ? c.workingDays.join(", ") : c.workingDays;
                  const isActive = c.status === "Active";

                  return (
                    <div key={c.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-4 hover:border-blue-300 transition-all">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-extrabold text-sm text-slate-900">{c.clinicName}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-300"}`}>
                            {c.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-medium flex items-start gap-1.5">
                          <span className="font-bold text-slate-800">Address:</span> {c.address}
                        </p>

                        <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">Phone:</span> {c.phone || "N/A"}
                        </p>

                        <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">Hours:</span> {c.openingTime} - {c.closingTime}
                        </p>

                        {daysStr && (
                          <div className="mt-1 text-[11px] font-bold text-blue-600 bg-blue-50/80 border border-blue-100 px-3 py-1 rounded-xl">
                            Days: {daysStr}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingClinic({ ...c });
                            setShowClinicModal(true);
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                        >
                          Edit Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClinic(c.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold border border-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Time Slots & Capacity Manager */}
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Consultation Time Slots & Capacity Manager</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">Configure available appointment time slots, start/end times, and max capacity per slot for each chamber.</p>
              </div>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  setEditingSlot({
                    clinicId: selectedSlotClinicId,
                    dayOfWeek: "Saturday",
                    startTime: "09:00 AM",
                    endTime: "09:30 AM",
                    maxCapacity: 2,
                    status: "Active",
                  });
                  setShowSlotModal(true);
                }}
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-blue-600 hover:bg-blue-700 font-bold"
              >
                + Add Time Slot
              </Button>
            </div>

            {/* Chamber Selection Dropdown */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Chamber / Clinic to Edit Slots:
              </label>
              <select
                value={selectedSlotClinicId}
                onChange={(e) => setSelectedSlotClinicId(e.target.value)}
                className="w-full sm:w-auto min-w-[280px] bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              >
                {adminClinicsList.length > 0 ? (
                  adminClinicsList.map((c) => (
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

            {/* Slots Table */}
            {loadingAdminSlots ? (
              <div className="py-8 text-center text-xs font-semibold text-slate-400 animate-pulse">
                Loading appointment slots...
              </div>
            ) : adminSlotsList.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-500 font-semibold">
                No time slots configured for this chamber. Click &quot;+ Add Time Slot&quot; to create one.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-slate-100/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                      <th className="p-3.5">Day of Week</th>
                      <th className="p-3.5">Start & End Time</th>
                      <th className="p-3.5">Max Capacity</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs font-semibold text-slate-800">
                    {adminSlotsList.map((slot) => {
                      const isActive = slot.status === "Active";
                      return (
                        <tr key={slot.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">{slot.dayOfWeek}</td>
                          <td className="p-3.5 font-mono text-blue-600 font-bold">
                            {slot.startTime} - {slot.endTime}
                          </td>
                          <td className="p-3.5 font-bold">{slot.maxCapacity} Patients</td>
                          <td className="p-3.5">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                                isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                              }`}
                            >
                              {slot.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleSlotStatus(slot)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                                isActive ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200" : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              }`}
                            >
                              {isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSlot({ ...slot });
                                setShowSlotModal(true);
                              }}
                              className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-[11px] font-bold transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[11px] font-bold border border-red-200 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

        {/* Tab 2: Hero & Section Image Uploads */}
        {activeTab === "images" && (
          <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Hero & Section Image Uploads (JPG, PNG, WebP)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploader
                label="Hero Section Portrait Image"
                value={data.doctor.heroImage || ""}
                publicId={(data.doctor as any).heroImagePublicId || ""}
                folder="doctors"
                onChange={(url, publicId) =>
                  setData({
                    ...data,
                    doctor: {
                      ...data.doctor,
                      heroImage: url,
                      heroImagePublicId: publicId,
                    } as any,
                  })
                }
                helperText="Upload image directly to Cloudinary CDN for the main Hero Section doctor portrait."
              />

              <ImageUploader
                label="About Section Doctor Image"
                value={data.doctor.aboutImage || ""}
                publicId={(data.doctor as any).aboutImagePublicId || ""}
                folder="doctors"
                onChange={(url, publicId) =>
                  setData({
                    ...data,
                    doctor: {
                      ...data.doctor,
                      aboutImage: url,
                      aboutImagePublicId: publicId,
                    } as any,
                  })
                }
                helperText="Upload image directly to Cloudinary CDN for the About Doctor section layout."
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
                Save Image Uploads
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Clinical Services */}
        {activeTab === "services" && (
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Clinical Services</h2>
              <Button type="button" onClick={handleAddService} variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Add New Service
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              {data.services?.map((serv, index) => (
                <div key={serv.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-4 relative">
                  <button
                    type="button"
                    onClick={() => handleDeleteService(serv.id)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Service Title"
                      value={serv.title}
                      onChange={(e) => {
                        const newServices = [...(data.services || [])];
                        newServices[index].title = e.target.value;
                        setData({ ...data, services: newServices });
                      }}
                    />

                    <Input
                      label="Estimated Duration"
                      value={serv.estimatedDuration}
                      onChange={(e) => {
                        const newServices = [...(data.services || [])];
                        newServices[index].estimatedDuration = e.target.value;
                        setData({ ...data, services: newServices });
                      }}
                    />
                  </div>

                  <Textarea
                    label="Short Summary"
                    value={serv.shortDescription}
                    onChange={(e) => {
                      const newServices = [...(data.services || [])];
                      newServices[index].shortDescription = e.target.value;
                      setData({ ...data, services: newServices });
                    }}
                  />

                  <ImageUploader
                    label="Service Cover Image (Cloudinary CDN)"
                    value={serv.image || ""}
                    publicId={serv.imagePublicId || ""}
                    folder="services"
                    onChange={(url, publicId) => {
                      const newServices = [...(data.services || [])];
                      newServices[index].image = url;
                      newServices[index].imagePublicId = publicId;
                      setData({ ...data, services: newServices });
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button onClick={handleSave} variant="primary" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
                Save Services Changes
              </Button>
            </div>
          </div>
        )}

        {/* Tab 4: Clinic Gallery */}
        {activeTab === "gallery" && (
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Clinic Gallery Photos</h2>
              <Button type="button" onClick={handleAddGalleryItem} variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Add Gallery Photo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.gallery?.map((item, index) => (
                <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-4 relative">
                  <button
                    type="button"
                    onClick={() => handleDeleteGalleryItem(item.id)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Input
                    label="Photo Title"
                    value={item.title}
                    onChange={(e) => {
                      const newGallery = [...(data.gallery || [])];
                      newGallery[index].title = e.target.value;
                      setData({ ...data, gallery: newGallery });
                    }}
                  />

                  <ImageUploader
                    label="Gallery Photo (Cloudinary CDN)"
                    value={item.image || ""}
                    publicId={item.imagePublicId || ""}
                    folder="gallery"
                    onChange={(url, publicId) => {
                      const newGallery = [...(data.gallery || [])];
                      newGallery[index].image = url;
                      newGallery[index].imagePublicId = publicId;
                      setData({ ...data, gallery: newGallery });
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button onClick={handleSave} variant="primary" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
                Save Gallery Changes
              </Button>
            </div>
          </div>
        )}

        {/* Tab 5: Health Articles & Blog */}
        {activeTab === "blog" && (
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Health Articles & Blog Posts</h2>
                <p className="text-xs text-slate-500 mt-1">Upload, edit, and publish patient guidance articles on your portfolio.</p>
              </div>
              <Button type="button" onClick={handleAddBlogPost} variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Create New Blog Post
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              {data.blog?.map((post, index) => (
                <div key={post.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-4 relative">
                  <button
                    type="button"
                    onClick={() => handleDeleteBlogPost(post.id)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <Input
                        label="Article Title"
                        value={post.title}
                        onChange={(e) => {
                          const newBlog = [...(data.blog || [])];
                          newBlog[index].title = e.target.value;
                          setData({ ...data, blog: newBlog });
                        }}
                      />
                    </div>
                    <Input
                      label="Category"
                      value={post.category}
                      onChange={(e) => {
                        const newBlog = [...(data.blog || [])];
                        newBlog[index].category = e.target.value;
                        setData({ ...data, blog: newBlog });
                      }}
                      placeholder="e.g. Dental Care"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Input
                      label="Article Custom URL Slug"
                      value={post.slug || ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const slugified = raw.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
                        const newBlog = [...(data.blog || [])];
                        newBlog[index].slug = slugified;
                        setData({ ...data, blog: newBlog });
                      }}
                      placeholder="e.g. dental-caries-prevention-guide"
                    />
                    <span className="text-[11px] font-medium text-slate-500">
                      Live Article Link: <code className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">/blog/{post.slug || post.id}</code>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Read Time"
                      value={post.readTime}
                      onChange={(e) => {
                        const newBlog = [...(data.blog || [])];
                        newBlog[index].readTime = e.target.value;
                        setData({ ...data, blog: newBlog });
                      }}
                      placeholder="e.g. 5 min read"
                    />
                    <Input
                      label="Published Date"
                      value={post.date}
                      onChange={(e) => {
                        const newBlog = [...(data.blog || [])];
                        newBlog[index].date = e.target.value;
                        setData({ ...data, blog: newBlog });
                      }}
                      placeholder="e.g. Aug 04, 2026"
                    />
                  </div>

                  <Textarea
                    label="Article Excerpt (Short Summary)"
                    value={post.excerpt}
                    onChange={(e) => {
                      const newBlog = [...(data.blog || [])];
                      newBlog[index].excerpt = e.target.value;
                      setData({ ...data, blog: newBlog });
                    }}
                  />

                  <Textarea
                    label="Full Article Content"
                    value={post.content}
                    onChange={(e) => {
                      const newBlog = [...(data.blog || [])];
                      newBlog[index].content = e.target.value;
                      setData({ ...data, blog: newBlog });
                    }}
                  />

                  <ImageUploader
                    label="Featured Article Cover Image (Cloudinary CDN)"
                    value={post.featuredImage || ""}
                    publicId={post.featuredImagePublicId || ""}
                    folder="blogs"
                    onChange={(url, publicId) => {
                      const newBlog = [...(data.blog || [])];
                      newBlog[index].featuredImage = url;
                      newBlog[index].featuredImagePublicId = publicId;
                      setData({ ...data, blog: newBlog });
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button onClick={handleSave} variant="primary" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
                Save Blog Changes
              </Button>
            </div>
          </div>
        )}

        {/* Tab 6: SEO & Meta Tags */}
        {activeTab === "seo" && (
          <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span>SEO & Search Engine Optimization Meta Tags</span>
                <p className="text-xs text-slate-500 mt-1 font-normal">Optimize your website ranking on Google, Bing & Social Media previews.</p>
              </div>
            </h2>

            <Input
              label="SEO Meta Title (<title> Tag)"
              value={data.doctor.seoTitle || ""}
              onChange={(e) =>
                setData({ ...data, doctor: { ...data.doctor, seoTitle: e.target.value } })
              }
              placeholder="e.g. Dr. Farzana Khan Mohima | Lead Dental Surgeon & Specialist"
            />

            <Textarea
              label="SEO Meta Description (<meta name='description'>)"
              value={data.doctor.seoDescription || ""}
              onChange={(e) =>
                setData({ ...data, doctor: { ...data.doctor, seoDescription: e.target.value } })
              }
              placeholder="e.g. Official portfolio of Dr. Farzana Khan Mohima, Lead Dental Surgeon Specialist. Schedule priority consultations..."
            />

            <Textarea
              label="SEO Keywords (Comma Separated)"
              value={data.doctor.seoKeywords || ""}
              onChange={(e) =>
                setData({ ...data, doctor: { ...data.doctor, seoKeywords: e.target.value } })
              }
              placeholder="e.g. Dr. Farzana Khan Mohima, Dental Surgeon Dhaka, Dental Implant Specialist, Paediatric Dentistry"
            />

            <ImageUploader
              label="OpenGraph Social Share Image (Facebook, WhatsApp, Twitter Preview)"
              value={data.doctor.ogImage || ""}
              publicId={(data.doctor as any).ogImagePublicId || ""}
              folder="seo"
              onChange={(url, publicId) =>
                setData({
                  ...data,
                  doctor: {
                    ...data.doctor,
                    ogImage: url,
                    ogImagePublicId: publicId,
                  } as any,
                })
              }
              helperText="Upload image for link previews when sharing your portfolio link on WhatsApp, Facebook, or Twitter."
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
                Save SEO Settings
              </Button>
            </div>
          </form>
        )}

        {/* Tab 7: MySQL Database Setup */}
        {activeTab === "database" && (
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Destination MySQL DATABASE_URL Settings</span>
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  data.isDatabaseConnected
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>{data.isDatabaseConnected ? "MySQL Connected & Active" : "Fallback Mode"}</span>
              </div>
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Paste your destination database connection URL below. Any details, clinical services, gallery photos, articles, or uploaded pictures will automatically sink into your destination MySQL database!
            </p>

            <form onSubmit={handleSave} className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <Input
                label="MySQL DATABASE_URL Connection String"
                value={(data as any).databaseUrl || ""}
                onChange={(e) =>
                  setData({ ...data, databaseUrl: e.target.value } as any)
                }
                placeholder="mysql://user:password@host:port/database"
              />

              <div className="flex justify-end">
                <Button type="submit" variant="primary" isLoading={saving} leftIcon={<Database className="w-4 h-4" />}>
                  Connect & Sync Destination Database
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Modal: Add / Edit Chamber / Clinic */}
        {showClinicModal && editingClinic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-[28px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative text-slate-900">
              <button
                onClick={() => {
                  setShowClinicModal(false);
                  setEditingClinic(null);
                }}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>{editingClinic.id ? "Edit Chamber / Clinic" : "Add New Chamber / Clinic"}</span>
              </h3>

              <form onSubmit={handleSaveClinicSubmit} className="flex flex-col gap-4">
                <Input
                  label="Chamber / Clinic Name"
                  placeholder="e.g. Aveek's Dental and Implant Center(Sat-Thu)"
                  required
                  value={editingClinic.clinicName || ""}
                  onChange={(e) => setEditingClinic({ ...editingClinic, clinicName: e.target.value })}
                />

                <Input
                  label="Address / Location"
                  placeholder="e.g. House 42, Road 4, Mohakhali DOHS, Dhaka"
                  required
                  value={editingClinic.address || ""}
                  onChange={(e) => setEditingClinic({ ...editingClinic, address: e.target.value })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Contact Phone"
                    placeholder="+880 1531714840"
                    value={editingClinic.phone || ""}
                    onChange={(e) => setEditingClinic({ ...editingClinic, phone: e.target.value })}
                  />

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Chamber Status
                    </label>
                    <select
                      value={editingClinic.status || "Active"}
                      onChange={(e) => setEditingClinic({ ...editingClinic, status: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Opening Time"
                    placeholder="e.g. 09:00 AM"
                    value={editingClinic.openingTime || "09:00 AM"}
                    onChange={(e) => setEditingClinic({ ...editingClinic, openingTime: e.target.value })}
                  />

                  <Input
                    label="Closing Time"
                    placeholder="e.g. 08:00 PM"
                    value={editingClinic.closingTime || "08:00 PM"}
                    onChange={(e) => setEditingClinic({ ...editingClinic, closingTime: e.target.value })}
                  />
                </div>

                <Input
                  label="Working Days (Comma separated)"
                  placeholder="Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday"
                  value={Array.isArray(editingClinic.workingDays) ? editingClinic.workingDays.join(", ") : editingClinic.workingDays || ""}
                  onChange={(e) =>
                    setEditingClinic({
                      ...editingClinic,
                      workingDays: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowClinicModal(false);
                      setEditingClinic(null);
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={savingClinic}
                    leftIcon={<Check className="w-4 h-4" />}
                    className="bg-blue-600 hover:bg-blue-700 font-bold"
                  >
                    Save Chamber Details
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add / Edit Time Slot */}
        {showSlotModal && editingSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative text-slate-900">
              <button
                onClick={() => {
                  setShowSlotModal(false);
                  setEditingSlot(null);
                }}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>{editingSlot.id ? "Edit Time Slot" : "Add New Time Slot"}</span>
              </h3>

              <form onSubmit={handleSaveSlotSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Day of Week <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editingSlot.dayOfWeek || "Saturday"}
                    onChange={(e) => setEditingSlot({ ...editingSlot, dayOfWeek: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  >
                    {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Time"
                    placeholder="e.g. 09:00 AM"
                    required
                    value={editingSlot.startTime || ""}
                    onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value })}
                  />

                  <Input
                    label="End Time"
                    placeholder="e.g. 09:30 AM"
                    required
                    value={editingSlot.endTime || ""}
                    onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Max Patient Capacity"
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={editingSlot.maxCapacity || 2}
                    onChange={(e) => setEditingSlot({ ...editingSlot, maxCapacity: Number(e.target.value) })}
                  />

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Slot Status
                    </label>
                    <select
                      value={editingSlot.status || "Active"}
                      onChange={(e) => setEditingSlot({ ...editingSlot, status: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSlotModal(false);
                      setEditingSlot(null);
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={savingSlot}
                    leftIcon={<Check className="w-4 h-4" />}
                    className="bg-blue-600 hover:bg-blue-700 font-bold"
                  >
                    Save Slot
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
