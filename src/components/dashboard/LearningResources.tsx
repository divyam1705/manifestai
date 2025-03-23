"use client"

import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LearningResource {
    title: string;
    url: string;
    description: string;
}

interface LearningResourcesProps {
    resources: LearningResource[];
}

export default function LearningResources({ resources }: LearningResourcesProps) {
    if (!resources || resources.length === 0) {
        return null;
    }

    return (
        <Card className="bg-slate-900/60 backdrop-blur-md border border-slate-800/40 shadow-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-indigo-400" />
                    Learning Resources
                </h2>
            </div>

            <div className="space-y-4">
                {resources.map((resource, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-slate-800/30 rounded-lg p-4 hover:bg-slate-800/50 transition-colors"
                    >
                        <h3 className="text-indigo-300 font-medium mb-1">{resource.title}</h3>
                        <p className="text-slate-400 text-sm mb-3">{resource.description}</p>
                        <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-white bg-indigo-600/80 hover:bg-indigo-600 px-3 py-1.5 rounded-md transition-colors"
                        >
                            <ExternalLink className="h-3.5 w-3.5 mr-2" />
                            Visit Resource
                        </a>
                    </motion.div>
                ))}

                <Button variant="ghost" className="w-full mt-2 border border-dashed border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800/50">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>Add Custom Resource</span>
                </Button>
            </div>
        </Card>
    );
} 