"use client"
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CelestialBackground from '@/components/CelestialBackground';
import WishInput from '@/components/WishInput';
import FloatingFeatures from '@/components/FloatingFeatures';
import PricingSection from '@/components/PricingSection';
import MusicController from '@/components/MusicController';
import LoadingState from '@/components/LoadingState';
import { useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="min-h-screen bg-black">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="z-[9999]"
          >
            <LoadingState isPLoading={isLoading} setIsPLoading={setIsLoading} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Music Controller */}
      <MusicController />

      {/* Hero Section with Video Background */}
      <div id="hero" className="relative">
        {/* Video Background for hero and navbar */}
        <CelestialBackground fullScreen={false} className="absolute inset-0 h-[100vh]" />

        {/* Navbar */}
        <div className="relative z-20">
          <Navbar />
        </div>

        <div className="relative z-10 pt-32 pb-20">
          <div className="w-full max-w-6xl mx-auto px-4 relative">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-raleway font-bold mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-300">
                  Transform Your Dreams
                </span>
                <br />
                <span className="text-white">Into Reality</span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >

                Our AI-powered platform builds personalized plans to help you achieve your goals with science-backed methods.
              </motion.p>
            </motion.div>

            {/* Wish Input */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mb-16 relative z-20"
            >
              <WishInput />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Section with Dark Gradient Background */}
      <main className="relative z-10 bg-gradient-to-b from-black to-[#050014] pt-16 pb-20 overflow-hidden">
        {/* Features Section */}
        <section id="features" className="w-full mb-20 py-16  bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#462c4e,#0b0a05_66%,#000000)]">
          <div className="w-full max-w-6xl mx-auto px-4">
            <FloatingFeatures />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full mb-20 py-16 background-nebula-gradient">
          <div className="w-full max-w-6xl mx-auto px-4">
            <PricingSection />
          </div>
        </section>
      </main>
    </div>
  );
}
