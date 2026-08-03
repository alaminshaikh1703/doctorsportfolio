"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { SectionTitle } from "../components/ui/SectionTitle";
import { GALLERY_DATA } from "../constants/doctorData";
import { GalleryItem } from "../types";
import { DEFAULT_BLUR_DATA_URL } from "../lib/imagePlaceholders";
import { fadeUpVariant } from "../animations/variants";

const CATEGORIES = ["All", "Clinic", "Consultation", "Equipment", "Certificates"] as const;

interface GallerySectionProps {
  gallery?: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery = GALLERY_DATA }) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems = gallery.filter((item) =>
    activeCategory === "All" ? true : item.category.toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <section id="gallery" className="py-20 lg:py-32 bg-white relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          label="Gallery"
          title="Inside Our Dental Clinic"
          subtitle="Modern facilities designed for comfortable dental treatment."
          align="center"
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              onClick={() => setSelectedImage(item)}
              className="group relative aspect-[4/3] rounded-[20px] overflow-hidden bg-slate-100 border border-slate-200/80 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg">
                  <ZoomIn className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent text-white">
                <span className="text-xs font-bold block">{item.title}</span>
                <span className="text-[10px] text-slate-300 capitalize">{item.category}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full bg-white rounded-[24px] overflow-hidden shadow-2xl border border-white/20 p-2"
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="relative aspect-[16/10] w-full rounded-[18px] overflow-hidden bg-slate-100">
                  <Image
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {selectedImage.title}
                  </h3>
                  <p className="text-sm text-slate-600">{selectedImage.caption}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
