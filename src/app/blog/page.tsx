import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight, User, BookOpen, ChevronRight, Home } from "lucide-react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { getDoctorData } from "../../lib/getDoctorData";
import { generateMedicalSvgPlaceholder } from "../../lib/imagePlaceholders";

export default async function BlogIndexPage() {
  const data = await getDoctorData();
  const doctor = data.doctor;
  const blogList = data.blog && data.blog.length > 0 ? data.blog : [];

  const featuredPost = blogList[0];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar doctor={doctor} />

      {/* Header Breadcrumb & Hero - Clean Medical Light Design */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200/70 relative">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-blue-600" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-bold">Health Articles</span>
          </div>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-extrabold uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" /> Clinical Patient Education
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
              Dental Health Articles & Insights
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
              Evidence-based medical advice, preventive dental guidelines, treatment explanations, and oral hygiene tips curated directly by Dr. Farzana Khan Mohima.
            </p>
          </div>
        </div>
      </section>

      {/* Main Blog Content Section */}
      <section className="py-16 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        {/* Featured Top Article Banner */}
        {featuredPost && (
          <div className="mb-16 rounded-[28px] bg-white border border-slate-200/80 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[300px] sm:min-h-[400px]">
              <Image
                src={
                  typeof featuredPost.featuredImage === "string" && featuredPost.featuredImage.trim() !== ""
                    ? featuredPost.featuredImage
                    : generateMedicalSvgPlaceholder(featuredPost.title, featuredPost.category, "clinic")
                }
                alt={featuredPost.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                Featured Article • {featuredPost.category}
              </span>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1 font-medium text-blue-600">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
                  <span>•</span>
                  <span>{featuredPost.date}</span>
                </div>

                <Link href={`/blog/${featuredPost.slug || featuredPost.id}`}>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-4 hover:text-blue-600 transition-colors">
                    {featuredPost.title}
                  </h2>
                </Link>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 line-clamp-4 font-normal">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block capitalize">{featuredPost.author.name}</span>
                    <span className="text-[10px] text-slate-500">{featuredPost.author.role}</span>
                  </div>
                </div>

                <Link
                  href={`/blog/${featuredPost.slug || featuredPost.id}`}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* All Articles Section Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <h3 className="text-2xl font-extrabold text-slate-900">
            Latest Published Articles
          </h3>
          <span className="text-xs font-bold text-slate-500">
            Showing {blogList.length} articles
          </span>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogList.map((post) => {
            const blogImgSrc =
              typeof post?.featuredImage === "string" && post.featuredImage.trim() !== ""
                ? post.featuredImage
                : generateMedicalSvgPlaceholder(post?.title || "Medical Article", post?.category || "Health", "clinic");

            const postSlug = post.slug || post.id;

            return (
              <div
                key={post.id}
                className="bg-white rounded-[24px] border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 group"
              >
                <div>
                  <Link href={`/blog/${postSlug}`} className="block relative aspect-[16/10] rounded-[18px] overflow-hidden bg-slate-100 mb-5">
                    <Image
                      src={blogImgSrc}
                      alt={post.title || "Article Image"}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-blue-600 shadow-xs">
                      {post.category}
                    </span>
                  </Link>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span className="font-medium">{post.date}</span>
                  </div>

                  <Link href={`/blog/${postSlug}`}>
                    <h4 className="text-lg font-bold text-slate-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                  </Link>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800 capitalize">{post.author.name}</span>
                  </div>

                  <Link href={`/blog/${postSlug}`} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:underline">
                    <span>Read article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer doctor={doctor} />
    </main>
  );
}
