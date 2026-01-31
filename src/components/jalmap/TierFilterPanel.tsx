'use client';

import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTierColor } from '@/lib/water-logic';

interface TierFilterPanelProps {
    activeFilters: Set<number>;
    onFilterChange: (tier: number, enabled: boolean) => void;
    /** When true, force the panel to be collapsed (e.g., when a modal is open) */
    forceCollapsed?: boolean;
}

// Tier configuration for display
const TIER_CONFIG = [
    { tier: 1, label: 'Pure/Potable', shortLabel: 'Tier 1' },
    { tier: 2, label: 'Household-Usable', shortLabel: 'Tier 2' },
    { tier: 3, label: 'Conditioned-Ready', shortLabel: 'Tier 3' },
    { tier: 4, label: 'Industrial-Grade', shortLabel: 'Tier 4' },
    { tier: 5, label: 'Biohazard', shortLabel: 'Tier 5' },
];

/**
 * TierFilterPanel - Floating control panel to filter markers by tier
 * Features:
 * - Glassmorphism styling
 * - Toggle switches for each tier
 * - Color-coded tier indicators
 * - Collapsible on mobile
 */
export default function TierFilterPanel({ activeFilters, onFilterChange, forceCollapsed = false }: TierFilterPanelProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    // Collapse when forceCollapsed becomes true
    useEffect(() => {
        if (forceCollapsed) {
            setIsExpanded(false);
        }
    }, [forceCollapsed]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 right-4 z-[1000]"
        >
            {/* Collapsed State Button */}
            {!isExpanded && (
                <motion.button
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    onClick={() => setIsExpanded(true)}
                    className="p-3 rounded-xl bg-background/80 backdrop-blur-lg border border-border shadow-lg hover:bg-background/90 transition-colors"
                    title="Show Filters"
                >
                    <Filter className="w-5 h-5 text-primary" />
                </motion.button>
            )}

            {/* Expanded Panel */}
            {isExpanded && (
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-background/80 backdrop-blur-lg border border-border rounded-2xl shadow-xl overflow-hidden min-w-[220px]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b border-border/50">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-sm text-foreground">Filter by Tier</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsExpanded(false);
                            }}
                            className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
                            title="Collapse"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Tier Toggles */}
                    <div className="p-3 space-y-2">
                        {TIER_CONFIG.map(({ tier, label, shortLabel }) => {
                            const color = getTierColor(tier);
                            const isActive = activeFilters.has(tier);

                            return (
                                <div
                                    key={tier}
                                    className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        {/* Color indicator */}
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{
                                                backgroundColor: color,
                                                boxShadow: tier === 5 ? `0 0 8px ${color}` : 'none'
                                            }}
                                        />
                                        <Label
                                            htmlFor={`tier-${tier}`}
                                            className="text-sm cursor-pointer select-none"
                                        >
                                            <span className="font-medium">{shortLabel}</span>
                                            <span className="text-muted-foreground text-xs ml-1 hidden sm:inline">
                                                {label}
                                            </span>
                                        </Label>
                                    </div>
                                    <Switch
                                        id={`tier-${tier}`}
                                        checked={isActive}
                                        onCheckedChange={(checked) => onFilterChange(tier, checked)}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <div className="p-3 pt-0 flex gap-2">
                        <button
                            onClick={() => TIER_CONFIG.forEach(({ tier }) => onFilterChange(tier, true))}
                            className="flex-1 text-xs py-1.5 px-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                        >
                            Show All
                        </button>
                        <button
                            onClick={() => TIER_CONFIG.forEach(({ tier }) => onFilterChange(tier, false))}
                            className="flex-1 text-xs py-1.5 px-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-medium"
                        >
                            Hide All
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
