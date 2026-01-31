'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Filter,
    Droplets,
    FlaskConical,
    Waves,
    ShieldCheck,
    Flame,
    Ban,
    Check,
    Clock,
    DollarSign
} from 'lucide-react';

// --- Types ---
export interface TreatmentDetail {
    title: string;
    shortDesc: string;
    fullDesc: string;
    benefits: string[];
    drawbacks: string[];
    visComponent: React.FC;
    imagePath?: string;
    stats: {
        label: string;
        value: number;
        unit: string;
        color: string;
    }[];
}

// --- Visual Components (Animations) ---

// 1. Activated Carbon Filtration Animation
const ActivatedCarbonVisual = () => {
    return (
        <div className="relative w-full h-full bg-gradient-to-b from-blue-50/50 to-white overflow-hidden rounded-xl border border-border">
            {/* Carbon Bed Layer */}
            <div className="absolute top-[40%] left-[10%] right-[10%] h-[30%] bg-[#2a2a2a] rounded-lg opacity-90 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-30"
                    style={{ backgroundImage: 'radial-gradient(circle, #555 1px, transparent 1px)', backgroundSize: '8px 8px' }}>
                </div>
            </div>

            {/* Water Flow - Top to Bottom */}
            <div className="absolute inset-0 flex flex-col items-center pointer-events-none">
                {/* Contaminated Particles (Metals) entering */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                        key={`pollutant-${i}`}
                        initial={{ y: -20, x: Math.random() * 200 - 100, opacity: 0 }}
                        animate={{
                            y: [0, 150, 160], // Stop at carbon bed
                            opacity: [0, 1, 0] // Fade out as adsorbed
                        }}
                        transition={{
                            duration: 2 + Math.random(),
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 2
                        }}
                        className="absolute top-10 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"
                    />
                ))}

                {/* Clean Water leaving */}
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={`clean-${i}`}
                        initial={{ y: 180, x: Math.random() * 200 - 100, opacity: 0 }}
                        animate={{
                            y: [180, 300],
                            opacity: [0, 0.8, 0]
                        }}
                        transition={{
                            duration: 1.5 + Math.random(),
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 2 + 1
                        }}
                        className="absolute top-0 w-2 h-2 bg-blue-400 rounded-full blur-[1px]"
                    />
                ))}

                {/* Adsorption Effect (Trapped particles blinking) */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={`trapped-${i}`}
                        className="absolute top-[45%] w-2 h-2 bg-red-600 rounded-full"
                        initial={{
                            opacity: 0.2,
                            left: `${20 + Math.random() * 60}%`,
                            top: `${42 + Math.random() * 26}%`
                        }}
                        animate={{ opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                    />
                ))}
            </div>

            {/* Embedded labels moved to non-overlapping positions or removed if redundant */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded text-xs font-bold text-blue-500 border border-blue-200 shadow-sm z-20">
                Purified Water
            </div>
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-2 py-1 rounded text-xs font-bold text-red-500 border border-red-200 shadow-sm z-20">
                Heavy Metals Removed
            </div>
        </div>
    );
};

