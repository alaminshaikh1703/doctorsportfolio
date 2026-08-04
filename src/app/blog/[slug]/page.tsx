import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, User, Calendar, Stethoscope, ChevronRight, Home } from "lucide-react";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";
import { getDoctorData } from "../../../lib/getDoctorData";
import { generateMedicalSvgPlaceholder } from "../../../lib/imagePlaceholders";
import { Metadata } from "next";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDoctorData();
  const post = data.blog.find((b) => (b.slug || b.id) === slug || b.id === slug);

  if (!post) {
    return { title: "Article Not Found | Doctor Portfolio" };
  }

  return {
    title: `${post.title} | ${data.doctor.name}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage || data.doctor.heroImage || ""],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const data = await getDoctorData();
  const doctor = data.doctor;
  const post = data.blog.find((b) => (b.slug || b.id) === slug || b.id === slug);

  if (!post) {
    notFound();
  }

  const relatedArticles = data.blog
    .filter((b) => (b.slug || b.id) !== slug)
    .slice(0, 3);

  const heroImgSrc =
    typeof post.featuredImage === "string" && post.featuredImage.trim() !== ""
      ? post.featuredImage
      : generateMedicalSvgPlaceholder(post.title, post.category, "clinic");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar doctor={doctor} />

      {/* Header Banner - Clean & Modern Light Design */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200/70 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-blue-600" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link href="/blog" className="hover:text-blue-600 transition-colors">
              Health Articles
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-[300px]">{post.title}</span>
          </div>

          {/* Badges & Meta */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-extrabold uppercase tracking-wider">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              {post.readTime}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              {post.date}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.2]">
            {post.title}
          </h1>

          {/* Author Profile Info */}
          <div className="flex items-center gap-3 pt-6 border-t border-slate-200/80">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block capitalize">{post.author.name}</span>
              <span className="text-xs text-slate-500 font-medium">{post.author.role}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Article Container */}
      <section className="py-12 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        {/* Featured Image Frame */}
        <div className="relative aspect-[16/9] w-full rounded-[28px] overflow-hidden bg-slate-200 shadow-xl border border-slate-200/80 mb-12">
          <Image
            src={heroImgSrc}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1000px"
            className="object-cover"
          />
        </div>

        {/* Doctor's Clinical Note Callout Box */}
        <div className="p-6 sm:p-8 rounded-[24px] bg-blue-50/90 border border-blue-200/90 mb-10 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider mb-1">
              Clinical Summary & Key Takeaway
            </h4>
            <p className="text-sm sm:text-base text-blue-950 font-semibold leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        </div>

        {/* Article Body Content */}
        <article className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-base sm:text-lg mb-16">
          {post.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Doctor Consultation CTA Banner (100% Readable Text) */}
        <div className="p-8 sm:p-10 rounded-[28px] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-xl border border-blue-500/30 mb-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <span className="text-xs font-black uppercase tracking-wider text-blue-100 block mb-2">
              Have Questions About Your Dental Health?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
              Schedule a Priority Consultation
            </h3>
            <p className="text-xs sm:text-sm text-blue-50 font-medium max-w-xl">
              Get direct clinical diagnosis, personalized treatment options, and expert care from {doctor.name}.
            </p>
          </div>

          <Link
            href="/#appointment"
            className="px-6 py-3.5 rounded-full bg-white hover:bg-blue-50 text-blue-700 text-xs sm:text-sm font-extrabold transition-all shadow-lg shrink-0 whitespace-nowrap"
          >
            Book Appointment
          </Link>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-extrabold text-slate-900">
                Related Health Articles
              </h3>
              <Link href="/blog" className="text-xs font-bold text-blue-600 hover:underline">
                View All Articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => {
                const relImgSrc =
                  typeof rel?.featuredImage === "string" && rel.featuredImage.trim() !== ""
                    ? rel.featuredImage
                    : generateMedicalSvgPlaceholder(rel.title, rel.category, "clinic");

                const relSlug = rel.slug || rel.id;

                return (
                  <Link
                    key={rel.id}
                    href={`/blog/${relSlug}`}
                    className="bg-white rounded-[20px] border border-slate-200/80 overflow-hidden p-4 shadow-xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] rounded-[14px] overflow-hidden bg-slate-100 mb-3">
                        <Image
                          src={relImgSrc}
                          alt={rel.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">
                        {rel.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                        {rel.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 block pt-2 border-t border-slate-100">
                      {rel.readTime}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <Footer doctor={doctor} />
    </main>
  );
}
