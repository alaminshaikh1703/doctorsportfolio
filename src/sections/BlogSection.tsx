"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, User } from "lucide-react";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { BLOG_DATA } from "../constants/doctorData";
import { generateMedicalSvgPlaceholder } from "../lib/imagePlaceholders";
import { fadeUpVariant } from "../animations/variants";
import { BlogPost } from "../types";

interface BlogSectionProps {
  blog?: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blog = BLOG_DATA }) => {
  return (
    <section id="blog" className="hidden md:block py-20 lg:py-32 bg-slate-50/60 relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <SectionTitle
            label="Health Insights"
            title="Explore Our Latest Dental Articles"
            subtitle="Evidence-based patient guidance on preventive dental care, oral hygiene, and surgical health."
            align="left"
            className="mb-0 max-w-2xl"
          />
          <Link href="/blog">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Articles
            </Button>
          </Link>
        </div>

        {/* 3-Column Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blog.map((post) => {
            const blogImgSrc =
              typeof post?.featuredImage === "string" && post.featuredImage.trim() !== ""
                ? post.featuredImage
                : generateMedicalSvgPlaceholder(post?.title || "Medical Article", post?.category || "Health", "clinic");

            const postSlug = post.slug || post.id;

            return (
              <motion.div
                key={post.id}
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                <Card className="h-full flex flex-col justify-between p-6 bg-white group hover:shadow-xl transition-all duration-300">
                  <div>
                    <Link href={`/blog/${postSlug}`} className="block relative aspect-[16/10] rounded-[16px] overflow-hidden bg-slate-100 mb-5">
                      <Image
                        src={blogImgSrc}
                        alt={post.title || "Blog Image"}
                        fill
                        sizes="(max-width: 768px) 100vw, 380px"
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
                      <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
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
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
