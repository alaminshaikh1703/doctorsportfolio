"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ArrowRight, User } from "lucide-react";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { BLOG_DATA } from "../constants/doctorData";
import { DEFAULT_BLUR_DATA_URL } from "../lib/imagePlaceholders";
import { fadeUpVariant } from "../animations/variants";

import { BlogPost } from "../types";

interface BlogSectionProps {
  blog?: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blog = BLOG_DATA }) => {
  return (
    <section id="blog" className="py-20 lg:py-32 bg-slate-50/60 relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <SectionTitle
            label="Health Insights"
            title="Explore Our Latest DentalArticles"
            subtitle="Evidence-based patient guidance on preventive heart care, hypertension control, and vascular health."
            align="left"
            className="mb-0 max-w-2xl"
          />
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All Articles
          </Button>
        </div>

        {/* 3-Column Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blog.map((post) => (
            <motion.div
              key={post.id}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              <Card className="h-full flex flex-col justify-between p-6 bg-white">
                <div>
                  <div className="relative aspect-[16/10] rounded-[16px] overflow-hidden bg-slate-100 mb-5">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      placeholder="blur"
                      blurDataURL={DEFAULT_BLUR_DATA_URL}
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-blue-600 shadow-xs">
                      {post.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span className="font-medium">{post.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">{post.author.name}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group hover:underline">
                    Read article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
