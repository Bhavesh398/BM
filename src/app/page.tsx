'use client';

import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { HeroSection } from '@/components/jalgyan/HeroSection';
import { MicroplasticBody } from '@/components/jalgyan/MicroplasticBody';

import { VideoLibrary } from '@/components/jalgyan/VideoLibrary';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Scroll Expand */}
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/jalgyan%20images/deep-sea-hero.jpg"
        bgImageSrc="/images/back.jpeg"
        overlayLogoSrc="/cyanlogo.svg"
        title="Monitoring today|Cleaner water tomorrow"
        date=""

      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
              Preserving Our Most Vital Resource
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join the mission to monitor, analyze, and improve water quality across the globe.
            Together, we can ensure safe and clean water for everyone.
          </p>
        </div>
      </ScrollExpandMedia>

      {/* SDG-6 Hero Section */}
      <HeroSection />

      {/* Microplastic Crisis - Scrollytelling Section */}
      <MicroplasticBody />

      {/* Survival Library Section */}
      <section className="relative bg-gradient-to-b from-background via-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                The Survival Library
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Essential tools and knowledge for water safety in any situation
            </p>
          </motion.div>



          {/* Video Library */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <VideoLibrary />
          </motion.div>
        </div>
      </section>


    </div>
  );
}

