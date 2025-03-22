"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';

interface CelestialBackgroundProps {
    fullScreen?: boolean;
    className?: string;
}

const CelestialBackground = ({ fullScreen = false, className = "" }: CelestialBackgroundProps) => {
    const [videoError, setVideoError] = useState(false);

    const handleVideoError = () => {
        console.warn("Video file couldn't be loaded. Using fallback background.");
        setVideoError(true);
    };

    const positionClasses = fullScreen ? "fixed inset-0 z-0" : "absolute inset-0 z-0 rounded-3xl";

    return (
        <div className={`${positionClasses} overflow-hidden ${className}`}>
            {/* Video Background - with fallback */}
            {!videoError ? (
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={handleVideoError}
                    className="absolute w-full h-full object-cover"
                >
                    <source src="/nebula.mp4" type="video/mp4" />
                </video>
            ) : (
                // Fallback gradient background when video fails
                <div className="absolute w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>
            )}

            <div className="absolute w-full h-full bg-black opacity-20"></div>


            {/* Star particles */}
            <div className="stars"></div>

            {/* Floating particles for depth */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full"
                animate={{
                    y: [0, 15, 0],
                    opacity: [0.8, 0.6, 0.8]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className="particles-sm"></div>
            </motion.div>
        </div>
    );
};

export default CelestialBackground; 