"use client"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import DailyMission from "@/components/dashboard/DailyMission";
import GoalProgress from "@/components/dashboard/GoalProgress";
import TaskTracking from "@/components/dashboard/TaskTracking";
import MotivationWidget from "@/components/dashboard/MotivationWidget";
import LearningResources from "@/components/dashboard/LearningResources";
import DailyChallenge from "@/components/dashboard/DailyChallenge";
import EnergyInsights from "@/components/dashboard/EnergyInsights";
import ProgressMetrics from "@/components/dashboard/ProgressMetrics";
import { ScheduleOutput } from "@/actions/schedule-generator";
import { supabase } from "@/lib/supabase";

// Define types for the data
interface ScheduleItem {
    id: number | string;
    title: string;
    time: string;
    completed: boolean;
}

interface Task {
    id: number | string;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
    category: string;
    dueDate?: string;
}

interface UpcomingTask {
    id: number | string;
    title: string;
    time: string;
    day?: string;
    dueDate?: string;
}

interface Goal {
    id: number | string;
    title: string;
    progress: number;
    completed: boolean;
}

interface LearningResource {
    title: string;
    url: string;
    description: string;
}

interface DashboardData {
    userName: string;
    streak: number;
    quote: string;
    productivityTip: string;
    motivation: string;
    challenge: string;
    xp: number;
    level: number;
    nextLevel: number;
    schedule: {
        morning: ScheduleItem[];
        afternoon: ScheduleItem[];
        evening: ScheduleItem[];
        [key: string]: ScheduleItem[];
    };
    tasks: Task[];
    upcomingTasks: UpcomingTask[];
    weeklyGoals: Goal[];
    monthlyGoals: Goal[];
    nextDeadline: {
        title: string;
        days: number;
        hours: number;
    };
    productivityData: {
        day: string;
        score: number;
    }[];
    dailyChallenges: {
        Monday: string;
        Tuesday: string;
        Wednesday: string;
        Thursday: string;
        Friday: string;
        Saturday: string;
        Sunday: string;
        [key: string]: string;
    } | null;
    learningResources: LearningResource[] | null;
    energyInsights: {
        peak_hours: string;
        rest_periods: string;
        optimizations: string;
    } | null;
    progressMetrics: {
        focus_areas: string[];
        key_milestones: string[];
        success_indicators: string[];
    } | null;
}

// Initial dummy data 
const initialData: DashboardData = {
    userName: "User",
    streak: 0,
    quote: "The only way to do great work is to love what you do.",
    productivityTip: "Use the Two-Minute Rule: If a task takes less than two minutes, do it immediately instead of putting it off.",
    motivation: "You're making great progress. Keep going!",
    challenge: "Complete 3 deep work sessions today for a 2x XP boost",
    xp: 0,
    level: 1,
    nextLevel: 100,
    schedule: {
        morning: [],
        afternoon: [],
        evening: []
    },
    tasks: [],
    upcomingTasks: [],
    weeklyGoals: [],
    monthlyGoals: [],
    nextDeadline: {
        title: "Next Milestone",
        days: 7,
        hours: 0
    },
    productivityData: [
        { day: "Mon", score: 0 },
        { day: "Tue", score: 0 },
        { day: "Wed", score: 0 },
        { day: "Thu", score: 0 },
        { day: "Fri", score: 0 },
        { day: "Sat", score: 0 },
        { day: "Sun", score: 0 }
    ],
    dailyChallenges: null,
    learningResources: null,
    energyInsights: null,
    progressMetrics: null
};

// Star animation component
const StarField = () => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 150 }).map((_, i) => {
                const size = Math.random() * 2 + 1;
                const animationDuration = Math.random() * 10 + 10;
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                const delay = Math.random() * 5;

                // Add some colored stars
                const colors = ["bg-white", "bg-blue-300", "bg-purple-300", "bg-amber-300", "bg-teal-300"];
                const color = i % 10 === 0 ? colors[Math.floor(Math.random() * colors.length)] : "bg-white";

                return (
                    <div
                        key={i}
                        className={`absolute rounded-full ${color}`}
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            left: `${left}%`,
                            top: `${top}%`,
                            opacity: Math.random() * 0.7 + 0.3,
                            animation: `twinkle ${animationDuration}s infinite ${delay}s`
                        }}
                    />
                );
            })}
        </div>
    );
};

