"use client"
import { motion } from 'framer-motion';
import { BrainIcon, StarIcon, RocketIcon, CheckIcon, XIcon } from 'lucide-react';

const FloatingFeatures = () => {
    return (
        <div className="relative w-full px-4 mx-auto ">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="text-center mb-16"
            >
                <h2 className="section-title">
                    Supercharge Your Goals
                </h2>
                <p className="section-description">
                    Discover the features that make Manifest AI the ultimate platform for turning dreams into reality
                </p>

                {/* Subtle divider */}
                <div className="w-24 h-1 bg-gradient-to-r to-[#ffffff] via-[#e197bc] from-[#a367de]  rounded-full mx-auto mt-6"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <Feature
                    icon={<BrainIcon className="h-6 w-6 text-blue-400" />}
                    title="AI-Powered Planning"
                    description="Our advanced AI analyzes your goals and creates personalized step-by-step plans tailored to your specific situation."
                    delay={0.9}
                />

                <Feature
                    icon={<StarIcon className="h-6 w-6 text-indigo-400" />}
                    title="Progress Tracking"
                    description="Visualize your journey with intuitive dashboards that show your progress and celebrate your achievements."
                    delay={1.0}
                />

                <Feature
                    icon={<RocketIcon className="h-6 w-6 text-blue-300" />}
                    title="Habit Building"
                    description="Transform your goals into daily habits with our science-backed habit formation system and reminders."
                    delay={1.1}
                />

                <Feature
                    icon={<CheckIcon className="h-6 w-6 text-green-400" />}
                    title="Goal Visualization"
                    description="Use our visual tools to map out your goals and see the bigger picture of your journey."
                    delay={1.2}
                />

                <Feature
                    icon={<XIcon className="h-6 w-6 text-red-400" />}
                    title="Setbacks Management"
                    description="Learn how to handle setbacks with our expert tips and resources to keep you on track."
                    delay={1.3}
                />

                <Feature
                    icon={<StarIcon className="h-6 w-6 text-yellow-400" />}
                    title="Community Support"
                    description="Join a community of like-minded individuals who share their journeys and support each other."
                    delay={1.4}
                />
            </div>
        </div>
    );
};

const Feature = ({ icon, title, description, delay }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="relative p-6 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-black/60 to-[#090021]/60 border border-[#1a103c]/50 h-full"
        >
            <div className="absolute -top-3 -right-3">
                <div className="w-20 h-20 bg-blue-500/5 blur-3xl rounded-full"></div>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-br from-[#0f0b29] to-[#070018] w-fit mb-4">
                {icon}
            </div>

            <h3 className="text-xl font-semibold text-white mb-2 font-raleway">{title}</h3>
            <p className="text-gray-300 text-sm">{description}</p>
        </motion.div>
    );
};

export default FloatingFeatures; 