"use client"

import { LineChart, BarChart3, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProgressMetricsData {
    focus_areas: string[];
    key_milestones: string[];
    success_indicators: string[];
}

interface ProgressMetricsProps {
    metrics: ProgressMetricsData | null;
}

export default function ProgressMetrics({ metrics }: ProgressMetricsProps) {
    if (!metrics) {
        return null;
    }

    return (
        <Card className="bg-slate-900/60 backdrop-blur-md border border-slate-800/40 shadow-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-blue-400" />
                    Progress Metrics
                </h2>
            </div>

            <div className="space-y-5">
                <div>
                    <h3 className="flex items-center text-indigo-300 font-medium mb-3">
                        <Target className="h-4 w-4 mr-2 text-indigo-400" />
                        Focus Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {metrics.focus_areas.map((area, index) => (
                            <Badge
                                key={index}
                                className="bg-indigo-900/50 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/50 px-3 py-1"
                            >
                                {area}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="flex items-center text-indigo-300 font-medium mb-3">
                        <BarChart3 className="h-4 w-4 mr-2 text-purple-400" />
                        Key Milestones
                    </h3>
                    <ul className="space-y-2">
                        {metrics.key_milestones.map((milestone, index) => (
                            <li
                                key={index}
                                className="bg-slate-800/30 text-slate-300 text-sm p-2 rounded-md flex items-start"
                            >
                                <div className="bg-purple-900/50 text-purple-400 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                                    {index + 1}
                                </div>
                                <span>{milestone}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="flex items-center text-indigo-300 font-medium mb-3">
                        <LineChart className="h-4 w-4 mr-2 text-blue-400" />
                        Success Indicators
                    </h3>
                    <ul className="space-y-2">
                        {metrics.success_indicators.map((indicator, index) => (
                            <li
                                key={index}
                                className="bg-slate-800/30 text-slate-300 text-sm p-2 rounded-md flex items-start"
                            >
                                <div className="bg-blue-900/50 text-blue-400 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                                    {index + 1}
                                </div>
                                <span>{indicator}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Card>
    );
} 