// 2. UV Sterilization Animation
const UVSterilizationVisual = () => {
    return (
        <div className="relative w-full h-full bg-slate-900 overflow-hidden rounded-xl border border-slate-800 flex items-center justify-center">

            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Central UV Lamp Tube */}
            <div className="absolute inset-y-0 w-16 bg-gradient-to-r from-purple-900/50 via-purple-500/20 to-purple-900/50 backdrop-blur-sm border-x border-purple-500/30 z-10">
                {/* Glowing Core */}
                <motion.div
                    className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-purple-100 shadow-[0_0_30px_rgba(192,132,252,0.8)] rounded-full"
                    animate={{ opacity: [0.8, 1, 0.8], boxShadow: ['0 0 20px rgba(192,132,252,0.6)', '0 0 40px rgba(192,132,252,1)', '0 0 20px rgba(192,132,252,0.6)'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Radiation Waves */}
            {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                    key={`wave-${i}`}
                    className="absolute inset-y-0 w-20 bg-purple-500/10 border-x border-purple-400/20 z-0"
                    initial={{ scaleX: 1, opacity: 0 }}
                    animate={{ scaleX: [1, 4], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                />
            ))}

            {/* Bacteria/DNA Stream */}
            <div className="absolute inset-0 z-20 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => {
                    const randomX = Math.random() * 80 - 40; // Spread around center
                    const delay = i * 1.2;

                    return (
                        <motion.div
                            key={`pathogen-${i}`}
                            className="absolute left-1/2 flex flex-col items-center justify-center w-12 h-12"
                            style={{ x: randomX }}
                            initial={{ y: -60, opacity: 0, scale: 0.8 }}
                            animate={{ y: 400, opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 5, repeat: Infinity, delay: delay, ease: "linear" }}
                        >
                            {/* Pathogen Body */}
                            <motion.div
                                className="w-10 h-10 rounded-full bg-green-900/40 border border-green-500/50 flex items-center justify-center relative shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                                animate={{
                                    borderColor: ["rgba(34,197,94,0.5)", "rgba(107,114,128,0.5)"], // Green -> Gray
                                    backgroundColor: ["rgba(20,83,45,0.4)", "rgba(55,65,81,0.4)"], // Dark Green -> Dark Gray
                                    boxShadow: ["0 0 10px rgba(34,197,94,0.3)", "none"]
                                }}
                                transition={{ duration: 0.5, delay: delay + 2.2 }} // Change color mid-stream (approx at UV lamp)
                            >
                                {/* DNA Strand Representation (Simulated) */}
                                <div className="relative w-6 h-4 flex items-center justify-center gap-1">
                                    {/* DNA Helix - Left */}
                                    <motion.div
                                        className="w-1 h-4 bg-green-400 rounded-full"
                                        animate={{ backgroundColor: ["#4ade80", "#9ca3af"], height: ["16px", "16px"] }} // Break logic handled by rotation
                                        transition={{ duration: 0.5, delay: delay + 2.2 }}
                                    />
                                    {/* DNA Helix - Crossbar (Breaks) */}
                                    <motion.div
                                        className="w-3 h-0.5 bg-green-400"
                                        initial={{ opacity: 1, rotate: 0 }}
                                        animate={{ opacity: 0, rotate: 45 }} // Breaks
                                        transition={{ duration: 0.1, delay: delay + 2.2 }}
                                    />
                                    {/* DNA Helix - Right */}
                                    <motion.div
                                        className="w-1 h-4 bg-green-400 rounded-full"
                                        animate={{ backgroundColor: ["#4ade80", "#9ca3af"] }}
                                        transition={{ duration: 0.5, delay: delay + 2.2 }}
                                    />
                                </div>

                                {/* Zap Icon Overlay */}
                                <motion.div
                                    className="absolute -top-2 -right-2 text-yellow-400 drop-shadow-md"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                                    transition={{ duration: 0.4, delay: delay + 2.2 }}
                                >
                                    <Zap className="w-6 h-6 fill-yellow-400" />
                                </motion.div>
                            </motion.div>

                            {/* Text feedback */}
                            <motion.span
                                className="absolute top-12 text-[10px] font-bold text-red-500 whitespace-nowrap bg-black/80 px-1 rounded border border-red-500/30"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0], y: [0, 10] }}
                                transition={{ duration: 1, delay: delay + 2.2 }}
                            >
                                DNA DENATURED
                            </motion.span>
                        </motion.div>
                    )
                })}
            </div>

            {/* Bottom Label */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-purple-950/80 px-4 py-1.5 rounded-full border border-purple-500/30 shadow-lg z-30">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-purple-200 text-xs font-bold tracking-wider">UV-C 254nm</span>
            </div>
        </div>
    )
}

