"use client"
import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, HTMLMotionProps } from 'framer-motion';

// Define the cn utility function directly in this file to avoid import issues
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface NebulaCardProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    variant?: 'default' | 'glow' | 'minimal';
    size?: 'sm' | 'md' | 'lg';
    hoverEffect?: boolean;
}

const NebulaCard = ({
    children,
    className,
    variant = 'default',
    size = 'md',
    hoverEffect = true,
    ...props
}: NebulaCardProps) => {
    // Size classes
    const sizeClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    // Variant classes
    const variantClasses = {
        default: 'bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-md',
        glow: 'bg-slate-900/80 backdrop-blur-md border border-purple-800/40 shadow-lg shadow-purple-500/10',
        minimal: 'bg-slate-900/50 backdrop-blur-sm',
    };

    // Hover animation
    const hoverAnimation = hoverEffect ? {
        whileHover: {
            scale: 1.02,
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.2)'
        },
        transition: {
            duration: 0.2
        }
    } : {};

    return (
        <motion.div
            className={cn(
                'rounded-xl',
                variantClasses[variant],
                sizeClasses[size],
                'transition-all duration-300',
                className
            )}
            {...hoverAnimation}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default NebulaCard; 