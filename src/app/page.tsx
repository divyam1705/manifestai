"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CelestialBackground from '@/components/CelestialBackground';
import WishInput from '@/components/WishInput';
import FloatingFeatures from '@/components/FloatingFeatures';
import PricingSection from '@/components/PricingSection';
import LoadingState from '@/components/LoadingState';
import MusicController from '@/components/MusicController';
import { AuroraText } from '@/components/magicui/aurora-text';
import AddEvent from '@/components/AddEvent';

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
      <div className="relative">
        {/* Video Background for hero and navbar */}
        <CelestialBackground fullScreen={false} className="absolute inset-0 h-[100vh]" />

        {/* Navbar */}


        <div className="relative z-10 pt-32 pb-20">
          <div className="w-full max-w-6xl mx-auto px-4 relative">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl  font-semibold mb-6 font-heading section-title "
                initial={{ opacity: 0, y: 20 }}
                animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {/* bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#7b6717,#0b0a05_66%)] */}

                Transform Your
                Dreams
                <br />
                Into Reality
              </motion.h1>
              {/* <AddEvent /> */}
              <motion.p
                className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto section-description"
                initial={{ opacity: 0, y: 20 }}
                animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Builds personalized plans to help you achieve your goals with science-backed methods.
              </motion.p>
            </motion.div>

            {/* Wish Input */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={!isLoading ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mb-16 relative z-20"
            >
              <WishInput />
            </motion.div>
          </div>
        </div>
      </div >

      {/* Main Content Section with Dark Gradient Background */}
      <main className=" relative z-10 pb-20 overflow-hidden bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#462c4e,#0b0a05_66%,#000000)]" >
        <div className="w-full max-w-6xl mx-auto px-4 ">
          <FloatingFeatures />
        </div>



      </main >
      <main className="relative z-10  pb-20 overflow-hidden background-nebula-gradient" >
        <div className="w-full max-w-6xl mx-auto px-4 ">

          <PricingSection />
        </div>
      </main >
    </div >
  );
}