// 3. Reverse Osmosis
const ReverseOsmosisVisual = () => {
    return (
        <div className="relative w-full h-full bg-blue-50 rounded-xl border border-blue-100 overflow-hidden flex items-center justify-center">
            {/* Membrane */}
            <div className="absolute h-[80%] w-2 bg-gray-300 left-1/2 rounded z-10 flex flex-col gap-1 items-center justify-center py-1">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="w-full h-[1px] bg-gray-400"></div>
                ))}
            </div>

            {/* Left Side (High Pressure, Contaminated) */}
            <div className="absolute inset-y-0 left-0 w-1/2 bg-blue-100/50 flex items-center justify-center">
                <div className="absolute top-4 left-4 font-bold text-xs text-blue-800">High Pressure</div>
                {/* Particles bouncing off */}
                {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-orange-500 rounded-full"
                        initial={{ x: -100, y: Math.random() * 200 - 100 }}
                        animate={{ x: [0, 140, 20], y: Math.random() * 200 - 100 }} // Hit center (150 approx) and bounce back
                        transition={{ duration: 2, repeat: Infinity, ease: "circOut" }}
                    />
                ))}
            </div>

            {/* Right Side (Pure) */}
            <div className="absolute inset-y-0 right-0 w-1/2 bg-blue-50 flex items-center justify-center">
                <div className="absolute top-4 right-4 font-bold text-xs text-blue-500">Permeate</div>
                {/* Water molecules passing through */}
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400 rounded-full"
                        initial={{ x: 0, scale: 0 }}
                        animate={{ x: [0, 150], scale: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() }}
                    />
                ))}
            </div>

            <div className="absolute bottom-4 bg-white/90 px-3 py-1 rounded shadow text-xs font-bold text-gray-700">
                Semi-Permeable Membrane
            </div>
        </div>
    )
}

// 4. Chlorination Animation
const ChlorinationVisual = () => {
    return (
        <div className="relative w-full h-full bg-blue-50 overflow-hidden rounded-xl border border-blue-200">
            {/* Water Body */}
            <div className="absolute inset-0 bg-blue-400/20"></div>

            {/* Chlorine Tablet Drop */}
            <motion.div
                className="absolute top-0 left-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-200 z-20 flex items-center justify-center text-xs font-bold text-gray-500"
                initial={{ y: -50, scale: 1, opacity: 1 }}
                animate={{ y: 150, scale: 0, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
                Cl
            </motion.div>

            {/* Ripple Effect at impact */}
            <motion.div
                className="absolute top-[150px] left-1/2 w-10 h-10 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.8, repeatDelay: 3.5 }}
            />

            {/* Diffusion of Chlorine */}
            <motion.div
                className="absolute top-[150px] left-1/2 w-full h-full bg-green-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 3, opacity: [0, 0.5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.9, repeatDelay: 2 }}
            />

            {/* Bacteria neutralization */}
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={`bac-${i}`}
                    initial={{
                        x: Math.random() * 300,
                        y: Math.random() * 300,
                        scale: 1,
                        rotate: 0
                    }}
                    animate={{
                        x: Math.random() * 300,
                        y: Math.random() * 300 + 20,
                        rotate: 180,
                        scale: [1, 1, 0] // Shrink/die
                    }}
                    transition={{
                        duration: 3 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 2
                    }}
                    className="absolute w-4 h-4"
                >
                    <motion.span
                        animate={{ color: ["#10b981", "#ef4444", "#9ca3af"] }} // Green -> Red -> Grey
                        transition={{ duration: 3, repeat: Infinity, delay: Math.random() }}
                    >
                        🦠
                    </motion.span>
                </motion.div>
            ))}

            <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-blue-600 bg-white/80 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    Chemical Disinfection
                </span>
            </div>
        </div>
    );
};

