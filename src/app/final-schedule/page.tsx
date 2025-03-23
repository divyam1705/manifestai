"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Brain, Clock, Edit, Trash, Save, X, Plus, Sparkles, Undo, Rocket, Loader2 } from "lucide-react";
import { generateSchedule } from "@/actions/schedule-generator";
import { ScheduleOutput, ScheduleTask } from "@/actions/schedule-generator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { insertEvent } from "@/actions/google-calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define interfaces for our data structures
interface UserPreferences {
    productivityStyle?: string;
    focusTimes?: string;
    breakIntervals?: string;
    exerciseMeditation?: string;
    other?: string;
    chronotype?: string;
    focus_style?: string;
    energy_waves?: string;
    break_type?: string;
    wellness?: string;
    sleep?: string;
    [key: string]: string | undefined;
}

interface WeeklySchedule {
    [day: string]: {
        [timeSlot: string]: boolean | string;
    };
}

interface UserInfo {
    preferences: UserPreferences;
    schedule: WeeklySchedule;
    goal: string;
}

export default function FinalSchedulePage() {
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo>({
        preferences: {},
        schedule: {},
        goal: ""
    });
    const [debugInfo, setDebugInfo] = useState<string>("Loading...");
    const [generatedSchedule, setGeneratedSchedule] = useState<ScheduleOutput | null>(null);
    const [activeDay, setActiveDay] = useState("Monday");
    const [isExporting, setIsExporting] = useState(false);
    const [exportMessage, setExportMessage] = useState("");
    const [exportProgress, setExportProgress] = useState(0);
    const [totalEvents, setTotalEvents] = useState(0);
    const [showDebug, setShowDebug] = useState(false);

    // State for editing task
    const [editingTask, setEditingTask] = useState<{
        day: string;
        index: number;
        task: ScheduleTask;
    } | null>(null);

    // State for creating new task
    const [newTask, setNewTask] = useState<{
        day: string;
        task: ScheduleTask;
    } | null>(null);

    // State for tasks being edited
    const [taskFields, setTaskFields] = useState<{
        time: string;
        task: string;
        description: string;
        reason: string;
    }>({
        time: "",
        task: "",
        description: "",
        reason: ""
    });

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    useEffect(() => {
        // Load all the user data from localStorage
        const loadUserData = () => {
            try {
                // Get user preferences
                const userPreferences = localStorage.getItem("userPreferences");

                // Get weekly schedule
                const userSchedule = localStorage.getItem("userSchedule");

                // Get user's main goal/wish
                const userGoal = localStorage.getItem("userWish");

                const loadedPreferences = userPreferences ? JSON.parse(userPreferences) : {};
                const loadedSchedule = userSchedule ? JSON.parse(userSchedule) : {};
                const loadedGoal = userGoal || "Become a software engineer in 6 months";

                setUserInfo({
                    preferences: loadedPreferences,
                    schedule: loadedSchedule,
                    goal: loadedGoal
                });

                // Set debug info to help troubleshoot
                setDebugInfo(`
                    Goal: ${loadedGoal}
                    Preferences: ${JSON.stringify(loadedPreferences, null, 2)}
                    Schedule: ${Object.keys(loadedSchedule).length} days
                `);
            } catch (error) {
                console.error("Error loading user data:", error);
                setDebugInfo(`Error loading data: ${error}`);
            }
        };

        loadUserData();
    }, []);

    const handleGenerateAISchedule = async () => {
        setIsGenerating(true);

        try {
            const promptData = formatUserData();
            const result = await generateSchedule(promptData);
            setGeneratedSchedule(result);
        } catch (error) {
            console.error("Error generating schedule:", error);
            // Could set an error state here
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGoBack = () => {
        router.push("/schedule-input");
    };

    const handleGoToDashboard = () => {
        router.push("/dashboard");
    };

    // Format the data as a prompt for the LLM using the specific format
    const formatUserData = () => {
        // Extract relevant preferences if they exist
        const preferences = userInfo.preferences || {};

        // Map preferences to expected format
        const morningOrNight = preferences.chronotype === "early_bird" ? "Morning person" :
            preferences.chronotype === "night_owl" ? "Night owl" :
                preferences.chronotype || "Not specified";

        const focusTimes = preferences.energy_waves === "morning_peak" ? "Morning" :
            preferences.energy_waves === "afternoon_peak" ? "Afternoon" :
                preferences.energy_waves === "night_peak" ? "Evening" :
                    preferences.energy_waves || "Not specified";

        const breakIntervals = preferences.break_type || "Not specified";

        const exerciseMeditationPreference =
            preferences.wellness === "exercise" ? "Daily exercise" :
                preferences.wellness === "meditation" ? "Daily meditation" :
                    preferences.wellness === "both" ? "Both exercise and meditation" :
                        preferences.wellness || "Not specified";

        const otherPreferences = `
            Focus Style: ${preferences.focus_style || "Not specified"}
            Sleep Schedule: ${preferences.sleep || "Not specified"}
        `;

        // Create the structured prompt
        const prompt = `### **📝 LLM Prompt for Generating Personalized Schedules**  

\`\`\`
You are an AI assistant designed to help users achieve their dreams by creating an optimal schedule based on their personal preferences, goals, and existing commitments. Your response should always be a valid JSON file.

## Instructions:
1. **Analyze the user's dream/goal** and break it down into actionable tasks.  
2. **Consider user preferences** (e.g., night owl/morning person, focus hours, best work periods).  
3. **Respect existing schedules** (work, classes, other commitments) and intelligently place tasks around them.  
4. **Distribute tasks over daily, weekly, and monthly goals**, ensuring balance and avoiding burnout.  
5. **Incorporate scientifically proven productivity techniques** like:  
   - Pomodoro Technique  
   - Deep Work Sessions  
   - Habit stacking (from Atomic Habits)  
   - Eisenhower Matrix for priority setting  
   - Time blocking  
6. **If the user input is inappropriate (offensive), return an error message instead of a schedule.**

## Input Data:
- **User's dream/goal:** ${userInfo.goal || "Not specified"}
- **User preferences:**  
  - Productivity style: ${morningOrNight}  
  - Best focus times: ${focusTimes}  
  - Preferred break intervals: ${breakIntervals}  
  - Exercise/Meditation: ${exerciseMeditationPreference}  
  - Work/Study commitments: ${JSON.stringify(userInfo.schedule || {})}  
  - Other relevant preferences: ${otherPreferences}  


\`\`\`
Expected Output
{
  "error": null,
  "summary": "A personalized summary of the schedule and how it aligns with the user's goals",
  "daily_schedule": [
    {
      "time": "08:00 AM - 09:00 AM",
      "task": "Specific task name",
      "description": "Detailed explanation of what this task involves",
      "reason": "Why this task is scheduled at this time"
    }
  ],
  "weekly_schedule": {
    "Monday": [
      {
        "time": "08:00 AM - 09:00 AM",
        "task": "Specific task name",
        "description": "Detailed explanation of what this task involves",
        "reason": "Why this task is scheduled at this time"
      }
    ],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": [],
    "Sunday": []
  },
  "weekly_goals": ["Specific goal 1", "Specific goal 2", "Specific goal 3"],
  "monthly_goals": ["Specific long-term goal 1", "Specific long-term goal 2", "Specific long-term goal 3"],
  "productivity_tips": ["Actionable tip 1", "Actionable tip 2", "Actionable tip 3"],
  "daily_challenges": {
    "Monday": "A specific challenge to boost productivity or skills on Monday",
    "Tuesday": "Tuesday's challenge",
    "Wednesday": "Wednesday's challenge",
    "Thursday": "Thursday's challenge",
    "Friday": "Friday's challenge",
    "Saturday": "Saturday's challenge",
    "Sunday": "Sunday's challenge"
  },
  "learning_resources": [
    {
      "title": "Resource name",
      "url": "https://actual-website.com/resource",
      "description": "Why this resource is relevant to the user's goals"
    }
  ],
  "energy_insights": {
    "peak_hours": "When the user is likely to be most productive based on preferences",
    "rest_periods": "Recommended rest breaks based on user's working style",
    "optimizations": "Suggestions for optimizing energy levels throughout the day"
  },
  "progress_metrics": {
    "focus_areas": ["Primary area to focus on", "Secondary focus area", "Tertiary focus area"],
    "key_milestones": ["First achievement to aim for", "Second milestone", "Third milestone"],
    "success_indicators": ["Measurable indicator 1", "Measurable indicator 2", "Measurable indicator 3"]
  }
}
\`\`\`
 IMPORTANT INSTRUCTIONS:
    1. You MUST output ONLY valid JSON without any additional text, markdown formatting, or explanations
    2. Follow the exact JSON structure specified in the prompt
    3. Ensure all JSON keys and values are properly quoted with double quotes
    4. Do not include any text outside the JSON object
    5. Always include all fields in the response, even if they contain null values
    6. Make sure the JSON has valid array brackets, object braces, quotes, and commas
    7. Do not leave any array empty - always include at least 3 items per array
    8. ONLY give an error if the user said something offensive and not otherwise
    9. Give the full schedule including the items already inputted to you
    10. DO NOT give vague goals/tasks, each task must be concrete for every day of the week
    11. Include a detailed description field for each task explaining what the task involves
    12. Make sure to provide specific tasks for EACH day of the week
    13. Tasks should be tailored to each specific day (not generic placeholders)
    14. Each day should have at least 3-5 meaningful tasks
    15. The schedule must account for work/life balance and rest periods
    16. Include daily challenges specific to each day of the week
    17. Provide relevant learning resources with actual URLs to helpful content 
    18. Add energy insights based on the user's chronotype and preferences
    19. Include progress metrics with concrete focus areas and milestones
    

Ensure the schedule is **realistic, achievable, and aligned with human psychology**. Do not overload the user with too many tasks in a day. Include a detailed description for each task in the schedule.
\`\`\``;

        return prompt.trim();
    };

    // Save the generated schedule to local storage for the dashboard
    useEffect(() => {
        if (generatedSchedule && !generatedSchedule.error) {
            localStorage.setItem("generatedSchedule", JSON.stringify(generatedSchedule));
            console.log("Schedule saved to local storage for dashboard");
        }
    }, [generatedSchedule]);

    // Function to export schedule to Google Calendar
    const exportToGoogleCalendar = async () => {
        if (!generatedSchedule || !generatedSchedule.weekly_schedule) {
            setExportMessage("No schedule to export");
            return;
        }

        setIsExporting(true);
        setExportMessage("Preparing calendar events...");

        try {
            const events = [];
            const currentDate = new Date();
            const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

            // Calculate days relative to current date
            const getDayOffset = (dayName: string) => {
                const dayIndex = daysOfWeek.indexOf(dayName);
                // Convert our 0-6 (Mon-Sun) to JS's 1-0 (Mon-Sun)
                const targetJSDay = dayIndex === 6 ? 0 : dayIndex + 1;

                let offset = targetJSDay - currentDay;
                if (offset <= 0) {
                    offset += 7; // Move to next week if day has passed
                }
                return offset;
            };

            // Collect events for each day
            for (const day in generatedSchedule.weekly_schedule) {
                const tasks = generatedSchedule.weekly_schedule[day as keyof typeof generatedSchedule.weekly_schedule];
                if (!tasks || tasks.length === 0) continue;

                const dayOffset = getDayOffset(day);
                const eventDate = new Date(currentDate);
                eventDate.setDate(currentDate.getDate() + dayOffset);

                // Format date as ISO string
                const formattedDate = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD

                for (const task of tasks) {
                    // Parse time range (e.g., "07:30 AM - 08:00 AM")
                    const timeRange = task.time.split(" - ");
                    if (timeRange.length !== 2) continue;

                    // Format times
                    const startTime = convertTimeToISO(timeRange[0], formattedDate);
                    const endTime = convertTimeToISO(timeRange[1], formattedDate);

                    if (!startTime || !endTime) continue;

                    const event = {
                        summary: task.task,
                        description: `${task.description}\n\nReason: ${task.reason}`,
                        start: {
                            dateTime: startTime,
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                        },
                        end: {
                            dateTime: endTime,
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                        },
                        colorId: Math.floor(Math.random() * 11) + 1, // Random number from 1 to 11
                    };

                    events.push(event);
                }
            }

            // Insert events one by one
            if (events.length > 0) {
                setTotalEvents(events.length);
                setExportMessage(`Adding ${events.length} events to your calendar...`);

                for (let i = 0; i < events.length; i++) {
                    try {
                        await insertEvent(events[i]);
                        setExportProgress(i + 1);
                        setExportMessage(`Added ${i + 1} of ${events.length} events (${Math.round(((i + 1) / events.length) * 100)}%)`);
                    } catch (error) {
                        console.error(`Error adding event ${i + 1}:`, error);
                        // Continue with other events
                    }
                }

                setExportMessage(`Successfully added ${events.length} events to your Google Calendar!`);
            } else {
                setExportMessage("No valid tasks found to export");
            }
        } catch (error) {
            console.error("Error exporting to Google Calendar:", error);
            setExportMessage("Error adding events to calendar. Please try again.");
        } finally {
            setTimeout(() => {
                setIsExporting(false);
                setExportProgress(0);
                setTimeout(() => setExportMessage(""), 5000); // Clear message after 5 seconds
            }, 2000);
        }
    };

    // Helper to convert time to ISO format
    const convertTimeToISO = (timeStr: string, dateStr: string): string | null => {
        try {
            // Parse time like "07:30 AM"
            const timeParts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (!timeParts) return null;

            let hour = parseInt(timeParts[1]);
            const minute = parseInt(timeParts[2]);
            const meridian = timeParts[3].toUpperCase();

            // Convert to 24-hour format
            if (meridian === "PM" && hour < 12) hour += 12;
            if (meridian === "AM" && hour === 12) hour = 0;

            // Create ISO date-time string
            return `${dateStr}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
        } catch (error) {
            console.error("Error parsing time:", error);
            return null;
        }
    };

    // Function to handle opening the edit dialog
    const handleEditTask = (day: string, index: number, task: ScheduleTask) => {
        setEditingTask({ day, index, task });
        setTaskFields({
            time: task.time,
            task: task.task,
            description: task.description,
            reason: task.reason
        });
    };

    // Function to handle opening the create dialog
    const handleCreateTask = (day: string) => {
        setNewTask({
            day,
            task: {
                time: "09:00 AM - 10:00 AM",
                task: "New Task",
                description: "Add a description for your task",
                reason: "This task will help you achieve your goals"
            }
        });
        setTaskFields({
            time: "09:00 AM - 10:00 AM",
            task: "New Task",
            description: "Add a description for your task",
            reason: "This task will help you achieve your goals"
        });
    };

    // Function to save edited task
    const saveEditedTask = () => {
        if (!editingTask || !generatedSchedule?.weekly_schedule) return;

        // Create a deep copy of the schedule
        const updatedSchedule = JSON.parse(JSON.stringify(generatedSchedule));

        // Update the task at the specified index
        const day = editingTask.day as keyof typeof updatedSchedule.weekly_schedule;
        updatedSchedule.weekly_schedule[day][editingTask.index] = {
            ...taskFields
        };

        // Update the state with the new schedule
        setGeneratedSchedule(updatedSchedule);

        // Save to localStorage for dashboard
        localStorage.setItem("generatedSchedule", JSON.stringify(updatedSchedule));

        // Reset editing state
        setEditingTask(null);
    };

    // Function to save new task
    const saveNewTask = () => {
        if (!newTask || !generatedSchedule?.weekly_schedule) return;

        // Create a deep copy of the schedule
        const updatedSchedule = JSON.parse(JSON.stringify(generatedSchedule));

        // Add the new task
        const day = newTask.day as keyof typeof updatedSchedule.weekly_schedule;

        // Initialize array if it doesn't exist
        if (!updatedSchedule.weekly_schedule[day]) {
            updatedSchedule.weekly_schedule[day] = [];
        }

        // Add the task
        updatedSchedule.weekly_schedule[day].push({
            ...taskFields
        });

        // Sort tasks by time
        updatedSchedule.weekly_schedule[day].sort((a: ScheduleTask, b: ScheduleTask) => {
            // Simple sort by comparing the start times (e.g., "07:30 AM" from "07:30 AM - 08:00 AM")
            const timeA = a.time.split(' - ')[0];
            const timeB = b.time.split(' - ')[0];
            return timeA.localeCompare(timeB);
        });

        // Update the state with the new schedule
        setGeneratedSchedule(updatedSchedule);

        // Save to localStorage for dashboard
        localStorage.setItem("generatedSchedule", JSON.stringify(updatedSchedule));

        // Reset new task state
        setNewTask(null);
    };

    // Function to delete task
    const deleteTask = () => {
        if (!editingTask || !generatedSchedule?.weekly_schedule) return;

        // Create a deep copy of the schedule
        const updatedSchedule = JSON.parse(JSON.stringify(generatedSchedule));

        // Remove the task at the specified index
        const day = editingTask.day as keyof typeof updatedSchedule.weekly_schedule;
        updatedSchedule.weekly_schedule[day].splice(editingTask.index, 1);

        // Update the state with the new schedule
        setGeneratedSchedule(updatedSchedule);

        // Save to localStorage for dashboard
        localStorage.setItem("generatedSchedule", JSON.stringify(updatedSchedule));

        // Reset editing state
        setEditingTask(null);
    };

    // Helper to render schedule tasks for a specific day
    const renderDaySchedule = (day: string, tasks: ScheduleTask[]) => {
        return (
            <div className="space-y-5">
                <div className="flex justify-end mb-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-indigo-300 bg-zinc-900 border-indigo-500/30 hover:bg-zinc-800 hover:text-indigo-200"
                        onClick={() => handleCreateTask(day)}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Task
                    </Button>
                </div>

                {tasks.length > 0 ? (
                    tasks.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Card className="p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md 
                                           rounded-lg border border-slate-700/30 overflow-hidden group hover:border-indigo-500/40 
                                           transition-all duration-300 shadow-md hover:shadow-indigo-900/20">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>

                                <div className="ml-3 flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 text-indigo-400 mr-2" />
                                                <h3 className="text-indigo-300 font-medium text-md">{item.time}</h3>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50"
                                                onClick={() => handleEditTask(day, index, item)}
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>

                                        <h4 className="text-white font-semibold text-lg mb-2 group-hover:text-indigo-200 transition-colors duration-200">
                                            {item.task}
                                        </h4>

                                        <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                                            {item.description}
                                        </p>

                                        <div className="mt-4 bg-slate-800/50 rounded-md p-3 border-l-2 border-indigo-500/50">
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Reason</p>
                                            <p className="text-slate-300 text-sm">{item.reason}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Calendar className="h-12 w-12 text-slate-500 mb-4 opacity-50" />
                        <p className="text-slate-400 italic">No tasks scheduled for this day.</p>
                        <p className="text-slate-500 text-sm mt-2">Add a task for {day} or generate your schedule again.</p>
                    </div>
                )}
            </div>
        );
    };

    // Helper to generate time options for select
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            const hourFormatted = hour === 0 ? '12' : hour > 12 ? (hour - 12).toString() : hour.toString();
            const amPm = hour < 12 ? 'AM' : 'PM';

            options.push(
                <SelectItem key={`${hour}-00`} value={`${hourFormatted.padStart(2, '0')}:00 ${amPm}`}>
                    {`${hourFormatted.padStart(2, '0')}:00 ${amPm}`}
                </SelectItem>
            );
            options.push(
                <SelectItem key={`${hour}-30`} value={`${hourFormatted.padStart(2, '0')}:30 ${amPm}`}>
                    {`${hourFormatted.padStart(2, '0')}:30 ${amPm}`}
                </SelectItem>
            );
        }
        return options;
    };

    // Function to handle time change
    const handleTimeChange = (field: 'start' | 'end', value: string) => {
        const [currentStart, currentEnd] = taskFields.time.split(' - ');

        if (field === 'start') {
            setTaskFields({
                ...taskFields,
                time: `${value} - ${currentEnd}`
            });
        } else {
            setTaskFields({
                ...taskFields,
                time: `${currentStart} - ${value}`
            });
        }
    };

    // Extract start and end time for selects
    const extractTimes = () => {
        const [start, end] = taskFields.time.split(' - ');
        return { start, end };
    };

    return (
        <div className="min-h-screen py-30 w-full overflow-hidden relative bg-zinc-950">
            {/* Stars background */}
            <div className="absolute inset-0 bg-[url('/images/stars-bg.png')] bg-repeat opacity-30 pointer-events-none"></div>

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 to-black/90 pointer-events-none"></div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Your AI-Generated Schedule</h1>
                        <p className="text-slate-300">
                            Based on your preferences, schedule, and goal
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowDebug(!showDebug)}
                            className="mt-4 md:mt-0 bg-black/40 text-slate-400 border-slate-700/30 hover:bg-black/60 hover:text-slate-300"
                            size="sm"
                        >
                            {showDebug ? "Hide Debug" : "Show Debug"}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleGoBack}
                            className="mt-4 md:mt-0 bg-black/40 text-white border-slate-700/30 hover:bg-black/60"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Schedule
                        </Button>
                    </div>
                </div>

                {/* Debug Information - for development only */}
                {showDebug && (
                    <Card className="bg-slate-900/70 backdrop-blur-md border border-slate-800/40 p-4 mb-4 text-xs">
                        <h3 className="text-white mb-1">Debug Info (Dev Only)</h3>
                        <pre className="text-slate-300 whitespace-pre-wrap text-xs">{debugInfo}</pre>
                    </Card>
                )}

                {!generatedSchedule ? (
                    <>
                        {isGenerating ? (
                            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                                <div className="relative w-28 h-28 mb-8">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 blur-xl opacity-50 animate-pulse"></div>
                                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                                        <Loader2 className="w-14 h-14 text-white animate-spin opacity-70" />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-3 text-center">Crafting Your Perfect Schedule</h2>
                                <p className="text-zinc-400 text-center max-w-md mb-8">
                                    Our AI is analyzing your preferences, schedule constraints, and goals to create a personalized, optimal schedule tailored just for you...
                                </p>

                                <div className="w-72 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-loading-bar"></div>
                                </div>

                                <style jsx global>{`
                                    @keyframes loading-bar {
                                        0% { width: 0%; }
                                        20% { width: 20%; }
                                        40% { width: 40%; }
                                        60% { width: 65%; }
                                        80% { width: 85%; }
                                        95% { width: 95%; }
                                        100% { width: 98%; }
                                    }
                                    .animate-loading-bar {
                                        animation: loading-bar 20s ease-out forwards;
                                    }
                                `}</style>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center mb-12"
                                >
                                    <div className="inline-block relative mb-8">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 blur-xl opacity-40"></div>
                                        <div className="relative z-10 bg-zinc-900 p-6 rounded-full border border-zinc-800">
                                            <Sparkles className="w-12 h-12 text-indigo-400" />
                                        </div>
                                    </div>

                                    <h2 className="text-3xl font-bold text-white mb-4">
                                        Ready to Optimize Your Week?
                                    </h2>

                                    <p className="text-zinc-400 max-w-md mx-auto">
                                        Generate a personalized weekly schedule based on your goals, preferred times, and productivity style.
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    <Button
                                        className="bg-black hover:bg-zinc-900 text-white py-6 px-10 rounded-xl flex items-center justify-center gap-3 text-lg
                                                  transition-all duration-300 relative group overflow-hidden"
                                        onClick={handleGenerateAISchedule}
                                        disabled={isGenerating}
                                    >
                                        {/* Gradient border effect */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        <span className="absolute inset-[2px] bg-black rounded-lg z-10"></span>

                                        {/* Content */}
                                        <span className="relative z-20 flex items-center">
                                            <Brain className="h-6 w-6 mr-2" />
                                            <span>Generate AI-Optimized Schedule</span>
                                        </span>
                                    </Button>
                                </motion.div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-y-8">
                        {generatedSchedule.error ? (
                            <Card className="bg-red-900/30 backdrop-blur-md border border-red-800/30 p-6 mb-6">
                                <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
                                <p className="text-white">{generatedSchedule.error}</p>
                            </Card>
                        ) : (
                            <>
                                {/* Summary */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Card className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-8 rounded-xl overflow-hidden relative">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                            <Sparkles className="w-5 h-5 mr-2 text-indigo-400" />
                                            Schedule Summary
                                        </h2>
                                        <p className="text-zinc-300 leading-relaxed">{generatedSchedule.summary}</p>
                                    </Card>
                                </motion.div>

                                {/* Weekly Schedule with Tabs */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                >
                                    <Card className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-8 rounded-xl">
                                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                                            <Calendar className="w-5 h-5 mr-2 text-indigo-400" />
                                            Weekly Schedule
                                        </h2>

                                        <Tabs defaultValue="Monday" className="w-full" onValueChange={setActiveDay}>
                                            <div className="relative mb-8">
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 rounded-md blur-lg"></div>
                                                <TabsList className="relative grid grid-cols-7 bg-zinc-800 p-1 rounded-lg border border-zinc-700/30">
                                                    {daysOfWeek.map(day => (
                                                        <TabsTrigger
                                                            key={day}
                                                            value={day}
                                                            className={`relative z-10 transition-all duration-200 ${activeDay === day
                                                                ? "bg-zinc-700 text-indigo-300 font-medium shadow-lg"
                                                                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                                                                }`}
                                                        >
                                                            {day.substring(0, 3)}
                                                        </TabsTrigger>
                                                    ))}
                                                </TabsList>
                                            </div>

                                            {generatedSchedule.weekly_schedule && daysOfWeek.map(day => (
                                                <TabsContent
                                                    key={day}
                                                    value={day}
                                                    className="mt-0 focus-visible:outline-none focus-visible:ring-0"
                                                >
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="mb-4 pb-2 border-b border-slate-700/50 flex justify-between items-center"
                                                    >
                                                        <h3 className="text-lg font-medium text-white">
                                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                                                {day}
                                                            </span>&apos;s Schedule
                                                        </h3>
                                                        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                                                            {generatedSchedule.weekly_schedule?.[day as keyof typeof generatedSchedule.weekly_schedule]?.length || 0} tasks
                                                        </span>
                                                    </motion.div>
                                                    {renderDaySchedule(
                                                        day,
                                                        generatedSchedule.weekly_schedule?.[day as keyof typeof generatedSchedule.weekly_schedule] || []
                                                    )}
                                                </TabsContent>
                                            ))}
                                        </Tabs>
                                    </Card>
                                </motion.div>

                                {/* Weekly Goals */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <Card className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-6 rounded-xl h-full">
                                            <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-zinc-800 flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                                                Weekly Goals
                                            </h2>
                                            <ul className="space-y-3">
                                                {generatedSchedule.weekly_goals?.map((goal, index) => (
                                                    <li key={index} className="text-zinc-300 flex items-start">
                                                        <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full bg-indigo-900/30 text-indigo-400 mr-2 mt-0.5 text-xs font-bold">
                                                            {index + 1}
                                                        </span>
                                                        <span>{goal}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card>
                                    </motion.div>

                                    {/* Monthly Goals */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                    >
                                        <Card className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-6 rounded-xl h-full">
                                            <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-zinc-800 flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                                                Monthly Goals
                                            </h2>
                                            <ul className="space-y-3">
                                                {generatedSchedule.monthly_goals?.map((goal, index) => (
                                                    <li key={index} className="text-zinc-300 flex items-start">
                                                        <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full bg-purple-900/30 text-purple-400 mr-2 mt-0.5 text-xs font-bold">
                                                            {index + 1}
                                                        </span>
                                                        <span>{goal}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card>
                                    </motion.div>

                                    {/* Productivity Tips */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                    >
                                        <Card className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-6 rounded-xl h-full">
                                            <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-zinc-800 flex items-center">
                                                <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                                                Productivity Tips
                                            </h2>
                                            <ul className="space-y-3">
                                                {generatedSchedule.productivity_tips?.map((tip, index) => (
                                                    <li key={index} className="text-zinc-300 flex items-start">
                                                        <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full bg-blue-900/30 text-blue-400 mr-2 mt-0.5 text-xs font-bold">
                                                            {index + 1}
                                                        </span>
                                                        <span>{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card>
                                    </motion.div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-14 mb-4">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Button
                                            className="bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center gap-3
                                                    shadow-md transition-all duration-200 h-10 rounded-lg border border-zinc-700"
                                            onClick={handleGenerateAISchedule}
                                            disabled={isGenerating}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Undo className="h-4 w-4" />
                                                <span>{isGenerating ? "Regenerating..." : "Regenerate"}</span>
                                            </div>
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                    >
                                        <Button
                                            className="bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center gap-3
                                                    shadow-md transition-all duration-200 h-10 rounded-lg border border-zinc-700"
                                            onClick={handleGoToDashboard}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Rocket className="h-4 w-4" />
                                                <span>Dashboard</span>
                                            </div>
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.2 }}
                                    >
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        className="bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center gap-3
                                                                shadow-md transition-all duration-200 h-10 rounded-lg border border-zinc-700"
                                                        onClick={exportToGoogleCalendar}
                                                        disabled={isExporting}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{isExporting ? `${exportProgress}/${totalEvents}` : "Export to Google Calendar"}</span>
                                                        </div>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Add all schedule tasks to your Google Calendar</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </motion.div>
                                </div>

                                {exportMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-blue-900/70 text-white p-3 rounded-md text-center"
                                    >
                                        {exportMessage}
                                        {isExporting && totalEvents > 0 && (
                                            <div className="w-full mt-2 bg-blue-700/50 rounded-full h-2.5">
                                                <div
                                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.round((exportProgress / totalEvents) * 100)}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Task Dialog */}
            <Dialog open={editingTask !== null} onOpenChange={isOpen => !isOpen && setEditingTask(null)}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-white">Edit Task</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Time Slot</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-zinc-500 mb-1 block">Start Time</label>
                                    <Select
                                        value={extractTimes().start}
                                        onValueChange={(value) => handleTimeChange('start', value)}
                                    >
                                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                            <SelectValue placeholder="Select start time" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                            {generateTimeOptions()}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 mb-1 block">End Time</label>
                                    <Select
                                        value={extractTimes().end}
                                        onValueChange={(value) => handleTimeChange('end', value)}
                                    >
                                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                            <SelectValue placeholder="Select end time" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                            {generateTimeOptions()}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Task Name</label>
                            <Input
                                className="bg-zinc-800 border-zinc-700 text-white"
                                value={taskFields.task}
                                onChange={e => setTaskFields({ ...taskFields, task: e.target.value })}
                                placeholder="Enter task name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Description</label>
                            <Textarea
                                className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                                value={taskFields.description}
                                onChange={e => setTaskFields({ ...taskFields, description: e.target.value })}
                                placeholder="Describe the task in detail"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Reason</label>
                            <Textarea
                                className="bg-zinc-800 border-zinc-700 text-white min-h-[80px]"
                                value={taskFields.reason}
                                onChange={e => setTaskFields({ ...taskFields, reason: e.target.value })}
                                placeholder="Why is this task important?"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex justify-between">
                        <Button
                            variant="destructive"
                            onClick={deleteTask}
                            className="bg-red-900/70 hover:bg-red-800 border border-red-800/30"
                        >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                        </Button>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setEditingTask(null)}
                                className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>

                            <Button
                                onClick={saveEditedTask}
                                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create New Task Dialog */}
            <Dialog open={newTask !== null} onOpenChange={isOpen => !isOpen && setNewTask(null)}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-white">
                            Create New Task for {newTask?.day}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Time Slot</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-zinc-500 mb-1 block">Start Time</label>
                                    <Select
                                        value={extractTimes().start}
                                        onValueChange={(value) => handleTimeChange('start', value)}
                                    >
                                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                            <SelectValue placeholder="Select start time" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                            {generateTimeOptions()}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 mb-1 block">End Time</label>
                                    <Select
                                        value={extractTimes().end}
                                        onValueChange={(value) => handleTimeChange('end', value)}
                                    >
                                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                            <SelectValue placeholder="Select end time" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                            {generateTimeOptions()}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Task Name</label>
                            <Input
                                className="bg-zinc-800 border-zinc-700 text-white"
                                value={taskFields.task}
                                onChange={e => setTaskFields({ ...taskFields, task: e.target.value })}
                                placeholder="Enter task name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Description</label>
                            <Textarea
                                className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                                value={taskFields.description}
                                onChange={e => setTaskFields({ ...taskFields, description: e.target.value })}
                                placeholder="Describe the task in detail"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Reason</label>
                            <Textarea
                                className="bg-zinc-800 border-zinc-700 text-white min-h-[80px]"
                                value={taskFields.reason}
                                onChange={e => setTaskFields({ ...taskFields, reason: e.target.value })}
                                placeholder="Why is this task important?"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setNewTask(null)}
                            className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>

                        <Button
                            onClick={saveNewTask}
                            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Task
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 