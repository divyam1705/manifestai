"use client"

import { motion } from "framer-motion";
import { Clock, CheckCircle, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
    id: number;
    title: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
    dueDate: string;
}

interface UpcomingTask {
    id: number;
    title: string;
    time: string;
    dueDate: string;
}

interface TaskTrackingProps {
    tasks: Task[];
    upcomingTasks: UpcomingTask[];
    onToggleTask: (taskId: number) => void;
    onDeleteTask: (taskId: number) => void;
}

// TaskItem component for reusability
interface TaskItemProps {
    task: Task;
    onToggle: (taskId: number) => void;
    onDelete: (taskId: number) => void;
}

const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
    const priorityColors: Record<string, string> = {
        high: "text-red-400 border-red-400/30",
        medium: "text-amber-400 border-amber-400/30",
        low: "text-blue-400 border-blue-400/30"
    };

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg bg-slate-900/60 backdrop-blur-sm border border-slate-800/40 mb-2 group ${task.completed ? 'opacity-70' : ''}`}>
            <div className="flex items-center space-x-3">
                <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => onToggle(task.id)}
                    className="border-slate-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
                <div className="flex flex-col">
                    <span className={`text-sm font-medium ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.title}
                    </span>
                    <span className="text-xs text-slate-400">{task.dueDate}</span>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {!task.completed && (
                    <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.priority]}`}>
                        {task.priority}
                    </span>
                )}
                <button
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-800 rounded-full"
                >
                    <Trash2 className="h-3.5 w-3.5 text-slate-400" />
                </button>
            </div>
        </div>
    );
};

export default function TaskTracking({ tasks, upcomingTasks, onToggleTask, onDeleteTask }: TaskTrackingProps) {
    const completedTasksCount = tasks.filter(task => task.completed).length;

    return (
        <Card className="bg-slate-900/60 backdrop-blur-md border border-slate-800/40 shadow-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-indigo-400" />
                    Today&apos;s Tasks
                </h2>

                <div className="flex items-center text-slate-400 text-sm">
                    <span className="text-slate-400">{completedTasksCount}/{tasks.length}</span>
                </div>
            </div>

            <div className="space-y-2">
                {tasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={onToggleTask}
                        onDelete={onDeleteTask}
                    />
                ))}

                <Button variant="ghost" className="w-full mt-2 border border-dashed border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800/50">
                    <Plus className="h-4 w-4 mr-2" />
                    <span>Add New Task</span>
                </Button>
            </div>

            {/* Upcoming Tasks */}
            <div className="mt-6">
                <h3 className="text-white font-medium mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                    Upcoming Tasks
                </h3>

                <div className="space-y-2">
                    {upcomingTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/20">
                            <div className="flex items-center space-x-3">
                                <div className="bg-slate-800 h-6 w-6 rounded-full flex items-center justify-center">
                                    <Clock className="h-3.5 w-3.5 text-indigo-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-white">{task.title}</span>
                                    <span className="text-xs text-slate-400">{task.dueDate}</span>
                                </div>
                            </div>
                            <div className="text-xs px-2 py-1 bg-slate-800 rounded-full text-slate-300">
                                {task.time}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
} 