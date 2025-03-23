"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronLeft } from "lucide-react";
import CelestialBackground from "@/components/CelestialBackground";

// Define our preference questions and options
const preferenceQuestions = [
    {
        id: "chronotype",
        title: "Chronotype (Best Productivity Hours)",
        description: "This determines whether you are a morning or night person, optimizing your schedule accordingly.",
        options: [
            { value: "early_bird", label: "🌅 Early Bird", description: "Productive in the morning (6 AM - 12 PM)" },
            { value: "night_owl", label: "🌙 Night Owl", description: "Best focus at night (8 PM - 2 AM)" },
            { value: "balanced", label: "⏳ Balanced", description: "Steady energy throughout the day" },
            { value: "varies", label: "🔄 Varies", description: "Depends on the day" },
        ],
    },
    {
        id: "focus_style",
        title: "Focus Style & Deep Work Preference",
        description: "This helps in structuring focus sessions effectively.",
        options: [
            { value: "deep_work", label: "⏳ Deep Work Blocks (90-120 mins)", description: "Fewer, longer focused sessions" },
            { value: "pomodoro", label: "🍅 Pomodoro Technique", description: "25 min work, 5 min break - Best for short bursts" },
            { value: "flexible", label: "🔀 Flexible", description: "Work Until Tired, Then Break - No fixed structure" },
            { value: "frequent_breaks", label: "🏃 Frequent Breaks", description: "Short Work, More Breaks - Works best with multiple breaks" },
        ],
    },
    {
        id: "energy_waves",
        title: "Energy & Productivity Waves Throughout the Day",
        description: "Determines when to schedule high-focus vs. low-focus tasks.",
        options: [
            { value: "morning_peak", label: "🌞 Morning Peak, Evening Low", description: "Work best in the morning" },
            { value: "afternoon_peak", label: "🌆 Afternoon Peak, Slow Start", description: "Energy rises after 12 PM" },
            { value: "night_peak", label: "🌃 Night Peak, Morning Low", description: "Best at night" },
            { value: "fluctuating", label: "🔄 Fluctuating", description: "Varies Daily" },
        ],
    },
    {
        id: "break_type",
        title: "Preferred Break Type",
        description: "Defines how you recharge between tasks.",
        options: [
            { value: "physical", label: "🚶 Short Walks/Stretching", description: "Physical movement" },
            { value: "mental", label: "🧘 Meditation/Deep Breathing", description: "Mental reset" },
            { value: "media", label: "🎧 Music/Podcasts/Youtube", description: "Passive relaxation" },
            { value: "food", label: "🍎 Snack Breaks", description: "Refresh with food/drink" },
            { value: "no_breaks", label: "⏳ No breaks needed", description: "Work straight through" },
        ],
    },
    {
        id: "wellness",
        title: "Exercise & Meditation Inclusion",
        description: "Encourages adding wellness activities to schedule with scientific benefits.",
        options: [
            { value: "exercise", label: "✅ Yes, daily exercise", description: "Strength, Cardio, Yoga, etc." },
            { value: "meditation", label: "✅ Yes, meditation/breathing exercises", description: "Daily mindfulness practice" },
            { value: "both", label: "✅ Yes, both exercise and meditation", description: "Complete wellness routine" },
            { value: "none", label: "❌ No, I don't want these scheduled", description: "Skip wellness activities" },
        ],
        facts: [
            "Exercise improves cognitive function & memory (Harvard Study).",
            "Meditation enhances focus & reduces stress (Mindfulness Research)."
        ]
    },
    {
        id: "sleep",
        title: "Sleep Schedule & Bedtime",
        description: "Optimizes late-night or early-morning tasks based on your sleep routine.",
        options: [
            { value: "early", label: "🌙 I sleep early", description: "Before 10 PM - Morning tasks preferred" },
            { value: "late", label: "🕛 I sleep late", description: "12 AM - 2 AM - Night focus preferred" },
            { value: "varies", label: "⏳ It varies daily", description: "Flexible schedule" },
        ],
    },
];

