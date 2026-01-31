'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '@/components/Navigation';
import { Globe, MapPin } from 'lucide-react';

// Dynamically import the GlobalMap component to avoid SSR issues with Leaflet
const GlobalMap = dynamic(() => import('@/components/jalmap/GlobalMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-background">
            <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-pulse" />
                <div className="absolute inset-0 w-24 h-24 rounded-full border-t-4 border-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Globe className="w-10 h-10 text-primary" />
                </div>
            </div>
            <p className="mt-4 text-muted-foreground font-medium">Initializing JalMap...</p>
        </div>
    ),
});

/**
 * JalMap Page - Global Intelligence Map
 * Displays all public water quality reports on an interactive world map
 */
export default function MapPage() {
    return (
        <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
            {/* Navigation Header */}
            <Navigation />

            {/* Page Header */}
            <div className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-primary/10 via-background to-primary/5 border-b border-border">
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                            <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-foreground">JalMap</h1>
                            <p className="text-xs text-muted-foreground">Global Water Intelligence</p>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                        Click any marker to view detailed analysis
                    </div>
                </div>
            </div>

            {/* Full-screen Map Container */}
            <div className="flex-1 relative">
                <GlobalMap />
            </div>
        </div>
    );
}
