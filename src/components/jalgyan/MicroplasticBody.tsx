'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { BarChart3, Microscope, ExternalLink, FileText, AlertTriangle, Droplets, Info } from 'lucide-react';

const timelineEvents = [
    {
        year: '1950s',
        title: 'The Plastic Boom',
        description: 'Mass production of plastics began. It was seen as a miracle material—cheap, durable, and versatile. The world embraced "Tupperware parties" and disposable convenience, unaware of the lasting legacy.',
        image: '/images/microplastic1-1950s.png',
        color: 'from-blue-400 to-cyan-400',
    },
    {
        year: '1980s',
        title: 'The Accumulation',
        description: 'Ocean currents began concentrating floating debris. The "Great Pacific Garbage Patch" started to form, a swirling vortex of plastic waste that would eventually grow to three times the size of France.',
        image: '/images/microplastic-1980s.png',
        color: 'from-cyan-500 to-teal-500',
    },
    {
        year: '2000s',
        title: 'The Breakdown',
        description: 'We realized plastic doesn\'t disappear; it breaks down. Microplastics (<5mm) were found on every beach, in the deepest trenches, and even trapped in Arctic ice.',
        image: '/images/microplastic-2000s.png',
        color: 'from-teal-500 to-green-500',
    },
    {
        year: 'Today',
        title: 'The Internal Invasion',
        description: 'Microplastics are no longer just in the ocean. They have been detected in human blood, lungs, placentas, and breast milk. We are breathing and eating plastic every day.',
        image: '/images/microplastic-today.png',
        color: 'from-red-500 to-orange-500',
    },
];

const researchPapers = [
    {
        title: 'Microplastics in the Marine Environment',
        source: 'Marine Pollution Bulletin',
        link: 'https://doi.org/10.1016/j.marpolbul.2011.02.030',
        color: 'group-hover:text-blue-500',
    },
    {
        title: 'Plasticenta: First evidence of microplastics in human placenta',
        source: 'Environment International',
        link: 'https://doi.org/10.1016/j.envint.2020.106274',
        color: 'group-hover:text-red-500',
    },
    {
        title: 'Discovery and quantification of plastic particle pollution in human blood',
        source: 'Environment International',
        link: 'https://doi.org/10.1016/j.envint.2022.107199',
        color: 'group-hover:text-amber-500',
    },
    {
        title: 'Atmospheric transport and deposition of microplastics',
        source: 'Nature Geoscience',
        link: 'https://www.nature.com/articles/s41561-019-0335-5',
        color: 'group-hover:text-green-500',
    },
];

const dataStats = [
    { value: '5g', label: 'Plastic ingested weekly per person (Credit Card)', color: 'text-red-500' },
    { value: '83%', label: 'Tap water samples containing microplastics', color: 'text-blue-500' },
    { value: '100%', label: 'Marine turtle species tested with plastic in gut', color: 'text-green-500' },
];

export function MicroplasticBody() {
    return (
        <section className="relative bg-background py-20 overflow-hidden">
            {/* Header */}
            <div className="container mx-auto px-4 mb-20 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold mb-6"
                >
                    <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                        The Silent Invasion
                    </span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-xl text-muted-foreground max-w-3xl mx-auto"
                >
                    From a miracle material to a global health crisis. Tracing the path of plastic into our ecosystem and our bodies.
                </motion.p>
            </div>

            {/* Timeline Section */}
            <div className="container mx-auto px-4 mb-32 relative">
                {/* Connecting Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 via-teal-300 to-red-300 hidden md:block" />

                <div className="space-y-24 md:space-y-32">
                    {timelineEvents.map((event, index) => (
                        <motion.div
                            key={event.year}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Image Side */}
                            <div className="w-full md:w-1/2 flex justify-center">
                                <div className="relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-background/50 group">
                                    <div className={`absolute inset-0 bg-gradient-to-tr ${event.color} opacity-20 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0`} />
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                            </div>

                            {/* Text Side */}
                            <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 relative">
                                {/* Dot on Line */}
                                <div className={`hidden md:block absolute top-1/2 ${index % 2 === 0 ? '-left-[44px]' : '-right-[44px]'} w-6 h-6 rounded-full bg-background border-4 border-primary z-20`} />

                                <span className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br ${event.color} opacity-20 absolute -top-10 md:-top-16 left-6 md:left-12 select-none`}>
                                    {event.year}
                                </span>
                                <h3 className={`text-3xl font-bold mb-4 bg-gradient-to-r ${event.color} bg-clip-text text-transparent`}>
                                    {event.title}
                                </h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {event.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Stats & Research Section */}
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border flex flex-col justify-between"
                    >
                        <div>
                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <BarChart3 className="w-8 h-8 text-primary" />
                                The Numbers
                            </h3>
                            <div className="space-y-8">
                                {dataStats.map((stat) => (
                                    <div key={stat.label} className="flex items-center gap-6">
                                        <span className={`text-4xl font-black ${stat.color} min-w-[100px]`}>
                                            {stat.value}
                                        </span>
                                        <span className="text-lg text-muted-foreground font-medium">
                                            {stat.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Simple Bar Chart Visual - Fixed Alignment */}
                        <div className="mt-12 w-full">
                            <div className="flex justify-between text-sm text-muted-foreground mb-2 px-1">
                                <span>1950</span>
                                <span>Global Plastic Production</span>
                                <span>2024</span>
                            </div>
                            <div className="h-40 flex items-end gap-1.5 w-full">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${Math.pow(i, 1.8) / 400 * 100}%` }} // Adjusted calc for less overflow
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: i * 0.05 }}
                                        className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-300 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                                        style={{ minHeight: '4px' }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Research Papers */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border hover:shadow-lg transition-shadow duration-500"
                    >
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <Microscope className="w-8 h-8 text-purple-500" />
                            Research & Evidence
                        </h3>
                        <div className="space-y-4">
                            {researchPapers.map((paper, i) => (
                                <a
                                    key={i}
                                    href={paper.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-4 rounded-xl bg-background/80 border border-border/50 hover:border-primary/50 hover:shadow-md transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">
                                            <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className={`font-semibold text-foreground transition-colors mb-1 ${paper.color}`}>
                                                {paper.title}
                                            </h4>
                                            <p className="text-sm text-muted-foreground italic">
                                                {paper.source}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                        {/* Removed Note Section as requested */}
                        <div className="mt-8 flex justify-center">
                            <a href="https://scholar.google.com/scholar?q=microplastics+health+effects" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                View more research on Google Scholar
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}