export default function PreferencesPage() {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [preferences, setPreferences] = useState<Record<string, string>>({});

    const currentQuestion = preferenceQuestions[currentQuestionIndex];
    const totalQuestions = preferenceQuestions.length;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    const handleOptionSelect = (value: string) => {
        setPreferences({
            ...preferences,
            [currentQuestion.id]: value,
        });

        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Save preferences to localStorage before redirecting
            localStorage.setItem('userPreferences', JSON.stringify({
                ...preferences,
                [currentQuestion.id]: value
            }));

            // Redirect to schedule input page
            router.push("/schedule-input");
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    return (
        <div className=" w-full overflow-hidden relative flex items-center justify-center py-30 sm:py-30 md:py-30">
            {/* Celestial Background */}
            <CelestialBackground fullScreen={true} className="absolute inset-0" />

            <div className="relative z-10 w-full px-3 sm:px-4 md:px-6">
                <div className="w-full max-w-3xl mx-auto">
                    {/* Progress indicator */}
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                        <span className="text-xs sm:text-sm text-gray-300 font-medium">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                        <span className="text-xs sm:text-sm text-gray-300">{Math.round(progress)}% Complete</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-900/60 h-1.5 sm:h-2 rounded-full overflow-hidden mb-4 sm:mb-6">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <Card className="p-4 sm:p-6 md:p-8 backdrop-blur-md bg-black/60 border border-gray-700 shadow-xl rounded-xl">
                            <div className="mb-6 md:mb-8">
                                <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">
                                    {currentQuestion.title}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-300">{currentQuestion.description}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:gap-4">
                                {currentQuestion.options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleOptionSelect(option.value)}
                                        className="flex flex-col p-3 sm:p-4 rounded-lg border border-gray-800 hover:border-blue-500/60 
                    bg-gradient-to-br from-gray-900/80 to-black/80 transition-all duration-200
                    hover:bg-gradient-to-br hover:from-gray-900/90 hover:to-indigo-950/30 
                    hover:shadow-lg hover:shadow-blue-500/20 group text-left
                    active:scale-[0.98] active:bg-gray-900/90 touch-manipulation"
                                    >
                                        <span className="text-lg sm:text-xl mb-1 text-white group-hover:text-blue-400 flex items-center">
                                            <span className="mr-2">{option.label.split(' ')[0]}</span>
                                            <span className="text-gray-200">{option.label.split(' ').slice(1).join(' ')}</span>
                                        </span>
                                        <span className="text-xs sm:text-sm text-gray-400">{option.description}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Additional facts for certain questions */}
                            {currentQuestion.facts && (
                                <div className="mt-5 md:mt-6 pt-4 border-t border-gray-700">
                                    <h4 className="text-gray-300 mb-2 text-xs sm:text-sm font-medium">Did You Know?</h4>
                                    <ul className="text-xs sm:text-sm text-gray-200 space-y-2">
                                        {currentQuestion.facts.map((fact, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="text-blue-400 mr-2">•</span>
                                                <span>{fact}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-6 md:mt-8 flex justify-between items-center">
                                <Button
                                    onClick={handlePrevious}
                                    disabled={currentQuestionIndex === 0}
                                    className="flex items-center text-xs sm:text-sm space-x-1 bg-transparent border border-gray-600 hover:bg-gray-800 hover:border-gray-500 text-white h-8 sm:h-9 px-2 sm:px-4 rounded-md"
                                >
                                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="hidden xs:inline">Previous</span>
                                </Button>

                                {currentQuestionIndex === totalQuestions - 1 ? (
                                    <Button
                                        onClick={() => handleOptionSelect('skip')}
                                        className="flex items-center text-xs sm:text-sm space-x-1 bg-blue-600 hover:bg-blue-700 text-white h-8 sm:h-9 px-3 sm:px-4 ml-auto rounded-md"
                                    >
                                        <span>Finish</span>
                                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                        className="flex items-center text-xs sm:text-sm space-x-1 bg-transparent border border-gray-600 hover:bg-gray-800 hover:border-gray-500 text-white h-8 sm:h-9 px-2 sm:px-4 ml-auto rounded-md"
                                    >
                                        <span className="hidden xs:inline">Skip</span>
                                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 