"use client"

import { useState } from "react";
import { Trophy, BookOpen, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MotivationWidgetProps {
    level: number;
    xp: number;
    nextLevel: number;
    productivityTip: string;
    challenge: string;
    onAcceptChallenge?: () => void;
}

export default function MotivationWidget({
    level,
    xp,
    nextLevel,
    productivityTip,
    challenge,
    onAcceptChallenge
}: MotivationWidgetProps) {
    const [isHovering, setIsHovering] = useState(false);
    const progressPercentage = (xp / nextLevel) * 100;

    return (
        <Card className="bg-slate-900/60 backdrop-blur-md border border-slate-800/40 shadow-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-amber-400" />
                    Motivation
                </h2>
            </div>

            {/* XP Progress - Enhanced for better visibility */}
            <div className="mb-5">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-300">Level {level}</span>
                    <span className="text-xs text-slate-400">{xp}/{nextLevel} XP</span>
                </div>
                <div className="relative h-4 w-full rounded-full overflow-hidden bg-slate-800/80 border border-slate-700/30">
                    <div
                        className={`h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 transition-all duration-300 ${isHovering ? 'animate-pulse' : ''}`}
                        style={{ width: `${progressPercentage}%` }}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    />
                    {/* Glow effect */}
                    <div
                        className="absolute top-0 h-full bg-amber-400/20 blur-sm transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                {/* Level markers */}
                <div className="w-full flex justify-between px-1 mt-1">
                    {[0, 25, 50, 75, 100].map((marker) => (
                        <div key={marker} className="flex flex-col items-center">
                            <div className={`h-1 w-1 rounded-full ${progressPercentage >= marker ? 'bg-amber-400' : 'bg-slate-600'}`} />
                            <span className="text-xs text-slate-500">{marker}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tip of the Day */}
            <div className="bg-indigo-950/30 border border-indigo-900/30 rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-3">
                    <div className="bg-indigo-900/50 p-2 rounded-lg mt-0.5">
                        <BookOpen className="h-5 w-5 text-indigo-300" />
                    </div>
                    <div>
                        <p className="text-indigo-300 text-sm font-medium">Productivity Tip</p>
                        <p className="text-white text-sm">{productivityTip}</p>
                    </div>
                </div>
            </div>

            {/* Challenge of the Day */}
            <div className="bg-amber-950/30 border border-amber-900/30 rounded-lg p-3">
                <div className="flex items-start space-x-3">
                    <div className="bg-amber-900/50 p-2 rounded-lg mt-0.5">
                        <Star className="h-5 w-5 text-amber-300" />
                    </div>
                    <div>
                        <p className="text-amber-300 text-sm font-medium">Daily Challenge</p>
                        <p className="text-white text-sm">{challenge}</p>
                        <Button
                            onClick={onAcceptChallenge}
                            className="mt-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs h-8 px-3 shadow-lg shadow-amber-900/30"
                        >
                            Accept Challenge
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
} 