'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LayoutGrid, Microscope, Map as MapIcon } from 'lucide-react';

const NavLink = ({
    href,
    icon: Icon,
    children,
    isActive
}: {
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
    isActive: boolean;
}) => (
    <Link
        href={href}
        className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 group relative",
            isActive
                ? "text-blue-900 bg-blue-50"
                : "text-zinc-500 hover:text-blue-900 hover:bg-zinc-100"
        )}
    >
        <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive && "text-blue-400")} />
        <span className="text-sm font-medium">{children}</span>

        {isActive && (
            <motion.div
                layoutId="activeNavIndicator"
                className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
        )}
    </Link>
);

export default function Navigation() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 800); // 800ms delay before hiding
    };

    const routes = [
        { name: 'JalGyan', path: '/', icon: LayoutGrid },
        { name: 'JalScan', path: '/analyze', icon: Microscope },
        { name: 'JalMap', path: '/map', icon: MapIcon },
    ];

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center pointer-events-none"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Trigger Area - Invisible strip */}
            <div className="absolute top-0 left-0 right-0 h-6 pointer-events-auto z-[101]" />

            {/* Full Width Navigation Bar */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: '-100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '-100%' }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            mass: 0.8
                        }}
                        className="pointer-events-auto w-full bg-white/95 backdrop-blur-xl border-b border-zinc-200 shadow-sm"
                    >
                        <nav className="container mx-auto px-6 h-20 flex items-center justify-between font-swiss">
                            {/* Logo Section */}
                            <div className="flex items-center gap-4">
                                <div className="relative w-32 h-12">
                                    <Image
                                        src="/cyanlogo.svg"
                                        alt="BlueMonitor"
                                        fill
                                        className="object-contain object-left"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Links Section */}
                            <div className="flex items-center gap-6">
                                {routes.map((route) => (
                                    <NavLink
                                        key={route.path}
                                        href={route.path}
                                        icon={route.icon}
                                        isActive={pathname === route.path}
                                    >
                                        {route.name}
                                    </NavLink>
                                ))}
                            </div>

                            {/* Right Action (Optional - e.g. Profile or Clock) */}
                            <div className="w-10 h-10 rounded-full bg-blue-50/50 flex items-center justify-center text-xs font-mono text-blue-900 border border-blue-100 shadow-inner">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse box-content border-2 border-white" />
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