// Main Dashboard Component
export default function Dashboard() {
    const [data, setData] = useState<DashboardData>(initialData);
    const [currentTime, setCurrentTime] = useState('');
    const [userName, setUserName] = useState('User');
    const [loading, setLoading] = useState(true);

    // Load data from Supabase and localStorage on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch user data from Supabase
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    // Get user name from Supabase user metadata
                    const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
                    setUserName(name);

                    // Update the user name in the dashboard data
                    setData(prevData => ({
                        ...prevData,
                        userName: name
                    }));
                }

                // Try to get the generated schedule from localStorage
                const scheduleDataStr = localStorage.getItem("generatedSchedule");

                if (scheduleDataStr) {
                    const scheduleData: ScheduleOutput = JSON.parse(scheduleDataStr);

                    // Transform data for the dashboard
                    const updatedData = { ...initialData };

                    // Set user name from Supabase (we've already set it above)
                    updatedData.userName = userName;

                    // Extract a quote from productivity tips if available
                    if (scheduleData.productivity_tips && scheduleData.productivity_tips.length > 0) {
                        updatedData.quote = scheduleData.productivity_tips[0];

                        if (scheduleData.productivity_tips.length > 1) {
                            updatedData.productivityTip = scheduleData.productivity_tips[1];
                        }
                    }

                    // Use summary as motivation
                    if (scheduleData.summary) {
                        updatedData.motivation = scheduleData.summary;
                    }

                    // Add new enhanced data
                    if (scheduleData.daily_challenges) {
                        updatedData.dailyChallenges = scheduleData.daily_challenges;
                        // Update the current challenge from daily_challenges
                        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                        const currentDay = days[new Date().getDay()];
                        updatedData.challenge = scheduleData.daily_challenges[currentDay as keyof typeof scheduleData.daily_challenges] ||
                            updatedData.challenge;
                    }

                    if (scheduleData.learning_resources) {
                        updatedData.learningResources = scheduleData.learning_resources;
                    }

                    if (scheduleData.energy_insights) {
                        updatedData.energyInsights = scheduleData.energy_insights;
                    }

                    if (scheduleData.progress_metrics) {
                        updatedData.progressMetrics = scheduleData.progress_metrics;
                    }

                    // Set weekly goals from the weekly_goals array if available
                    if (scheduleData.weekly_goals && scheduleData.weekly_goals.length > 0) {
                        updatedData.weeklyGoals = scheduleData.weekly_goals.map((goal, index) => ({
                            id: `wg-${index}`,
                            title: goal,
                            progress: Math.random() * 100, // Random progress for demo
                            completed: false
                        }));
                    }

                    // Set monthly goals from the monthly_goals array if available
                    if (scheduleData.monthly_goals && scheduleData.monthly_goals.length > 0) {
                        updatedData.monthlyGoals = scheduleData.monthly_goals.map((goal, index) => ({
                            id: `mg-${index}`,
                            title: goal,
                            progress: Math.random() * 100, // Random progress for demo
                            completed: false
                        }));
                    }

                    // Transform the weekly schedule into morning, afternoon, evening blocks
                    // Get today's day name
                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const today = days[new Date().getDay()];

                    // Check if we have a weekly schedule and today's schedule is available
                    if (scheduleData.weekly_schedule && scheduleData.weekly_schedule[today as keyof typeof scheduleData.weekly_schedule]) {
                        const todaySchedule = scheduleData.weekly_schedule[today as keyof typeof scheduleData.weekly_schedule];

                        // Organize tasks by time of day
                        const morning: ScheduleItem[] = [];
                        const afternoon: ScheduleItem[] = [];
                        const evening: ScheduleItem[] = [];

                        todaySchedule.forEach((task, index) => {
                            const taskTime = task.time.split(' ')[0]; // Get the hour, assuming format like "9:00 AM"
                            const hour = parseInt(taskTime.split(':')[0]);
                            const ampm = task.time.includes('AM') ? 'AM' : 'PM';

                            const scheduleItem: ScheduleItem = {
                                id: index,
                                title: task.task,
                                time: task.time,
                                completed: false
                            };

                            // Sort based on rough time of day
                            if ((ampm === 'AM') || (ampm === 'PM' && hour === 12)) {
                                morning.push(scheduleItem);
                            } else if (hour < 5) {
                                afternoon.push(scheduleItem);
                            } else {
                                evening.push(scheduleItem);
                            }
                        });

                        updatedData.schedule = { morning, afternoon, evening };

                        // Create tasks for today from the schedule
                        updatedData.tasks = todaySchedule.map((task, index) => ({
                            id: `task-${index}`,
                            title: task.task,
                            description: task.description || '',
                            completed: false,
                            priority: 'medium',
                            category: 'work'
                        }));

                        // Check if tomorrow's schedule is available to create upcoming tasks
                        const tomorrowIdx = (new Date().getDay() + 1) % 7;
                        const tomorrow = days[tomorrowIdx];

                        if (scheduleData.weekly_schedule[tomorrow as keyof typeof scheduleData.weekly_schedule]) {
                            const tomorrowSchedule = scheduleData.weekly_schedule[tomorrow as keyof typeof scheduleData.weekly_schedule];
                            updatedData.upcomingTasks = tomorrowSchedule.slice(0, 3).map((task, index) => ({
                                id: `upcoming-${index}`,
                                title: task.task,
                                time: task.time,
                                day: tomorrow
                            }));
                        }
                    }

                    // Update the dashboard data
                    setData(updatedData);
                }

                // Set loading to false
                setLoading(false);
            } catch (e) {
                console.error("Error loading dashboard data:", e);
                setLoading(false);
            }
        };

        // Load data on component mount
        loadData();

        // Update the time every minute
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };

        updateTime(); // Initial call
        const timeInterval = setInterval(updateTime, 60000); // Update every minute

        return () => clearInterval(timeInterval);
    }, [userName]);

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // Handler for toggling task completion
    const handleToggleTask = (taskId: number) => {
        const updatedTasks = data.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );

        setData({
            ...data,
            tasks: updatedTasks
        });
    };

    // Handler for deleting a task
    const handleDeleteTask = (taskId: number) => {
        const updatedTasks = data.tasks.filter(task => task.id !== taskId);
        setData({
            ...data,
            tasks: updatedTasks
        });
    };

    // Handler for toggling schedule item completion
    const handleToggleScheduleItem = (id: number, timeOfDay: string) => {
        const updatedSchedule = { ...data.schedule };
        updatedSchedule[timeOfDay] = updatedSchedule[timeOfDay].map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        );

        setData({
            ...data,
            schedule: updatedSchedule
        });
    };

    // Handler for accepting challenges
    const handleAcceptChallenge = () => {
        // In a real app, this would track the challenge acceptance
        alert("Challenge accepted! Complete 3 deep work sessions for a 2x XP boost.");
    };

    // Handler for exporting to Google Calendar
    const handleExportToCalendar = () => {
        // Redirect to final-schedule page where export functionality exists
        window.location.href = "/final-schedule";
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
                <StarField />
                <div className="z-10 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-white text-lg">Loading your productivity dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-30 min-h-screen w-full overflow-hidden relative bg-slate-950">
            {/* Star background */}
            <div className="absolute inset-0 bg-[url('/images/stars-bg.png')] bg-repeat opacity-30 pointer-events-none"></div>

            {/* Add a subtle overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-slate-950/40 pointer-events-none"></div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Top Row - Header with greeting and time */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                            {getGreeting()}, <span className="text-indigo-400">{data.userName}</span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base">
                            &quot;{data.quote}&quot;
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-end mt-4 md:mt-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="text-2xl font-semibold text-white">{currentTime}</div>
                        <div className="flex items-center text-slate-400 text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Dashboard Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Column (2 cols) - Daily Mission and Progress */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <DailyMission
                                streak={data.streak}
                                schedule={data.schedule}
                                onToggleScheduleItem={handleToggleScheduleItem}
                                onStartNextTask={() => window.location.href = "/final-schedule"}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <GoalProgress
                                weeklyGoals={data.weeklyGoals}
                                monthlyGoals={data.monthlyGoals}
                                nextDeadline={data.nextDeadline}
                                productivityData={data.productivityData}
                                onExportToGoogleCalendar={handleExportToCalendar}
                            />
                        </motion.div>

                        {/* Conditionally render Progress Metrics if available */}
                        {data.progressMetrics && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <ProgressMetrics metrics={data.progressMetrics} />
                            </motion.div>
                        )}
                    </div>

                    {/* Middle Column (1 col) - Tasks and Energy */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <TaskTracking
                                tasks={data.tasks}
                                upcomingTasks={data.upcomingTasks}
                                onToggleTask={handleToggleTask}
                                onDeleteTask={handleDeleteTask}
                            />
                        </motion.div>

                        {/* Conditionally render Energy Insights if available */}
                        {data.energyInsights && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <EnergyInsights insights={data.energyInsights} />
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column (1 col) - Motivation, Challenges, Resources */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <MotivationWidget
                                level={data.level}
                                xp={data.xp}
                                nextLevel={data.nextLevel}
                                productivityTip={data.productivityTip}
                                challenge={data.challenge}
                                onAcceptChallenge={handleAcceptChallenge}
                            />
                        </motion.div>

                        {/* Conditionally render Daily Challenges if available */}
                        {data.dailyChallenges && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <DailyChallenge
                                    challenges={data.dailyChallenges}
                                    onAcceptChallenge={handleAcceptChallenge}
                                />
                            </motion.div>
                        )}

                        {/* Conditionally render Learning Resources if available */}
                        {data.learningResources && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <LearningResources resources={data.learningResources} />
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* CSS for star animation */}
            <style jsx global>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
} 