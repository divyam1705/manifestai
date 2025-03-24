"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Save, X, Import, CalendarClock } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { importEvents } from "@/actions/google-calendar";

// Days of the week
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Time slots from 5am to 11pm
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 5; hour < 24; hour++) {
        const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
        const ampm = hour < 12 ? 'AM' : 'PM';
        slots.push(`${hourFormatted}:00 ${ampm}`);
        slots.push(`${hourFormatted}:30 ${ampm}`);
    }
    return slots;
};

const timeSlots = generateTimeSlots();

// Type for schedule events
interface ScheduleEvent {
    id: string;
    title: string;
    day: string;
    startTime: string;
    endTime: string;
    type: "work" | "class" | "personal" | "other";
    recurrence: "weekly" | "biweekly" | "monthly" | "once";
    days?: string[]; // Multiple days for an event
    color?: string;
}

// Type for schedule state
interface ScheduleState {
    [key: string]: ScheduleEvent[]; // day -> events
}

// Event type to color mapping with multiple variants for each type
const eventColors = {
    work: [
        "bg-blue-900/70 border-blue-600 text-blue-200",
        "bg-cyan-900/70 border-cyan-600 text-cyan-200",
        "bg-sky-900/70 border-sky-600 text-sky-200",
    ],
    class: [
        "bg-emerald-900/70 border-emerald-600 text-emerald-200",
        "bg-green-900/70 border-green-600 text-green-200",
        "bg-teal-900/70 border-teal-600 text-teal-200",
    ],
    personal: [
        "bg-indigo-900/70 border-indigo-600 text-indigo-200",
        "bg-violet-900/70 border-violet-600 text-violet-200",
        "bg-purple-900/70 border-purple-600 text-purple-200",
    ],
    other: [
        "bg-gray-900/70 border-gray-700 text-gray-200",
        "bg-slate-900/70 border-slate-700 text-slate-200",
        "bg-zinc-900/70 border-zinc-700 text-zinc-200",
    ]
};

// Additional random colors for variety
const randomColors = [
    "bg-rose-900/70 border-rose-600 text-rose-200",
    "bg-pink-900/70 border-pink-600 text-pink-200",
    "bg-fuchsia-900/70 border-fuchsia-600 text-fuchsia-200",
    "bg-amber-900/70 border-amber-600 text-amber-200",
    "bg-orange-900/70 border-orange-600 text-orange-200",
    "bg-lime-900/70 border-lime-600 text-lime-200",
];

// Type for Google Calendar events
interface GoogleCalendarEvent {
    id: string;
    summary: string;
    description?: string;
    start: {
        dateTime: string;
    };
    end: {
        dateTime: string;
    };
    recurrence?: string[];
}