// 5. Boiling Animation
const BoilingVisual = () => {
    return (
        <div className="relative w-full h-full bg-orange-50 overflow-hidden rounded-xl border border-orange-200 flex flex-col items-center justify-end pb-10">
            {/* Heat Source */}
            <div className="absolute bottom-0 w-full h-2 bg-red-500"></div>
            <div className="flex gap-4 justify-center absolute bottom-2 w-full">
                {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="bg-orange-500 w-4 h-8 rounded-t-full blur-sm"
                        animate={{ height: [20, 40, 20], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    />
                ))}
            </div>

            {/* Pot/Water Container */}
            <div className="relative w-3/4 h-3/4 bg-blue-100/30 border-b-4 border-x-4 border-gray-400 rounded-b-2xl overflow-hidden backdrop-blur-sm">
                {/* Bubbles */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={`bub-${i}`}
                        className="absolute bg-white/60 rounded-full border border-blue-200"
                        style={{ width: Math.random() * 20 + 5, height: Math.random() * 20 + 5, bottom: 0 }}
                        initial={{ x: Math.random() * 200, y: 0, opacity: 0 }}
                        animate={{ y: -300, opacity: [0, 1, 0] }}
                        transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() }}
                    />
                ))}

                {/* Steam */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                        key={`steam-${i}`}
                        className="absolute -top-10 w-10 h-20 bg-white/30 blur-xl rounded-full"
                        style={{ left: `${20 + i * 15}%` }}
                        animate={{ y: [-20, -100], opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                ))}

                {/* Dead Bacteria Sinking */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={`dead-${i}`}
                        className="absolute text-gray-500 scale-75 rotate-180"
                        initial={{ top: '20%', left: Math.random() * 80 + 10 + '%' }}
                        animate={{ top: '90%', opacity: [1, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity, delay: Math.random() * 2 }}
                    >
                        💀
                    </motion.div>
                ))}
            </div>
            <div className="absolute top-4 bg-white/80 px-3 py-1 rounded text-xs font-bold text-red-500 shadow-sm border border-red-100">
                Temperature &gt; 100°C
            </div>
        </div>
    )
}

// 6. Ceramic Filtration (Porous Block)
const CeramicFiltrationVisual = () => {
    return (
        <div className="relative w-full h-full bg-stone-50 overflow-hidden rounded-xl border border-stone-200 flex items-center justify-center">
            {/* Dirty Water (Left/Top) */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 to-transparent pointer-events-none" />

            {/* Candle Filter */}
            <div className="relative w-32 h-64 bg-stone-100 border-2 border-stone-300 rounded-full overflow-hidden shadow-inner flex items-center justify-center">
                {/* Pores texture */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#a8a29e 1px, transparent 1px)', backgroundSize: '4px 4px' }} />

                {/* Clean Water Core */}
                <div className="w-16 h-full bg-blue-50/80 blur-md rounded-full" />

                {/* Flow Animation */}
                <motion.div
                    className="absolute inset-0 bg-blue-200/20"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>

            {/* Particles getting stuck on outside */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-amber-700 rounded-full"
                    initial={{ x: -150, y: Math.random() * 300 - 150, opacity: 0 }}
                    animate={{ x: -40 + Math.random() * 20, opacity: 1 }} // Hit the wall
                    transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() * 2 }}
                    style={{ left: '50%', top: '50%' }}
                />
            ))}

            {/* Clean water dropping out bottom */}
            {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                    key={`drip-${i}`}
                    className="absolute bottom-10 w-3 h-4 bg-blue-400 rounded-full drop-shadow-sm"
                    initial={{ y: 0, opacity: 1, scale: 0 }}
                    animate={{ y: 100, opacity: 0, scale: 1 }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.4 }}
                />
            ))}
        </div>
    )
}

// 7. Flocculation (Clumping)
const FlocculationVisual = () => {
    return (
        <div className="relative w-full h-full bg-cyan-50 overflow-hidden rounded-xl border border-cyan-100">
            {/* Stirring Rod (Simulated) */}
            <motion.div
                className="absolute top-0 left-1/2 w-2 h-40 bg-gray-400 opacity-50 origin-top"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Small Particles becoming big clumps */}
            {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-amber-600 rounded-full"
                    initial={{
                        x: Math.random() * 300,
                        y: Math.random() * 200,
                        scale: 1
                    }}
                    animate={{
                        x: 150 + Math.random() * 40 - 20, // Move to center
                        y: 300, // Sink
                        scale: 3 // Clump
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: Math.random() }}
                />
            ))}

            <div className="absolute inset-x-0 bottom-0 h-12 bg-amber-900/20 blur-lg" />
            <div className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded text-xs font-bold text-amber-700 shadow-sm border border-amber-100">
                Alum Coagulation
            </div>
        </div>
    )
}

