'use client';

import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { getTierColor } from '@/lib/water-logic';

interface TierMarkerProps {
    position: [number, number];
    tier: 1 | 2 | 3 | 4 | 5;
    zIndexOffset?: number;
    onClick?: () => void;
}

// Tier labels for accessibility
const TIER_LABELS: Record<number, string> = {
    1: 'Pure/Potable',
    2: 'Household-Usable',
    3: 'Conditioned-Ready',
    4: 'Industrial-Grade',
    5: 'Biohazard',
};

/**
 * Creates a custom colored marker icon for a given tier
 */
function createTierIcon(tier: number): L.DivIcon {
    // ... existing function implementation ...
    const color = getTierColor(tier);
    const isPulsing = tier === 5;
    const pulseClass = isPulsing ? 'marker-tier-5' : '';

    // SVG marker with drop shadow and tier-specific color
    // Tier 5 gets a red glow, others get a standard shadow
    const filterDef = tier === 5
        ? `<filter id="shadow-${tier}" x="-50%" y="-50%" width="200%" height="200%">
             <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#ef4444" flood-opacity="0.6"/>
           </filter>`
        : `<filter id="shadow-${tier}" x="-20%" y="-20%" width="140%" height="140%">
             <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
           </filter>`;

    const svgIcon = `
        <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
            <defs>
                ${filterDef}
            </defs>
            <path 
                d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26C32 7.163 24.837 0 16 0z" 
                fill="${color}"
                filter="url(#shadow-${tier})"
            />
            <circle cx="16" cy="14" r="6" fill="white" fill-opacity="0.9"/>
            <text x="16" y="18" text-anchor="middle" fill="${color}" font-size="10" font-weight="bold">${tier}</text>
        </svg>
    `;

    return L.divIcon({
        html: `<div class="tier-marker ${pulseClass}" title="${TIER_LABELS[tier]}">${svgIcon}</div>`,
        className: 'custom-tier-marker',
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42],
    });
}

/**
 * TierMarker - A colored map marker based on water quality tier
 * - Tier 5 (Biohazard) markers have a pulsing animation
 * - Click handler opens the full report modal
 */
export default function TierMarker({ position, tier, zIndexOffset, onClick }: TierMarkerProps) {
    const icon = createTierIcon(tier);

    return (
        <Marker
            position={position}
            icon={icon}
            zIndexOffset={zIndexOffset}
            eventHandlers={{
                click: () => onClick?.(),
            }}
        />
    );
}

// Export the icon creator for potential reuse
export { createTierIcon };
