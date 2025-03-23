"use client"

import { Battery, Zap, Coffee } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EnergyInsightsData {
    peak_hours: string;
    rest_periods: string;
    optimizations: string;
}

interface EnergyInsightsProps {
    insights: EnergyInsightsData | null;
}

export default function EnergyInsights({ insights }: EnergyInsightsProps) {
    if (!insights) {
        return null;
    }

    return (
        <Card className="bg-slate-900/60 backdrop-blur-md border border-slate-800/40 shadow-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <Battery className="h-5 w-5 mr-2 text-green-400" />
                    Energy Insights
                </h2>
            </div>

            <div className="space-y-4">
                <div className="bg-slate-800/30 rounded-lg p-4">
                    <h3 className="flex items-center text-indigo-300 font-medium mb-2">
                        <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                        Peak Productivity Hours
                    </h3>
                    <p className="text-slate-300 text-sm">{insights.peak_hours}</p>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4">
                    <h3 className="flex items-center text-indigo-300 font-medium mb-2">
                        <Coffee className="h-4 w-4 mr-2 text-amber-400" />
                        Recommended Rest Periods
                    </h3>
                    <p className="text-slate-300 text-sm">{insights.rest_periods}</p>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4">
                    <h3 className="flex items-center text-indigo-300 font-medium mb-2">
                        <Battery className="h-4 w-4 mr-2 text-green-400" />
                        Energy Optimizations
                    </h3>
                    <p className="text-slate-300 text-sm">{insights.optimizations}</p>
                </div>
            </div>
        </Card>
    );
} 