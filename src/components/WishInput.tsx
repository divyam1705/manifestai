"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Send, Stars, Lightbulb, WandSparkles } from 'lucide-react';
import { SparklesText } from './magicui/sparkles-text';
import { TextAnimate } from './magicui/text-animate';
import { ShimmerButton } from './magicui/shimmer-button';
import { ShinyButton } from './magicui/shiny-button';

// Sample wishes for suggestions
const sampleWishes = [
    "I want to become a software engineer in 6 months",
    "I want to lose 20 pounds by summer",
    "I want to launch my own business this year",
    "I want to learn to speak Spanish fluently",
    "I want to write a novel in the next 3 months"
];

const WishInput = () => {
    const [wish, setWish] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [currentWishIndex, setCurrentWishIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // Typing animation effect
    useEffect(() => {
        const typingInterval = 80; // Speed of typing
        const deletingInterval = 40; // Speed of deleting (faster)
        const pauseDuration = 1500; // Pause at complete word

        let timeout: NodeJS.Timeout;

        // If typing forward
        if (!isDeleting) {
            if (currentCharIndex < sampleWishes[currentWishIndex].length) {
                // Still typing current word
                timeout = setTimeout(() => {
                    setDisplayText(sampleWishes[currentWishIndex].substring(0, currentCharIndex + 1));
                    setCurrentCharIndex(currentCharIndex + 1);
                }, typingInterval);
            } else {
                // Finished typing, pause before deleting
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, pauseDuration);
            }
        } else if (isDeleting) {
            // Deleting
            if (currentCharIndex > 0) {
                timeout = setTimeout(() => {
                    setDisplayText(sampleWishes[currentWishIndex].substring(0, currentCharIndex - 1));
                    setCurrentCharIndex(currentCharIndex - 1);
                }, deletingInterval);
            } else {
                // Finished deleting, move to next word
                setIsDeleting(false);
                setCurrentWishIndex((currentWishIndex + 1) % sampleWishes.length);
            }
        }

        return () => clearTimeout(timeout);
    }, [currentCharIndex, currentWishIndex, isDeleting]);

    const handleWishSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!wish.trim()) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);

            // Hide success message after 3s
            setTimeout(() => {
                setShowSuccess(false);
                setWish('');
            }, 3000);
        }, 1500);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setWish(suggestion);
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative"
            >
                {/* Enhanced glow behind card */}
                <div className="absolute -inset-4 bg-blue-500/5 rounded-xl blur-xl"></div>
                <div className="absolute -inset-4 bg-slate-500/5 rounded-xl blur-lg rotate-180"></div>

                <Card className="relative border border-white/10 bg-black/50 backdrop-blur-md shadow-2xl overflow-hidden">
                    {/* Subtle highlight at top */}
                    <div className="p-0.5 bg-gradient-to-r from-blue-500/20 via-slate-500/10 to-slate-400/20"></div>

                    <CardHeader className="pb-3 pt-6">
                        <div className="flex items-center space-x-2">
                            <WandSparkles className="h-6 w-6 text-blue-400" />
                            <CardTitle className="text-2xl font-heading tracking-wide text-white">


                                <SparklesText sparklesCount={3} className='text-3xl' text="Make a Wish" />
                            </CardTitle>
                        </div>
                        <CardDescription className="text-slate-400 font-light text-lg">
                            Tell us your wish, and we&apos;ll create a personalized plan to make it a reality.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-5">
                        <form onSubmit={handleWishSubmit} className="space-y-5">
                            <div className="relative">

                                <Textarea
                                    placeholder={displayText || "I want to..."}
                                    value={wish}
                                    onChange={(e) => setWish(e.target.value)}
                                    className="min-h-[140px] text-lg bg-slate-900/60 border-slate-800/70 text-white placeholder:text-slate-500 py-4 px-4 text-base resize-none"
                                />

                                {/* Animated cursor for placeholder */}
                                {!wish && (
                                    <span className="absolute right-3 bottom-3 h-5 w-0.5 bg-slate-500 animate-blink"></span>
                                )}

                                <div className="mt-5 flex justify-end">

                                    <Button
                                        type="submit"
                                        disabled={!wish.trim() || isSubmitting}
                                        className={`${isSubmitting ? 'bg-slate-800' : 'bg-purple-600 hover:bg-purple-700'} tracking-wide cursor-pointer text-white rounded-   `}
                                    >
                                        {isSubmitting ? (
                                            <span className="!text-white flex items-center">
                                                <Stars className="h-5 w-5 mr-2 animate-pulse" />
                                                Manifesting...
                                            </span>
                                        ) : (
                                            <span className="!text-white flex items-center ">
                                                <Send className="h-5 w-5 mr-2" />
                                                Manifest
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="p-4 rounded-lg bg-slate-900/70 border border-emerald-500/30 text-emerald-300 flex items-center"
                                    >
                                        <Sparkles className="h-5 w-5 mr-3 text-emerald-400" />
                                        <span className="text-lg">Your wish has been received! We&apos;re creating your manifest.</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </CardContent>

                    <CardFooter className="flex-col items-start border-t border-slate-800/30 bg-slate-900/30 pt-5 pb-6">
                        <div className="flex items-center mb-3 text-sm text-slate-400">
                            <Lightbulb className="h-4 w-4 mr-2 text-amber-400" />
                            <span className="font-light">Need inspiration? Try one of these:</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {sampleWishes.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className="text-sm px-3 py-2 bg-slate-800/50 hover:bg-slate-700/60 text-slate-300 rounded-full transition-colors"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion.length > 30
                                        ? suggestion.substring(0, 30) + "..."
                                        : suggestion}
                                </button>
                            ))}
                        </div>
                    </CardFooter>

                    {/* Enhanced glows */}
                    <div className="absolute top-0 right-0 -mt-6 -mr-6">
                        <div className="w-24 h-24 bg-blue-500/10 blur-2xl rounded-full"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 -mb-6 -ml-6">
                        <div className="w-24 h-24 bg-slate-400/10 blur-2xl rounded-full"></div>
                    </div>
                </Card>
            </motion.div>


        </div>
    );
};

export default WishInput; 