"use client"
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useEffect, useState } from "react";

interface LoadingStateProps {
    isPLoading: boolean;
    setIsPLoading: (load: boolean) => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ setIsPLoading }) => {
    const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; opacity: number }[]>([]);
    const [loadingText, setLoadingText] = useState("Connecting to the cosmos...");
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const loadingMessages = [
        "Connecting to the cosmos...",
        "Gathering stardust...",
        "Aligning with the universe...",
        "Preparing your manifestation journey...",
        "Unfolding celestial magic...",
    ];

    useEffect(() => {
        // Generate random stars
        const generateStars = () => {
            const newStars = [];
            for (let i = 0; i < 100; i++) {
                newStars.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.8 + 0.2
                });
            }
            setStars(newStars);
        };

        generateStars();
    }, []);

    useEffect(() => {
        if (isLoading) {
            // Cycle through loading messages
            let messageIndex = 0;
            const messageInterval = setInterval(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                setLoadingText(loadingMessages[messageIndex]);
            }, 2000);

            return () => clearInterval(messageInterval);
        }
    }, [isLoading]);

    const handlePlayClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsPLoading(false);
        }, 3000);
    };


    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
            {/* Stars background */}
            <div className="absolute inset-0 overflow-hidden">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute rounded-full bg-white animate-pulse"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                            animationDuration: `${Math.random() * 3 + 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Galaxy swirl effect */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-900/30 via-violet-800/20 to-transparent animate-spin-slow"
                    style={{ animationDuration: '30s' }}></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Play Button */}
                {!isLoading && (
                    <button
                        onClick={handlePlayClick}
                        className="cursor-pointer text-white px-4 py-2 rounded-md mb-4"
                    >
                        <Play size={40} />
                    </button>
                )}

                {/* Loading Icon */}
                {isLoading && (
                    <motion.div
                        className="w-24 h-24 mb-8 rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-blue-500 flex items-center justify-center"
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360],
                            boxShadow: [
                                "0 0 15px 4px rgba(139, 92, 246, 0.4)",
                                "0 0 30px 8px rgba(139, 92, 246, 0.6)",
                                "0 0 15px 4px rgba(139, 92, 246, 0.4)"
                            ]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                        >
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                    </motion.div>
                )}

                {/* Loading Text */}
                {isLoading && (
                    <motion.h2
                        key={loadingText}
                        className="text-2xl font-raleway font-bold text-white mb-8 min-h-[2.5rem] text-center tracking-wide"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                    >
                        {loadingText}
                    </motion.h2>
                )}

                {/* Loading Bar */}
                {isLoading && (
                    <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-cyan-400"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
export default LoadingState;