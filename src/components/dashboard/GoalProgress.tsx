"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart4, CalendarClock, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Goal {
    id: number;
    title: string;
    progress: number;
}

interface Deadline {
    title: string;
    days: number;
    hours: number;
}

interface ProductivityData {
    day: string;
    score: number;
}

interface GoalProgressProps {
    weeklyGoals: Goal[];
    monthlyGoals: Goal[];
    nextDeadline: Deadline;
    productivityData: ProductivityData[];
    onExportToGoogleCalendar?: () => void;
}

// Heat map cell component
const HeatMapCell = ({ score }: { score: number }) => {
    // Determine color based on score
    const getColor = () => {
        if (score >= 90) return "bg-green-500";
        if (score >= 80) return "bg-green-400";
        if (score >= 70) return "bg-green-300";
        if (score >= 60) return "bg-yellow-400";
        if (score >= 50) return "bg-yellow-300";
        if (score >= 40) return "bg-orange-400";
        return "bg-red-400";
    };

    return (
        <div className="flex flex-col items-center">
            <div
                className={`w-6 h-6 rounded-sm ${getColor()} flex items-center justify-center text-[10px] text-slate-900 font-medium`}
                title={`Productivity: ${score}%`}
            >
                {score}
            </div>
        </div>
    );
};

// Progress bar component with enhanced visibility
const EnhancedProgressBar = ({ value, colorClass }: { value: number, colorClass: string }) => {
    return (
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
                className={`h-full ${colorClass}`}
                style={{ width: `${value}%` }}
            >
                {/* Animated shimmer effect */}
                <div className="h-full w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-full bg-white/10 transform -translate-x-full animate-shimmer" />
                </div>
            </div>
        </div>
    );
};

export default function GoalProgress({
    weeklyGoals,
    monthlyGoals,
    nextDeadline,
    productivityData,
    onExportToGoogleCalendar
}: GoalProgressProps) {
    const [selectedTab, setSelectedTab] = useState("weekly");

    return (
        <Card className="bg-slate-900/60 backdrop-blur-md border border-slate-800/40 shadow-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <BarChart4 className="h-5 w-5 mr-2 text-indigo-400" />
                    Goal Progress
                </h2>


            </div>

            <Tabs defaultValue="weekly" onValueChange={setSelectedTab}>
                <TabsList className="w-full bg-slate-800/40 border border-slate-700/20 mb-4">
                    <TabsTrigger value="weekly" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300 flex-1">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300 flex-1">Monthly</TabsTrigger>
                    <TabsTrigger value="stats" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300 flex-1">Stats</TabsTrigger>
                </TabsList>

                <TabsContent value="weekly">
                    {weeklyGoals.map(goal => (
                        <div key={goal.id} className="mb-4 last:mb-0">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-white">{goal.title}</span>
                                <span className="text-xs text-slate-400">{goal.progress}%</span>
                            </div>
                            <EnhancedProgressBar
                                value={goal.progress}
                                colorClass="bg-gradient-to-r from-blue-600 to-indigo-500"
                            />
                        </div>
                    ))}
                </TabsContent>

                <TabsContent value="monthly">
                    {monthlyGoals.map(goal => (
                        <div key={goal.id} className="mb-4 last:mb-0">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-white">{goal.title}</span>
                                <span className="text-xs text-slate-400">{Math.round(goal.progress)}%</span>
                            </div>
                            <EnhancedProgressBar
                                value={goal.progress}
                                colorClass="bg-gradient-to-r from-purple-600 to-pink-500"
                            />
                        </div>
                    ))}
                </TabsContent>

                <TabsContent value="stats">
                    {/* Weekly Performance Heat Map */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-white mb-3">Weekly Performance</h3>
                        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/30">
                            <div className="flex justify-between mb-2">
                                {productivityData.map((day) => (
                                    <div key={day.day} className="text-center">
                                        <div className="text-xs text-slate-400 mb-1">{day.day}</div>
                                        <HeatMapCell score={day.score} />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-700/30 flex justify-between items-center">
                                <div className="text-xs text-slate-400">
                                    Average: {Math.round(productivityData.reduce((acc, day) => acc + day.score, 0) / productivityData.length)}%
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-300"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-300"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simple Productivity Graph */}
                    <div>
                        <h3 className="text-sm font-medium text-white mb-3">Productivity Trend</h3>
                        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/30 h-32 flex items-end justify-between">
                            {productivityData.map((day, index) => (
                                <div key={day.day} className="flex flex-col items-center h-full justify-end">
                                    <div
                                        className="w-5 bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t transition-all duration-500"
                                        style={{
                                            height: `${day.score}%`,
                                            opacity: selectedTab === "stats" ? 1 : 0
                                        }}
                                    ></div>
                                    <div className="text-xs text-slate-400 mt-1">{day.day}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Next important deadline */}
            <div className="mt-4 bg-indigo-950/30 border border-indigo-900/30 rounded-lg p-3 flex justify-between items-center">
                <div className="flex items-start space-x-3">
                    <div className="bg-indigo-900/50 p-2 rounded-lg mt-0.5">
                        <CalendarClock className="h-5 w-5 text-indigo-300" />
                    </div>
                    <div>
                        <p className="text-indigo-300 text-sm font-medium">Next Deadline</p>
                        <p className="text-white text-base font-semibold">{nextDeadline.title}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-indigo-300 text-xs">Remaining Time</p>
                    <p className="text-white text-lg font-bold">{nextDeadline.days}d {nextDeadline.hours}h</p>
                </div>
            </div>

            {/* Add CSS for shimmer effect */}
            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </Card>
    );
} 