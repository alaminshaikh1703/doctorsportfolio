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
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { ImageUploader } from "../../components/ui/ImageUploader";
import { FullPortfolioData } from "../../lib/getDoctorData";
import { MedicalService, GalleryItem } from "../../types";

export default function AdminDashboard() {
  const [data, setData] = useState<FullPortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "images" | "services" | "gallery" | "database">("profile");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const res = await fetch("/api/doctor-data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch doctor data:", err);
    }
  };

  const handleAddService = () => {
    if (!data) return;
    const newService: MedicalService = {
      id: `service_${Date.now()}`,
      title: "New Clinical Service",
      shortDescription: "Enter description of this medical procedure or service.",
      fullDescription: "",
      iconName: "Stethoscope",
      image: "https://aavisstudio.com/wp-content/uploads/2026/07/farzana-khan-mohima.png",
      keyBenefits: ["Advanced Diagnostic Precision", "Compassionate Patient Care"],
      estimatedDuration: "45 mins",
      category: "clinical",
    };
    setData({ ...data, services: [...data.services, newService] });
  };

  const handleDeleteService = (index: number) => {
    if (!data) return;
    const updatedServices = data.services.filter((_, i) => i !== index);
    setData({ ...data, services: updatedServices });
  };

  const handleAddGalleryItem = () => {
    if (!data) return;
    const newGalleryItem: GalleryItem = {
      id: `gallery_${Date.now()}`,
      title: "New Clinic Facility Photo",
      category: "clinic",
      image: "https://aavisstudio.com/wp-content/uploads/2026/07/farzana-khan-mohima.png",
      caption: "High precision medical facility photo.",
    };
    setData({ ...data, gallery: [...(data.gallery || []), newGalleryItem] });
  };

  const handleDeleteGalleryItem = (index: number) => {
    if (!data) return;
    const updatedGallery = (data.gallery || []).filter((_, i) => i !== index);
    setData({ ...data, gallery: updatedGallery });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
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
          databaseUrl: (data as any).databaseUrl || "",
        }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage({ text: "Portfolio details & image uploads synced successfully!", type: "success" });
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

  if (!data) {
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
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-white tracking-tight">Doctor Portfolio Admin Panel</h1>
                <span className="text-xs text-blue-400 font-medium">Manage Doctor Information, Image Uploads & MySQL</span>
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
            { id: "images", label: "Hero & Section Image Uploads", icon: ImageIcon },
            { id: "services", label: "Clinical Services", icon: Stethoscope },
            { id: "gallery", label: "Clinic Gallery", icon: ImageIcon },
            { id: "database", label: "MySQL Setup & SQL Schema", icon: Database },
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      ...(publicId !== undefined ? { heroImagePublicId: publicId } : {}),
                    },
                  })
                }
                description="Upload image directly to Cloudinary CDN for the main Hero Section doctor portrait."
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
                      ...(publicId !== undefined ? { aboutImagePublicId: publicId } : {}),
                    },
                  })
                }
                description="Upload image directly to Cloudinary CDN for the About Doctor section layout."
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" variant="primary" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
                Save Image Uploads
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Clinical Services */}
        {activeTab === "services" && (
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Manage Clinical Services</h2>
                <span className="text-xs text-slate-500 font-medium">Add, edit, upload images, or delete medical services displayed on your website.</span>
              </div>
              <Button
                type="button"
                onClick={handleAddService}
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4 text-blue-600" />}
              >
                Add New Service
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              {data.services.map((serv, index) => (
                <div key={serv.id} className="p-5 rounded-[20px] bg-slate-50 border border-slate-200 flex flex-col gap-4 relative group">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Service #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(index)}
                      className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full border border-red-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Service Title"
                      value={serv.title}
                      onChange={(e) => {
                        const newServices = [...data.services];
                        newServices[index].title = e.target.value;
                        setData({ ...data, services: newServices });
                      }}
                    />
                    <Input
                      label="Estimated Duration"
                      value={serv.estimatedDuration}
                      onChange={(e) => {
                        const newServices = [...data.services];
                        newServices[index].estimatedDuration = e.target.value;
                        setData({ ...data, services: newServices });
                      }}
                    />
                  </div>

                  <ImageUploader
                    label="Service Cover Image"
                    value={serv.image}
                    publicId={(serv as any).imagePublicId || ""}
                    folder="services"
                    onChange={(url, publicId) => {
                      const newServices = [...data.services];
                      newServices[index].image = url;
                      if (publicId !== undefined) (newServices[index] as any).imagePublicId = publicId;
                      setData({ ...data, services: newServices });
                    }}
                    description="Upload image directly to Cloudinary CDN for this clinical service card."
                  />

                  <Textarea
                    label="Short Description"
                    value={serv.shortDescription}
                    onChange={(e) => {
                      const newServices = [...data.services];
                      newServices[index].shortDescription = e.target.value;
                      setData({ ...data, services: newServices });
                    }}
                  />
                </div>
              ))}

              {data.services.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-[20px] border border-dashed border-slate-300">
                  <p className="text-sm font-semibold text-slate-600">No clinical services found.</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">Click below to add your first medical service.</p>
                  <Button type="button" onClick={handleAddService} variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    Add New Service
                  </Button>
                </div>
              )}
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Manage Clinic & Diagnostics Gallery</h2>
                <span className="text-xs text-slate-500 font-medium">
                  Add, edit photo names, category, caption details, upload images, or delete gallery photos displayed on your website.
                </span>
              </div>
              <Button
                type="button"
                onClick={handleAddGalleryItem}
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4 text-blue-600" />}
              >
                Add New Gallery Photo
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              {(data.gallery || []).map((item, index) => (
                <div key={item.id} className="p-5 rounded-[20px] bg-slate-50 border border-slate-200 flex flex-col gap-4 relative group">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Photo #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryItem(index)}
                      className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full border border-red-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Photo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Photo Name / Title"
                      value={item.title}
                      onChange={(e) => {
                        const newGallery = [...(data.gallery || [])];
                        newGallery[index].title = e.target.value;
                        setData({ ...data, gallery: newGallery });
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Category</label>
                      <select
                        value={item.category}
                        onChange={(e) => {
                          const newGallery = [...(data.gallery || [])];
                          newGallery[index].category = e.target.value as any;
                          setData({ ...data, gallery: newGallery });
                        }}
                        className="w-full bg-white text-slate-900 rounded-xl px-4 py-2.5 text-sm border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                      >
                        <option value="clinic">Clinic</option>
                        <option value="consultation">Consultation</option>
                        <option value="equipment">Equipment</option>
                        <option value="certificates">Certificates</option>
                        <option value="reception">Reception</option>
                      </select>
                    </div>
                  </div>

                  <ImageUploader
                    label="Gallery Photo Image"
                    value={item.image}
                    publicId={(item as any).imagePublicId || ""}
                    folder="gallery"
                    onChange={(url, publicId) => {
                      const newGallery = [...(data.gallery || [])];
                      newGallery[index].image = url;
                      if (publicId !== undefined) (newGallery[index] as any).imagePublicId = publicId;
                      setData({ ...data, gallery: newGallery });
                    }}
                    description="Upload image directly to Cloudinary CDN for this clinic photo item."
                  />

                  <Input
                    label="Details / Caption"
                    value={item.caption || ""}
                    onChange={(e) => {
                      const newGallery = [...(data.gallery || [])];
                      newGallery[index].caption = e.target.value;
                      setData({ ...data, gallery: newGallery });
                    }}
                    placeholder="e.g. Ultra-Low Dose Fluoroscopy System"
                  />
                </div>
              ))}

              {(!data.gallery || data.gallery.length === 0) && (
                <div className="text-center py-12 bg-slate-50 rounded-[20px] border border-dashed border-slate-300">
                  <p className="text-sm font-semibold text-slate-600">No gallery photos found.</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">Click below to add your first clinic photo.</p>
                  <Button type="button" onClick={handleAddGalleryItem} variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    Add New Gallery Photo
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button onClick={handleSave} variant="primary" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
                Save Gallery Changes
              </Button>
            </div>
          </div>
        )}

        {/* Tab 5: MySQL Database Setup */}
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
              Paste your destination database connection URL below. Any details, clinical services, or uploaded pictures will automatically sink into your destination MySQL database!
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

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" isLoading={saving} leftIcon={<Database className="w-4 h-4" />}>
                  Connect & Sync Destination Database
                </Button>
              </div>
            </form>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Manual Environment Configuration (.env.local)</h3>
              <p className="text-xs text-slate-600 mb-3">
                Alternatively, you can add <code>DATABASE_URL</code> directly to your <code>.env.local</code> file:
              </p>
              <pre className="p-4 rounded-xl bg-slate-900 text-blue-300 text-xs font-mono overflow-x-auto">
DATABASE_URL=&quot;mysql://user:password@host:3306/database_name&quot;
              </pre>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-sm font-bold text-slate-900 block">Download Backup SQL Schema Script</span>
                <span className="text-xs text-slate-600">
                  Tables are automatically initialized when saving. You can also import this SQL file manually into PHPMyAdmin.
                </span>
              </div>
              <a
                href="/scripts/schema.sql"
                download
                className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shrink-0"
              >
                Download schema.sql
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