export default function ScheduleInputPage() {
    const router = useRouter();
    const [schedule, setSchedule] = useState<ScheduleState>({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    });
    const dayColors = [
        'bg-red-900/80 hover:bg-red-800 border-red-700 text-red-100',
        'bg-orange-900/80 hover:bg-orange-800 border-orange-700 text-orange-100',
        'bg-yellow-900/80 hover:bg-yellow-800 border-yellow-700 text-yellow-100',
        'bg-green-900/80 hover:bg-green-800 border-green-700 text-green-100',
        'bg-blue-900/80 hover:bg-blue-800 border-blue-700 text-blue-100',
        'bg-indigo-900/80 hover:bg-indigo-800 border-indigo-700 text-indigo-100',
        'bg-violet-900/80 hover:bg-violet-800 border-violet-700 text-violet-100'
    ];

    const [showEventDialog, setShowEventDialog] = useState(false);
    const [activeDay, setActiveDay] = useState("Monday");
    const [newEvent, setNewEvent] = useState<Omit<ScheduleEvent, "id">>({
        title: "",
        day: "Monday",
        startTime: "9:00 AM",
        endTime: "10:00 AM",
        type: "work",
        recurrence: "weekly",
        days: ["Monday"]
    });

    const [isGoogleAuthPending, setIsGoogleAuthPending] = useState(false);
    const [hasGoogleCalendarAccess, setHasGoogleCalendarAccess] = useState(false);

    // Load preferences from localStorage
    useEffect(() => {
        // Check if we have any saved schedule data
        const savedSchedule = localStorage.getItem("userSchedule");
        if (savedSchedule) {
            setSchedule(JSON.parse(savedSchedule));
        }
    }, []);

    const handleAddEvent = () => {
        setNewEvent({
            ...newEvent,
            day: activeDay,
            days: [activeDay]
        });
        setShowEventDialog(true);
    };

    const handleSaveEvent = () => {
        const id = Math.random().toString(36).substring(2, 9);

        // Handle events with multiple days
        const eventWithId = { id, ...newEvent };
        const updatedSchedule = { ...schedule };

        // If using days array, add to each selected day
        if (newEvent.days && newEvent.days.length > 0) {
            newEvent.days.forEach(day => {
                updatedSchedule[day] = [
                    ...updatedSchedule[day],
                    { ...eventWithId, day }
                ];
            });
        } else {
            // Fallback to single day
            updatedSchedule[newEvent.day] = [
                ...updatedSchedule[newEvent.day],
                eventWithId
            ];
        }

        setSchedule(updatedSchedule);
        setShowEventDialog(false);

        // Reset new event
        setNewEvent({
            title: "",
            day: activeDay,
            startTime: "9:00 AM",
            endTime: "10:00 AM",
            type: "work",
            recurrence: "weekly",
            days: [activeDay]
        });

        // Save to localStorage
        localStorage.setItem("userSchedule", JSON.stringify(updatedSchedule));
    };

    const handleDeleteEvent = (day: string, eventId: string) => {
        // console.log("deleted", day, eventId)
        const updatedEvents = schedule[day].filter(event => event.id !== eventId);
        const updatedSchedule = {
            ...schedule,
            [day]: updatedEvents
        };

        setSchedule(updatedSchedule);
        localStorage.setItem("userSchedule", JSON.stringify(updatedSchedule));
    };

    const importFromGoogleCalendar = async () => {
        setIsGoogleAuthPending(true);
        const events = await importEvents();
        // console.log(events);
        setHasGoogleCalendarAccess(true);
        setIsGoogleAuthPending(false);
        if (events && events.length > 0) {
            const updatedSchedule = { ...schedule };
            events.forEach((event: GoogleCalendarEvent) => {
                const newEvent: ScheduleEvent = {
                    id: event.id,
                    title: event.summary,
                    // description: event.description,
                    startTime: new Date(event.start.dateTime).toLocaleString(),
                    endTime: new Date(event.end.dateTime).toLocaleString(),
                    type: "work", // Assuming all imported events are of type "work"
                    recurrence: event.recurrence && event.recurrence.length > 0 ? "weekly" : "once",
                    days: event.recurrence && event.recurrence.length > 0
                        ? (event.recurrence[0].match(/BYDAY=([^;]+)/)?.length
                            ? event.recurrence[0].match(/BYDAY=([^;]+)/)?.[1].split(',')
                            : [new Date(event.start.dateTime).toLocaleString('en-US', { weekday: 'long' })])
                        : [new Date(event.start.dateTime).toLocaleString('en-US', { weekday: 'long' })], // Get the day of the week
                    day: new Date(event.start.dateTime).toLocaleString('en-US', { weekday: 'long' }) // Add day attribute
                };

                // Update the schedule with the new event
                if (newEvent.days) {
                    newEvent.days = newEvent.days.map(day => {
                        switch (day) {
                            case "MO": return "Monday";
                            case "TU": return "Tuesday";
                            case "WE": return "Wednesday";
                            case "TH": return "Thursday";
                            case "FR": return "Friday";
                            case "SA": return "Saturday";
                            case "SU": return "Sunday";
                            default: return day; // Fallback in case of unexpected value
                        }
                    });
                }

                if (newEvent.days && newEvent.days.length > 0) {
                    newEvent.days.forEach(day => {
                        updatedSchedule[day] = [
                            ...updatedSchedule[day],
                            newEvent
                        ];
                    });
                } else {
                    // Fallback to single day
                    updatedSchedule[newEvent.day] = [
                        ...updatedSchedule[newEvent.day],
                        newEvent
                    ];
                }
            });
            setSchedule(updatedSchedule);
            console.log("updated schedule", updatedSchedule)
            // Save to localStorage
            localStorage.setItem("userSchedule", JSON.stringify(schedule));
        }
    };

    const handleComplete = () => {
        // Save final schedule
        localStorage.setItem("userSchedule", JSON.stringify(schedule));

        // Redirect to dashboard
        router.push("final-schedule");
    };

    const clearAllEvents = () => {
        // Show confirmation dialog
        if (window.confirm("Are you sure you want to clear all events from your schedule?")) {
            // Reset schedule to empty arrays for all days
            const emptySchedule = {
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: [],
                Saturday: [],
                Sunday: []
            };

            setSchedule(emptySchedule);

            // Clear from localStorage
            localStorage.setItem("userSchedule", JSON.stringify(emptySchedule));
        }
    };

    const toggleDaySelection = (day: string) => {
        const currentDays = newEvent.days || [];
        if (currentDays.includes(day)) {
            setNewEvent({
                ...newEvent,
                days: currentDays.filter(d => d !== day)
            });
        } else {
            setNewEvent({
                ...newEvent,
                days: [...currentDays, day]
            });
        }
    };
    // console.log(schedule)
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

    // Helper function to get a random color for an event
    const getRandomEventColor = (type: "work" | "class" | "personal" | "other", id: string) => {
        // Use the event ID to generate a consistent but seemingly random color
        const typeColors = eventColors[type];
        const seedValue = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

        // 25% chance to use a random color instead of type-based color
        if (seedValue % 4 === 0) {
            const randomIndex = seedValue % randomColors.length;
            return randomColors[randomIndex];
        }

        // Otherwise use a color from the event type colors
        const colorIndex = seedValue % typeColors.length;
        return typeColors[colorIndex];
    };

    return (
        <div className="pt-25 min-h-screen w-full overflow-hidden relative">
            {/* Celestial Background with stars animation */}
            {/* <CelestialBackground fullScreen={true} className="absolute inset-0" /> */}
            {/* <StarField /> */}
            <div className="stars"></div>
            {/* Add a subtle overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-gray-950/40"></div>

            <div className="relative z-10 w-full min-h-screen flex flex-col pt-6 sm:pt-10 px-3 sm:px-6">
                <div className="w-full max-w-6xl mx-auto flex-grow flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-6">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                Your Fixed Schedule
                            </h1>
                            <p className="text-gray-200 text-sm sm:text-base">
                                Add your classes, work hours, and other fixed commitments to optimize your productivity plan
                            </p>
                        </div>
                    </motion.div>

                    <Card className="p-4 sm:p-6 backdrop-blur-md bg-black/70 border border-gray-800/30 shadow-xl rounded-xl flex-grow">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div className="flex items-center space-x-2">
                                <CalendarClock className="h-5 w-5 text-teal-400" />
                                <h2 className="text-lg sm:text-xl font-semibold text-white">Weekly Schedule</h2>
                            </div>
                            <Button
                                onClick={importFromGoogleCalendar}
                                disabled={isGoogleAuthPending || hasGoogleCalendarAccess}
                                className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm border border-gray-700"
                            >
                                {isGoogleAuthPending ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Connecting...
                                    </div>
                                ) : (
                                    <>
                                        <Import className="h-4 w-4" />
                                        <span>{hasGoogleCalendarAccess ? "Google Calendar Connected" : "Import from Google Calendar"}</span>
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Day selection tabs */}
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                {daysOfWeek.map((day, index) => {
                                    // Create an array of color classes for each day


                                    const activeColorClass = dayColors[index];
                                    const inactiveColorClass = `bg-transparent border-${activeColorClass.split(' ')[0].replace('bg-', '')} text-gray-300 hover:opacity-80 `;

                                    return (
                                        <Button
                                            key={day}
                                            variant={activeDay === day ? "default" : "outline"}
                                            onClick={() => setActiveDay(day)}
                                            className={`cursor-pointer py-1 px-3 text-xs sm:text-sm rounded-md border  !border-slate-800 ${activeDay === day ? activeColorClass : inactiveColorClass
                                                }`}
                                        >
                                            {day}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Day content */}
                        <div className="flex flex-col space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-white font-medium">{activeDay}&apos;s Schedule</h3>
                                <Button
                                    size="sm"
                                    onClick={handleAddEvent}
                                    className="flex items-center space-x-1 bg-gray-900 hover:bg-gray-800 text-white text-xs border border-gray-700"
                                >
                                    <Plus className="h-3 w-3" />
                                    <span>Add Event</span>
                                </Button>
                            </div>

                            {/* Time grid - Vertical layout */}
                            <div className="relative bg-gray-950/80 rounded-lg border border-gray-800 p-4">
                                <div className="grid grid-cols-1 gap-2">
                                    {/* Events for the current day */}
                                    {schedule && schedule[activeDay].length > 0 ? (
                                        schedule[activeDay].map((event) => (
                                            <div
                                                key={event.id}
                                                className={`rounded-lg p-3 flex items-center justify-between border
                                                ${getRandomEventColor(event.type, event.id)}`}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{event.title}</span>
                                                    <span className="text-xs opacity-80">{event.startTime} - {event.endTime}</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-xs bg-gray-800/30 px-2 py-1 rounded">{event.recurrence}</span>
                                                    <button
                                                        onClick={() => handleDeleteEvent(activeDay, event.id)}
                                                        className="opacity-60 hover:opacity-100 bg-gray-800/30 p-1 rounded-full cursor-pointer"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center py-12 text-center">
                                            <p className="text-gray-400 text-sm">No events scheduled for {activeDay}. Click &quot;Add Event&quot; to add a fixed commitment.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between">
                            <Button
                                onClick={clearAllEvents}
                                variant="outline"
                                className="bg-red-950/60 hover:bg-red-900/80 text-white border border-red-800/50"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Clear All Events
                            </Button>

                            <Button
                                onClick={handleComplete}
                                className="bg-gray-900 hover:bg-gray-800 text-white border border-gray-700"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Schedule & Continue
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Add Event Dialog */}
            <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
                <DialogContent className="bg-gray-950 border border-gray-800/40 text-white sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Fixed Commitment</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Add your classes, work, or other regular commitments that have fixed times.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="event-title" className="text-white">Event title</Label>
                            <Input
                                id="event-title"
                                placeholder="e.g., CS 101 Class or Work Shift"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                className="bg-gray-900 border-gray-700 text-white"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-white mb-1">Days of week</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {daysOfWeek.map((day, index) => {
                                    const activeColorClass = dayColors[index];
                                    return (
                                        <div key={day} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`day-${day}`}
                                                checked={(newEvent.days || []).includes(day)}
                                                onCheckedChange={() => toggleDaySelection(day)}
                                                className={`border-gray-500 data-[state=checked]:bg-gray-700 ${activeColorClass}`}
                                            />
                                            <Label
                                                htmlFor={`day-${day}`}
                                                className="text-sm text-gray-300 cursor-pointer"
                                            >
                                                {day.slice(0, 2)}
                                            </Label>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="start-time" className="text-white">Start time</Label>
                                <Select
                                    value={newEvent.startTime}
                                    onValueChange={(value: string) => setNewEvent({ ...newEvent, startTime: value })}
                                >
                                    <SelectTrigger id="start-time" className="bg-gray-900 border-gray-700 text-white">
                                        <SelectValue placeholder="Start time" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-700 text-white max-h-[200px]">
                                        {timeSlots.map(time => (
                                            <SelectItem key={`start-${time}`} value={time}>{time}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="end-time" className="text-white">End time</Label>
                                <Select
                                    value={newEvent.endTime}
                                    onValueChange={(value: string) => setNewEvent({ ...newEvent, endTime: value })}
                                >
                                    <SelectTrigger id="end-time" className="bg-gray-900 border-gray-700 text-white">
                                        <SelectValue placeholder="End time" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-700 text-white max-h-[200px]">
                                        {timeSlots.map(time => (
                                            <SelectItem key={`end-${time}`} value={time}>{time}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="event-type" className="text-white">Event type</Label>
                            <Select
                                value={newEvent.type}
                                onValueChange={(value: "work" | "class" | "personal" | "other") =>
                                    setNewEvent({ ...newEvent, type: value })
                                }
                            >
                                <SelectTrigger id="event-type" className="bg-gray-900 border-gray-700 text-white">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                    <SelectItem value="work">Work</SelectItem>
                                    <SelectItem value="class">Class</SelectItem>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="recurrence" className="text-white">Recurrence</Label>
                            <Select
                                value={newEvent.recurrence}
                                onValueChange={(value: "weekly" | "biweekly" | "monthly" | "once") =>
                                    setNewEvent({ ...newEvent, recurrence: value })
                                }
                            >
                                <SelectTrigger id="recurrence" className="bg-gray-900 border-gray-700 text-white">
                                    <SelectValue placeholder="How often" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="once">One-time</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowEventDialog(false)}
                            className="bg-transparent border border-gray-700 text-white hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveEvent}
                            disabled={!newEvent.title || (newEvent.days || []).length === 0}
                            className="bg-gray-900 hover:bg-gray-800 text-white border border-gray-700"
                        >
                            Add to Schedule
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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