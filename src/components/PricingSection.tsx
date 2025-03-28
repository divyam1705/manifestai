"use client"
import { Check as CheckIcon, X as XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
    title: string;
    price: string;
    duration: string;
    description: string;
    features: string[];
    nonFeatures: string[];
    buttonText: string;
    popular: boolean;
    delay: number;
    savings?: string;
}

const PricingCard = ({
    title,
    price,
    duration,
    description,
    features,
    nonFeatures,
    buttonText,
    popular,
    delay,
    savings
}: PricingCardProps) => {
    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={` relative p-6 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-black/70 to-[#0a0028]/80 border ${popular ? 'border-blue-500/50' : 'border-[#1a103c]/50'} h-full flex flex-col`}
        >
            {popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <div className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Most Popular
                    </div>
                </div>
            )}

            <div className="mb-6">
                <h3 className="font-raleway text-xl font-semibold text-white mb-2">{title}</h3>
                <div className="flex items-end mb-1">
                    <span className="text-3xl font-bold text-white">{price}</span>
                    <span className="text-gray-400 ml-1 mb-1">{duration}</span>
                </div>
                {savings && (
                    <div className="bg-green-500/20 text-green-400 text-xs font-medium px-2 py-1 rounded inline-block">
                        {savings}
                    </div>
                )}
                <p className="text-gray-300 text-sm mt-3">{description}</p>
            </div>

            <div className="flex-grow">
                <ul className="space-y-3 mb-6">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-200 text-sm">{feature}</span>
                        </li>
                    ))}

                    {nonFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start text-gray-500">
                            <XIcon className="h-5 w-5 text-gray-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <Button
                className={`w-full py-5 ${popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-gradient-to-br from-[#0f0b29] to-[#070018] hover:from-[#110c2d] hover:to-[#0b001c] text-white'
                    }`}
            >
                {buttonText}
            </Button>
        </motion.div>
    );
};

export default function PricingSection() {
    return (
        <div className="w-full">
            <div className="text-center mb-12">
                <div className="stars"></div>
                <motion.h2
                    className="font-raleway text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200 font-bold tracking-tight mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    Find Your Plan
                </motion.h2>
                <motion.p
                    className="text-lg text-gray-300 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    Choose the perfect plan to help you manifest your dreams and transform your life
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Trial Plan */}
                <PricingCard
                    title="Pro Trial"
                    price="$2"
                    duration="for 30 days"
                    description="Perfect for getting started and exploring our platform"
                    features={[
                        "Basic goal planning",
                        "1 active goal",
                        "Daily reminders",
                        "Basic analytics",
                        "Email support"
                    ]}
                    nonFeatures={[
                        "Advanced AI suggestions",
                        "Unlimited goals",
                        "Priority support"
                    ]}
                    buttonText="Start Trial"
                    popular={false}
                    delay={0.3}
                />

                {/* Monthly Plan */}
                <PricingCard
                    title="Monthly"
                    price="$9"
                    duration="per month"
                    description="Our most popular plan for serious goal achievers"
                    features={[
                        "Advanced goal planning",
                        "5 active goals",
                        "Custom reminders",
                        "Detailed analytics",
                        "Priority email support",
                        "AI-powered suggestions",
                        "Progress reports"
                    ]}
                    nonFeatures={[
                        "Unlimited goals"
                    ]}
                    buttonText="Subscribe Monthly"
                    popular={true}
                    delay={0.5}
                />

                {/* Yearly Plan */}
                <PricingCard
                    title="Yearly"
                    price="$90"
                    duration="per year"
                    description="Best value! Save 2 months compared to monthly"
                    features={[
                        "Everything in Monthly",
                        "Unlimited active goals",
                        "24/7 priority support",
                        "Advanced AI insights",
                        "Custom goal templates",
                        "Weekly coaching sessions",
                        "Export & API access"
                    ]}
                    nonFeatures={[]}
                    buttonText="Subscribe Yearly"
                    popular={false}
                    delay={0.7}
                    savings="Save $18"
                />
            </div>
        </div>
    );
} 