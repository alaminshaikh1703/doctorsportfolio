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
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { ImageUploader } from "../../components/ui/ImageUploader";
import { FullPortfolioData, BlogPost } from "../../types";

export default function AdminPage() {
  const [data, setData] = useState<FullPortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "profile" | "images" | "services" | "gallery" | "blog" | "seo" | "database"
  >("profile");

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

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
        {/* Soft Ambient Background Glows */}
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
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Admin Username / Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-white text-slate-900 font-semibold border border-slate-300 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 placeholder-slate-400 transition-all"
                />
              </div>
            </div>

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
                  placeholder="•••••••"
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
      <header className="bg-slate-900 text-white py-6 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="View Live Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-white tracking-tight">Doctor Portfolio Admin Panel</h1>
                <span className="text-xs text-blue-400 font-medium">Manage Doctor Information, Image Uploads, Blog & SEO</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                data.isDatabaseConnected
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                  : "bg-amber-950 text-amber-400 border border-amber-800"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{data.isDatabaseConnected ? "MySQL Connected" : "Static / Fallback Mode"}</span>
            </div>

            <Button
              onClick={handleSave}
              isLoading={saving}
              variant="primary"
              size="sm"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-800 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Log Out of Admin Session"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-8 overflow-x-auto">
          {[
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

        {/* Tab 1: Doctor Profile */}
        {activeTab === "profile" && (
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

              {(!data.blog || data.blog.length === 0) && (
                <div className="text-center py-12 bg-slate-50 rounded-[20px] border border-dashed border-slate-300">
                  <p className="text-sm font-semibold text-slate-600">No blog posts found.</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">Click below to publish your first health article.</p>
                  <Button type="button" onClick={handleAddBlogPost} variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    Create New Blog Post
                  </Button>
                </div>
              )}
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
      </div>
    </div>
  );
}
