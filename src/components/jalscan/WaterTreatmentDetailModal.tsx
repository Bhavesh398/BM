'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, TrendingUp, AlertTriangle, Layers, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getTreatmentDetails } from './treatment-content';
import Image from 'next/image';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface WaterTreatmentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    methodName: string;
}

export default function WaterTreatmentDetailModal({
    isOpen,
    onClose,
    methodName
}: WaterTreatmentDetailModalProps) {
    const details = getTreatmentDetails(methodName);
    const VisualComponent = details.visComponent;

    // Scroll to top when opening new method
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (isOpen && scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [isOpen, methodName]);

    // Handle Escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                e.stopPropagation();
                e.preventDefault();
                onClose();
            }
        };
        // Use capture phase to intercept before other handlers
        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            // Only close on click directly on backdrop
                            if (e.target === e.currentTarget) {
                                e.stopPropagation();
                                onClose();
                            }
                        }}
                        className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onWheel={(e) => e.stopPropagation()}
                    >
                        <div
                            className="bg-card w-full max-w-6xl h-[90vh] rounded-[2rem] shadow-2xl border border-border overflow-hidden pointer-events-auto flex flex-col md:flex-row relative"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                        >

                            {/* Close Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    onClose();
                                }}
                                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/10 hover:bg-black/20 text-foreground/80 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* LEFT COLUMN: Visuals (55% width, Scrollable) */}
                            <div
                                className="w-full md:w-[55%] h-[50vh] md:h-full bg-muted/30 p-6 flex flex-col overflow-y-auto shrink-0"
                                ref={scrollRef}
                                onWheel={(e) => e.stopPropagation()}
                            >
                                {/* Header Section */}
                                <div className="mb-8 z-10 relative">
                                    <Badge variant="outline" className="bg-background/50 backdrop-blur text-primary border-primary/30 mb-2">
                                        Detailed Analysis
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-foreground leading-tight">{details.title}</h2>
                                    <p className="text-muted-foreground mt-2 text-lg">{details.shortDesc}</p>
                                </div>

                                {/* SECTION 1: Interactive Simulation */}
                                <div className="mb-8 p-4 bg-background rounded-3xl border border-border/50 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-none">
                                            <Sparkles className="w-3 h-3 mr-1" /> Live Simulation
                                        </Badge>
                                    </div>
                                    <div className="w-full aspect-[4/3] relative shadow-inner rounded-xl overflow-hidden bg-muted/20 border border-border/30">
                                        <VisualComponent />
                                    </div>
                                </div>

                                {/* SECTION 2: Scientific Diagram (Conditionally Rendered) */}
                                {details.imagePath && (
                                    <div className="mb-4 p-4 bg-background rounded-3xl border border-border/50 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border-none">
                                                <ImageIcon className="w-3 h-3 mr-1" /> Scientific Diagram
                                            </Badge>
                                        </div>
                                        <div className="w-full relative shadow-inner rounded-xl overflow-hidden bg-white min-h-[300px] flex items-center justify-center border border-border/30">
                                            <div className="absolute inset-0 p-4">
                                                <Image
                                                    src={details.imagePath}
                                                    alt={`${details.title} Diagram`}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN: Info & Stats (45% width) */}
                            <div
                                className="w-full md:w-[45%] h-[50vh] md:h-full overflow-y-auto p-6 md:p-8 bg-card border-l border-border/50 shrink-0"
                                onWheel={(e) => e.stopPropagation()}
                            >

                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    {details.stats.map((stat, idx) => (
                                        <div key={idx} className="bg-muted/30 p-3 rounded-2xl text-center border border-border/50 flex flex-col justify-center">
                                            <div className="text-2xl font-black mb-1 leading-none" style={{ color: stat.color }}>
                                                {stat.value}<span className="text-xs align-top ml-0.5 font-bold opacity-70">{stat.unit}</span>
                                            </div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                        <Layers className="w-5 h-5 text-blue-500" />
                                        Process Overview
                                    </h3>
                                    <p className="text-muted-foreground leading-loose text-sm text-justify">
                                        {details.fullDesc}
                                    </p>
                                </div>

                                {/* Pros & Cons Grid */}
                                <div className="space-y-6 mb-8">
                                    <div>
                                        <h4 className="font-bold text-xs text-green-600 mb-3 uppercase tracking-wider bg-green-500/10 inline-block px-2 py-1 rounded">Benefits</h4>
                                        <ul className="space-y-3">
                                            {details.benefits.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                                                    <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                        <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <span className="leading-tight">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs text-red-500 mb-3 uppercase tracking-wider bg-red-500/10 inline-block px-2 py-1 rounded">Limitations</h4>
                                        <ul className="space-y-3">
                                            {details.drawbacks.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                                                    <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                                        <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" />
                                                    </div>
                                                    <span className="leading-tight">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Simplified Efficiency Chart */}
                                <div className="h-40 w-full mb-6 p-4 bg-muted/20 rounded-2xl border border-border/30">
                                    <h4 className="font-bold text-xs text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                                        <TrendingUp className="w-3 h-3" />
                                        Performance View
                                    </h4>
                                    <ResponsiveContainer width="100%" height="80%">
                                        <BarChart data={details.stats} layout="vertical" margin={{ left: 10, right: 10 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.1} />
                                            <XAxis type="number" hide />
                                            <YAxis type="category" dataKey="label" tick={{ fontSize: 9 }} width={40} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                                            />
                                            <Bar dataKey="value" radius={[2, 2, 2, 2]} barSize={12} background={{ fill: 'rgba(0,0,0,0.02)' }}>
                                                {details.stats.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <Button
                                    className="w-full rounded-xl font-bold"
                                    variant="outline"
                                    size="lg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        onClose();
                                    }}
                                >
                                    Close Analysis
                                </Button>

                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
