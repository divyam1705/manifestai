"use client"
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';

interface LoadingStateProps {
    isPLoading: boolean;
    setIsPLoading: (load: boolean) => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ setIsPLoading }) => {
    const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; opacity: number }[]>([]);
    const [loadingText, setLoadingText] = useState("Connecting to the cosmos...");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);


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

        // Check if user is already logged in
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                setUser(data.user);
                startLoading();
            }
        };

        checkUser();
    }, []);

    useEffect(() => {
        if (isLoading) {
            // Cycle through loading messages
            let messageIndex = 0;
            const messageInterval = setInterval(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                setLoadingText(loadingMessages[messageIndex]);
            }, 2000);

            // Set a timeout to complete loading and redirect
            const loadingTimeout = setTimeout(() => {
                setIsPLoading(false);
            }, 4000);

            return () => {
                clearInterval(messageInterval);
                clearTimeout(loadingTimeout);
            };
        }
    }, [isLoading, setIsPLoading]);

    const startLoading = () => {
        setIsLoading(true);
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    scopes: 'https://www.googleapis.com/auth/calendar'
                }
            });

            if (error) {
                console.error('Google login error:', error);
                alert('Login failed. Please try again.');
            } else {
                startLoading();
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
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
                {/* Google Login Button */}
                {!isLoading && !user && (
                    <Button
                        onClick={handleGoogleLogin}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 mb-4 rounded shadow flex items-center gap-2 border border-slate-700"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span>Login with Google</span>
                    </Button>
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
                            transition={{ duration: 4, ease: "easeInOut" }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
export default LoadingState;