// 8. Distillation
const DistillationVisual = () => {
    return (
        <div className="relative w-full h-full bg-slate-50 overflow-hidden rounded-xl border border-slate-200 flex items-center justify-between px-10">
            {/* Boiling Chamber */}
            <div className="relative w-20 h-32 bg-red-100 rounded-b-xl border-2 border-red-200 flex items-end justify-center">
                <div className="absolute bottom-0 w-full h-20 bg-blue-300 opacity-50 rounded-b-lg"></div>
                <motion.div
                    className="w-full h-full bg-red-500/10"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />

                {/* Rising Steam */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                        key={`s-${i}`}
                        className="absolute bottom-10 w-4 h-4 bg-white rounded-full blur-md"
                        animate={{ y: -120, x: 20 }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    />
                ))}
            </div>

            {/* Condenser Tube */}
            <div className="absolute top-10 left-32 right-32 h-4 bg-gray-300 rounded-full transform rotate-12 z-10 overflow-hidden">
                <motion.div
                    className="w-10 h-full bg-blue-400 blur-sm"
                    animate={{ x: [0, 200] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Collection Chamber */}
            <div className="relative w-20 h-32 bg-blue-50 rounded-b-xl border-2 border-blue-200 flex items-end justify-center">
                <div className="absolute bottom-0 w-full h-10 bg-blue-500/30 rounded-b-lg animate-pulse" />

                {/* Dripping Pure Water */}
                {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                        key={`d-${i}`}
                        className="absolute top-0 w-3 h-3 bg-blue-500 rounded-full"
                        animate={{ y: 100 }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                    />
                ))}
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded shadow-sm">
                Evaporation &rarr; Condensation
            </div>
        </div>
    )
}

// 9. Aeration
const AerationVisual = () => {
    return (
        <div className="relative w-full h-full bg-cyan-50 overflow-hidden rounded-xl border border-cyan-200">
            <div className="absolute inset-0 bg-blue-400/10"></div>

            {/* Air Diffuser at bottom */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-4 bg-gray-600 rounded-full flex justify-around px-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-black rounded-full mt-1"></div>
                ))}
            </div>

            {/* Rising Air Bubbles */}
            {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bottom-14 w-3 h-3 bg-white/40 border border-white rounded-full"
                    style={{ left: `${30 + Math.random() * 40}%` }}
                    initial={{ y: 0, scale: 0.5 }}
                    animate={{ y: -300, scale: 1.5, x: Math.random() * 40 - 20 }}
                    transition={{ duration: 3 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
                />
            ))}

            {/* VOCs escaping */}
            {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                    key={`voc-${i}`}
                    className="absolute top-10 w-2 h-2 bg-yellow-400 rounded-full opacity-0"
                    style={{ left: `${20 + Math.random() * 60}%` }}
                    animate={{ y: -50, opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: Math.random() * 2 }}
                >
                    <span className="absolute -top-4 text-[8px] text-gray-500">GAS</span>
                </motion.div>
            ))}

            <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                O₂ Injection
            </div>
        </div>
    )
}

