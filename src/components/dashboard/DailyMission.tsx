"use client"
import { useState } from "react";
import { Target, Clock, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScheduleItem {
    id: number;
    title: string;
    time: string;
    completed: boolean;
}

interface ScheduleData {
    morning: ScheduleItem[];
    afternoon: ScheduleItem[];
    evening: ScheduleItem[];
    [key: string]: ScheduleItem[];
}

interface DailyMissionProps {
    streak: number;
    schedule: ScheduleData;
    onToggleScheduleItem: (id: number, timeOfDay: string) => void;
    onStartNextTask?: () => void;
}

export default function DailyMission({
    streak,
    schedule,
    onToggleScheduleItem,
    onStartNextTask
}: DailyMissionProps) {
    return (
        <Card className="bg-slate-900/60 backdrop-blur-md border border-slate-800/40 shadow-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <Target className="h-5 w-5 mr-2 text-indigo-400" />
                    Mission for the Day
                </h2>

                <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-indigo-900/40 px-3 py-1 rounded-full">
                        <Flame className="h-4 w-4 text-amber-400 mr-1" />
                        <span className="text-white text-sm">{streak} day streak</span>
                    </div>
                </div>
            </div>

            {/* Next task countdown */}
            <div className="bg-slate-800/30 rounded-lg p-3 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Clock className="h-5 w-5 text-indigo-400 mr-2" />
                    <div>
                        <p className="text-white text-sm">Next task starting soon</p>
                        <p className="text-slate-400 text-xs">Deep Work Session starts in 10 mins</p>
                    </div>
                </div>
                <Button
                    onClick={onStartNextTask}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 px-3"
                >
                    Start Now
                </Button>
            </div>

            {/* Time-blocked schedule */}
            <div className="mb-1">
                <Tabs defaultValue="morning">
                    <TabsList className="w-full bg-slate-800/40 border border-slate-700/20">
                        <TabsTrigger value="morning" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300 flex-1">Morning</TabsTrigger>
                        <TabsTrigger value="afternoon" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300 flex-1">Afternoon</TabsTrigger>
                        <TabsTrigger value="evening" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300 flex-1">Evening</TabsTrigger>
                    </TabsList>

                    {Object.entries(schedule).map(([timeOfDay, items]) => (
                        <TabsContent key={timeOfDay} value={timeOfDay} className="mt-3">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-800/40 last:border-0">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            checked={item.completed}
                                            onCheckedChange={() => onToggleScheduleItem(item.id, timeOfDay)}
                                            className="border-slate-700"
                                        />
                                        <div>
                                            <p className={`text-sm font-medium ${item.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-slate-400">{item.time}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-500 bg-slate-800/30 px-2 py-1 rounded">
                                        {timeOfDay}
                                    </div>
                                </div>
                            ))}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </Card>
    );
} 