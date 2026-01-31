'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Droplets, Bath, Sprout, Mountain, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { WaveAnimation } from '@/components/ui/wave-animation';

export function HeroSection() {
    return (
        <section className="min-h-screen w-full relative overflow-hidden bg-[#023e8a] text-white pt-24 pb-20 px-4 md:px-8 flex flex-col items-center">

            {/* Wave Animation Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <WaveAnimation
                    particleColor="#48cae4"
                    waveSpeed={1.5}
                    waveIntensity={6}
                    pointSize={2}
                    gridDistance={6}
                    className="opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#023e8a]/90 via-[#0077b6]/80 to-[#0096c7]/90 z-10" />
            </div>

            <div className="max-w-7xl mx-auto w-full space-y-16 relative z-20">

                {/* 1. Split Header Section */}
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                    {/* Left: Uncropped Visual Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/2 flex justify-center md:justify-end"
                    >
                        <div className="relative w-full max-w-md aspect-[4/3] md:aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden p-6 z-20">
                            <Image
                                src="/jalgyan%20images/SDG-6.jpeg"
                                alt="SDG 6 Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* Right: Title & Intro */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full md:w-1/2 text-center md:text-left space-y-6"
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-semibold tracking-wider uppercase shadow-lg">
                            Global Goal
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-lg">
                            SDG-6: <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                                Clean Water & Sanitation
                            </span>
                        </h1>
                        <p className="text-xl text-blue-100/90 font-light leading-relaxed max-w-lg mx-auto md:mx-0 drop-shadow-md">
                            Ensure availability and sustainable management of water and sanitation for all.
                        </p>
                    </motion.div>
                </div>

                {/* 2. Detailed Targets Grid (6.1 - 6.6) */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold mb-2 drop-shadow-md">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                                Key Targets
                            </span>
                        </h2>
                        <div className="h-1 w-24 bg-blue-300 mx-auto rounded-full shadow-lg"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <TargetCard
                            id="6.1"
                            title="Safe Drinking Water"
                            description="Achieve universal and equitable access to safe and affordable drinking water for all."
                            icon={<Droplets className="w-6 h-6" />}
                            delay={0.1}
                        />
                        <TargetCard
                            id="6.2"
                            title="Sanitation & Hygiene"
                            description="Achieve access to adequate and equitable sanitation and hygiene for all and end open defecation."
                            icon={<Bath className="w-6 h-6" />}
                            delay={0.2}
                        />
                        <TargetCard
                            id="6.3"
                            title="Water Quality"
                            description="Improve water quality by reducing pollution, eliminating dumping and minimizing hazardous chemicals."
                            icon={<ShieldCheck className="w-6 h-6" />}
                            delay={0.3}
                        />
                        <TargetCard
                            id="6.4"
                            title="Water-Use Efficiency"
                            description="Substantially increase water-use efficiency across all sectors and ensure sustainable withdrawals."
                            icon={<RefreshCw className="w-6 h-6" />}
                            delay={0.4}
                        />
                        <TargetCard
                            id="6.5"
                            title="Integrated Management"
                            description="Implement integrated water resources management at all levels, including transboundary cooperation."
                            icon={<Sprout className="w-6 h-6" />}
                            delay={0.5}
                        />
                        <TargetCard
                            id="6.6"
                            title="Water Ecosystems"
                            description="Protect and restore water-related ecosystems, including mountains, forests, wetlands, rivers, and lakes."
                            icon={<Mountain className="w-6 h-6" />}
                            delay={0.6}
                        />
                    </div>
                </div>

                {/* 3. Divider & Countdown */}
                <div className="w-full max-w-4xl mx-auto space-y-8 text-center pt-8">
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="flex items-center gap-4 text-blue-200/80"
                    >
                        <div className="h-px bg-current flex-1"></div>
                        <span className="text-lg md:text-xl font-bold uppercase tracking-widest text-white whitespace-nowrap drop-shadow-md">
                            Achieving all this by 2030
                        </span>
                        <div className="h-px bg-current flex-1"></div>
                    </motion.div>

                    <div className="flex justify-center">
                        <CountdownTimer />
                    </div>
                </div>

                {/* 4. Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
                >
                    <Link href="/analyze" className="w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto py-4 px-10 bg-white text-blue-600 rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] transition-all z-20"
                        >
                            <Droplets size={24} className="fill-current" />
                            Analyze Water
                        </motion.button>
                    </Link>
                    <Link href="/map" className="w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto py-4 px-10 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/10 transition-colors z-20"
                        >
                            Explore Map
                            <ArrowRight size={24} />
                        </motion.button>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}

function TargetCard({ id, title, description, icon, delay }: { id: string, title: string, description: string, icon: React.ReactNode, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group z-20 flex flex-col justify-between h-full border border-gray-100"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 mb-1">Target</span>
                    <h3 className="text-3xl font-bold text-gray-900 leading-none tracking-tight">{id}</h3>
                </div>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {icon}
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-lg font-bold text-gray-800 leading-tight">
                    {title}
                </h4>
                <div className="h-px w-full bg-gray-100"></div>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                    On Track <ArrowRight size={12} className="-rotate-45" />
                </span>
            </div>
        </motion.div>
    )
}