// 10. pH Adjustment
const PHAdjustmentVisual = () => {
    return (
        <div className="relative w-full h-full bg-white overflow-hidden rounded-xl border border-gray-200 flex items-center justify-center">
            {/* Beaker */}
            <div className="relative w-40 h-56 border-b-4 border-x-4 border-gray-400 rounded-b-3xl overflow-hidden">
                {/* Liquid changing color */}
                <motion.div
                    className="absolute inset-0 top-10"
                    animate={{ backgroundColor: ["#ef4444", "#eab308", "#22c55e"] }} // Red (Acid) -> Yellow -> Green (Neutral)
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                />

                {/* Drip entering */}
                <motion.div
                    className="absolute -top-10 left-1/2 -translate-x-1/2 w-4 h-10 bg-white flex items-end justify-center"
                >
                    <motion.div
                        className="w-3 h-4 bg-teal-500 rounded-full"
                        animate={{ y: 100, opacity: [1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                </motion.div>

                {/* Stirring effect bubbles */}
                {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/30 rounded-full"
                        style={{ bottom: Math.random() * 100, left: Math.random() * 100 }}
                        animate={{ y: -20, scale: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                    />
                ))}
            </div>

            <div className="absolute bottom-6 flex gap-8 font-bold text-sm">
                <span className="text-red-500">Acidic</span>
                <span className="text-green-600">Neutral</span>
                <span className="text-blue-600">Basic</span>
            </div>
        </div>
    )
}

// --- Content Mapping ---

export const TREATMENT_DETAILS: Record<string, TreatmentDetail> = {
    "Activated Carbon Filtration": {
        title: "Activated Carbon Filtration",
        shortDesc: "Adsorption process to remove heavy metals and toxins",
        fullDesc: "Activated carbon filtration uses a bed of carbon that has been treated to increase its surface area. This vast surface area allows it to trap contaminants, particularly organic compounds, chlorine, and heavy metals like lead and mercury, through a process called adsorption. As water passes through, pollutants stick to the carbon while clean water flows through.",
        benefits: [
            "Removes bad taste and odors",
            "Effective against chlorine and volatile organic compounds (VOCs)",
            "Traps heavy metals like lead and mercury",
            "Low maintenance compared to other methods"
        ],
        drawbacks: [
            "Does not remove bacteria or viruses effectively",
            "Filters need regular replacement to prevent saturation",
            "Over time, trapped bacteria can grow on the filter"
        ],
        visComponent: ActivatedCarbonVisual,
        imagePath: "/report images/1.acitivated water carbon filter.webp",
        stats: [
            { label: "Efficiency", value: 85, unit: "%", color: "#3b82f6" },
            { label: "Cost", value: 40, unit: "₹/kL", color: "#10b981" },
            { label: "Life", value: 6, unit: "mos", color: "#6366f1" },
        ]
    },
    "UV Sterilization": {
        title: "UV Sterilization",
        shortDesc: "Ultraviolet light purification to neutralize biological threats",
        fullDesc: "UV sterilization exposes water to ultraviolet light at the germicidal wavelength (254 nm). This radiation penetrates the cell walls of bacteria, viruses, and protozoa, damaging their DNA/RNA and preventing them from reproducing. It effectively 'deactivates' pathogens without adding any chemicals to the water.",
        benefits: [
            "Kills 99.99% of bacteria and viruses",
            "Chemical-free process",
            "Does not alter taste or pH of water",
            "Low operating cost (electricity)"
        ],
        drawbacks: [
            "Does not remove dissolved solids or particles",
            "Requires clear water (turbidity hinders effectiveness)",
            "Depends on electricity supply"
        ],
        visComponent: UVSterilizationVisual,
        imagePath: "/report images/2.uv strlization of water to filiterate scientific diagram.webp",
        stats: [
            { label: "Kill Rate", value: 99.9, unit: "%", color: "#ef4444" },
            { label: "Power", value: 20, unit: "W", color: "#eab308" },
            { label: "Speed", value: 10, unit: "L/m", color: "#3b82f6" },
        ]
    },
    "Reverse Osmosis": {
        title: "Reverse Osmosis (RO)",
        shortDesc: "High-pressure membrane filtration for molecular-level purity",
        fullDesc: "Reverse Osmosis forces water through a semi-permeable membrane with microscopic pores (0.0001 microns). This barrier allows only water molecules to pass while rejecting dissolved salts, heavy metals, fluoride, and pathogens, which are flushed away as wastewater.",
        benefits: [
            "Removes 95-99% of all contaminants",
            "Effective against dissolved salts (TDS)",
            "Improves taste and smell significantly",
            "Best solution for hard or saline water"
        ],
        drawbacks: [
            "Wastes a significant amount of water (brine)",
            "Removes beneficial minerals (requires remineralization)",
            "Slow filtration process"
        ],
        visComponent: ReverseOsmosisVisual,
        imagePath: "/report images/3.resverse osmisis.webp",
        stats: [
            { label: "Purity", value: 98, unit: "%", color: "#3b82f6" },
            { label: "Waste", value: 60, unit: "%", color: "#ef4444" },
            { label: "TDS Rem", value: 95, unit: "%", color: "#10b981" },
        ]
    },
    "Chlorination": {
        title: "Chlorination",
        shortDesc: "Chemical disinfection using chlorine",
        fullDesc: "Chlorination involves adding chlorine-based products to water to kill pathogens. The chlorine releases strong oxidizing agents that rupture the cell walls of bacteria and viruses, neutralizing them. It also provides a residual effect, keeping the water safe from recontamination during storage.",
        benefits: ["Highly effective against bacteria/viruses", "Provides residual protection", "Very low cost and widely available"],
        drawbacks: ["Can change taste/odor", "Not effective against Cryptosporidium", "Potential by-products if organics present"],
        visComponent: ChlorinationVisual,
        imagePath: "/report images/4.chlorination of water to filiterate scientific diagram.webp",
        stats: [
            { label: "Bacteria", value: 99, unit: "%", color: "#10b981" },
            { label: "Cost", value: 15, unit: "₹/kL", color: "#3b82f6" },
            { label: "Time", value: 30, unit: "min", color: "#f59e0b" },
        ]
    },
    "Boiling": {
        title: "Boiling",
        shortDesc: "Thermal disinfection by heat",
        fullDesc: "Boiling is the simplest and most reliable method to kill disease-causing microbiological pathogens. Bringing water to a rolling boil for 1-3 minutes ensures that bacteria, viruses, and protozoa are destroyed by the high temperature.",
        benefits: ["No chemicals needed", "Simple to perform anywhere", "Kills all classes of pathogens"],
        drawbacks: ["Uses fuel/energy", "Time consuming", "Does not remove chemical pollutants (metals, salts)"],
        visComponent: BoilingVisual,
        imagePath: "/report images/5.boiling of water to filter scientific diagram.webp",
        stats: [
            { label: "Kill Rate", value: 100, unit: "%", color: "#ef4444" },
            { label: "Cost", value: 100, unit: "₹/kL", color: "#f97316" },
            { label: "Time", value: 20, unit: "min", color: "#6366f1" },
        ]
    },
    "Ceramic Filtration": {
        title: "Ceramic Filtration",
        shortDesc: "Physical filtration through porous ceramic",
        fullDesc: "Ceramic filters use a porous ceramic medium to filter water. The tiny pores (down to 0.2 microns) mechanically trap bacteria, cysts, and suspended particles, while allowing clean water to pass through. Some are treated with silver to inhibit bacterial growth.",
        benefits: ["Removes bacteria and protozoa", "Long lifespan (cleanable)", "No electricity required"],
        drawbacks: ["Slow flow rate", "Does not remove viruses (too small)", "Fragile (can break)"],
        visComponent: CeramicFiltrationVisual,
        imagePath: "/report images/7.cermaic water filter.webp",
        stats: [
            { label: "Bacteria", value: 99, unit: "%", color: "#3b82f6" },
            { label: "Cost", value: 30, unit: "₹/kL", color: "#10b981" },
            { label: "Flow", value: 2, unit: "L/hr", color: "#f59e0b" },
        ]
    },
    "Flocculation + Sedimentation": {
        title: "Flocculation & Sedimentation",
        shortDesc: "Chemical coagulation to remove particles",
        fullDesc: "This process involves adding coagulants (like Alum) that cause small suspended particles to clump together into larger 'flocs'. These heavier flocs then settle to the bottom due to gravity (sedimentation), leaving clear water on top which can be poured off.",
        benefits: ["Removes turbidity (cloudiness)", "Removes some bacteria adhered to particles", "Low cost"],
        drawbacks: ["Requires specific chemicals", "Needs settling time (hours)", "Sludge disposal required"],
        visComponent: FlocculationVisual,
        stats: [
            { label: "Clarity", value: 90, unit: "%", color: "#06b6d4" },
            { label: "Cost", value: 20, unit: "₹/kL", color: "#10b981" },
            { label: "Time", value: 4, unit: "hr", color: "#6366f1" },
        ],
        imagePath: "/report images/6.flocculation.png"
    },
    "Distillation": {
        title: "Distillation",
        shortDesc: "Evaporation and condensation for high purity",
        fullDesc: "Distillation mimics the natural water cycle. Water is heated to boiling, turning into steam that leaves impurities behind. The steam is then captured and cooled in a condenser, returning to liquid state as distilled water, free from dissolved solids, salts, and pathogens.",
        benefits: ["Removes almost ALL impurities (chemicals, salts, bio)", "Consistent quality", "No filters to replace"],
        drawbacks: ["Very energy intensive", "Slow production", "Flat taste (no minerals)"],
        visComponent: DistillationVisual,
        stats: [
            { label: "Purity", value: 99.9, unit: "%", color: "#3b82f6" },
            { label: "Cost", value: 200, unit: "₹/kL", color: "#ef4444" },
            { label: "Time", value: 6, unit: "hr", color: "#f59e0b" },
        ]
    },
    "Aeration": {
        title: "Aeration",
        shortDesc: "Oxygenation to remove gases and oxidize metals",
        fullDesc: "Aeration brings water and air into close contact. This removes dissolved gases like carbon dioxide and oxidizes dissolved metals such as iron and hydrogen sulfide, causing them to precipitate out of the solution so they can be filtered.",
        benefits: ["Improves taste and oxygen levels", "Removes rotten egg smell (Sulfur)", "Oxidizes iron/manganese"],
        drawbacks: ["Does not disinfect water", "Requires energy for pumps", "Can introduce airborne contaminants if air is dirty"],
        visComponent: AerationVisual,
        stats: [
            { label: "O2 Level", value: 100, unit: "%", color: "#0ea5e9" },
            { label: "Iron Rem", value: 80, unit: "%", color: "#f97316" },
            { label: "Cost", value: 10, unit: "₹/kL", color: "#10b981" },
        ],
        imagePath: "/report images/8.aeration.png"
    },
    "pH Adjustment": {
        title: "pH Adjustment",
        shortDesc: "Balancing acidity or alkalinity",
        fullDesc: "pH adjustment involves adding neutralizing agents to water to bring its pH level to the optimal range (6.5-8.5). Acidic water (low pH) is treated with alkaline substances (soda ash, lime), while basic water (high pH) is treated with mild acids.",
        benefits: ["Prevents pipe corrosion", "Improves effectiveness of disinfection", "Neutral taste"],
        drawbacks: ["Requires careful dosage", "Chemical handling safety", "Continuous monitoring needed"],
        visComponent: PHAdjustmentVisual,
        stats: [
            { label: "Balance", value: 100, unit: "%", color: "#8b5cf6" },
            { label: "Cost", value: 25, unit: "₹/kL", color: "#10b981" },
            { label: "Time", value: 15, unit: "min", color: "#f59e0b" },
        ]
    },
    // Default fallback for others
    "Default": {
        title: "Standard Filtration",
        shortDesc: "General water treatment process",
        fullDesc: "This standard filtration method helps reduce particulate matter and improves overall water quality. Specific details for this method are currently being updated in our database.",
        benefits: ["Improves clarity", "Basic sediment removal"],
        drawbacks: ["Limited effectiveness against dissolved chemicals"],
        visComponent: () => (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl border border-dashed border-gray-300 text-gray-400">
                <Filter className="w-12 h-12" />
            </div>
        ),
        stats: [
            { label: "Effectiveness", value: 50, unit: "%", color: "#9ca3af" }
        ]
    }
};

export const getTreatmentDetails = (methodName: string): TreatmentDetail => {
    // Fuzzy match or exact match
    const key = Object.keys(TREATMENT_DETAILS).find(k => methodName.includes(k) || k.includes(methodName));
    return TREATMENT_DETAILS[key || "Default"];
};
