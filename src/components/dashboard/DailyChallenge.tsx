"use client"

import { useState } from "react";
import { Trophy, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DailyChallenges {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
    [key: string]: string;
}

interface DailyChallengeProps {
    challenges: DailyChallenges;
    onAcceptChallenge: () => void;
}

export default function DailyChallenge({ challenges, onAcceptChallenge }: DailyChallengeProps) {
    const [activeDay, setActiveDay] = useState<string>(() => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[new Date().getDay()];
    });

    const [challengeStatus, setChallengeStatus] = useState<Record<string, "accepted" | "completed" | null>>({});

    if (!challenges) {
        return null;
    }

    const handleAcceptChallenge = () => {
        setChallengeStatus({
            ...challengeStatus,
            [activeDay]: "accepted"
        });
        onAcceptChallenge();
    };

    const handleCompleteChallenge = () => {
        setChallengeStatus({
            ...challengeStatus,
            [activeDay]: "completed"
        });
    };

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <Card className="bg-slate-900/60 backdrop-blur-md border border-slate-800/40 shadow-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-amber-400" />
                    Daily Challenges
                </h2>
            </div>

            <Tabs defaultValue={activeDay} onValueChange={setActiveDay}>
                <TabsList className="w-full grid grid-cols-7 bg-slate-800/40 border border-slate-700/20 mb-4">
                    {daysOfWeek.map(day => (
                        <TabsTrigger
                            key={day}
                            value={day}
                            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
                        >
                            {day.substring(0, 1)}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {daysOfWeek.map(day => (
                    <TabsContent key={day} value={day} className="relative">
                        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/20 rounded-lg p-5 shadow-inner">
                            {challengeStatus[day] === "completed" && (
                                <div className="absolute top-3 right-3 bg-green-600/20 text-green-400 rounded-full px-2 py-1 text-xs flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Completed
                                </div>
                            )}

                            {challengeStatus[day] === "accepted" && (
                                <div className="absolute top-3 right-3 bg-amber-600/20 text-amber-400 rounded-full px-2 py-1 text-xs flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    In Progress
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-white mb-3">
                                {day}&apos;s Challenge
                            </h3>

                            <div className="text-slate-300 mb-4">
                                {challenges[day]}
                            </div>

                            <div className="flex space-x-3">
                                {!challengeStatus[day] && (
                                    <Button
                                        onClick={handleAcceptChallenge}
                                        className="bg-amber-600 hover:bg-amber-700 text-white"
                                    >
                                        Accept Challenge
                                    </Button>
                                )}

                                {challengeStatus[day] === "accepted" && (
                                    <Button
                                        onClick={handleCompleteChallenge}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Mark as Completed
                                    </Button>
                                )}

                                {challengeStatus[day] === "completed" && (
                                    <Button
                                        disabled
                                        className="bg-slate-700 text-slate-300 cursor-not-allowed"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Challenge Completed
                                    </Button>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </Card>
    );
} 