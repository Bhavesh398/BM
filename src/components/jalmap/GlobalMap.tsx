'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/lib/supabaseClient';
import TierMarker from './TierMarker';
import TierFilterPanel from './TierFilterPanel';
import ReportDetailModal, { WaterReport } from './ReportDetailModal';
import { Loader2 } from 'lucide-react';

// Default map center (world view)
const DEFAULT_CENTER: [number, number] = [20.0, 0.0];
const INDIA_CENTER: [number, number] = [20.5937, 78.9629];
const DEFAULT_ZOOM = 2;
const INDIA_ZOOM = 5;

// Helper component to fly to a location on mount
function FlyToLocation({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, zoom, { duration: 2 });
    }, [map, center, zoom]);

    return null;
}

/**
 * GlobalMap - Full-screen interactive world map showing public water reports
 * Features:
 * - Fetches public reports from Supabase
 * - Color-coded tier markers with pulsing Tier 5
 * - Tier filtering controls
 * - Click to open detailed report modal
 */
export default function GlobalMap() {
    // Reports data
    const [reports, setReports] = useState<WaterReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter state - all tiers visible by default
    const [activeFilters, setActiveFilters] = useState<Set<number>>(new Set([1, 2, 3, 4, 5]));

    // Selected report for modal
    const [selectedReport, setSelectedReport] = useState<WaterReport | null>(null);

    // Fly to India on mount (as per PRD)
    const [flyToIndia, setFlyToIndia] = useState(false);

    // Fetch public reports from Supabase
    const fetchReports = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch all public reports with lat/lng extracted from PostGIS geography
            // Using ST_Y (latitude) and ST_X (longitude) to extract coordinates from WKB
            const { data, error: fetchError } = await supabase
                .from('water_reports')
                .select(`
                    id,
                    created_at,
                    ph_level,
                    turbidity,
                    dissolved_oxygen,
                    conductivity,
                    bacteria_load,
                    metal_concentration,
                    calculated_tier,
                    notes,
                    is_public,
                    location
                `)
                .eq('is_public', true)
                .not('location', 'is', null)
                .order('created_at', { ascending: false });

            if (fetchError) {
                throw fetchError;
            }

            console.log('Raw data from Supabase:', data);

            if (data && data.length > 0) {
                // Since we can't use ST_X/ST_Y in select directly without RPC,
                // we need to call an RPC function or parse the location differently
                // Let's try calling RPC to get proper coordinates

                const { data: reportsWithCoords, error: rpcError } = await supabase
                    .rpc('get_public_water_reports')
                    .select('*');

                if (rpcError) {
                    // Fallback: Try to parse what we have - log the actual format
                    console.log('RPC not available, attempting to parse location format:', data[0]?.location);

                    // Try alternative approach - maybe location is returned as GeoJSON by default
                    const parsedReports: WaterReport[] = data
                        .filter(report => report.location)
                        .map(report => {
                            let lat = 0, lng = 0;
                            const loc = report.location;

                            console.log('Processing location:', typeof loc, loc);

                            // Handle GeoJSON format (Supabase may return this)
                            if (typeof loc === 'object' && loc !== null) {
                                if ('coordinates' in loc && Array.isArray(loc.coordinates)) {
                                    // GeoJSON Point: { type: "Point", coordinates: [lng, lat] }
                                    [lng, lat] = loc.coordinates;
                                } else if ('lat' in loc && 'lng' in loc) {
                                    lat = loc.lat;
                                    lng = loc.lng;
                                } else if ('latitude' in loc && 'longitude' in loc) {
                                    lat = loc.latitude;
                                    lng = loc.longitude;
                                }
                            } else if (typeof loc === 'string') {
                                // WKT format: "POINT(lng lat)" or "SRID=4326;POINT(lng lat)"
                                const match = loc.match(/POINT\s*\(\s*([^\s]+)\s+([^\s)]+)\s*\)/i);
                                if (match) {
                                    lng = parseFloat(match[1]);
                                    lat = parseFloat(match[2]);
                                }
                            }

                            return {
                                id: report.id,
                                created_at: report.created_at,
                                ph_level: report.ph_level,
                                turbidity: report.turbidity,
                                dissolved_oxygen: report.dissolved_oxygen,
                                conductivity: report.conductivity,
                                bacteria_load: report.bacteria_load,
                                metal_concentration: report.metal_concentration,
                                calculated_tier: report.calculated_tier as 1 | 2 | 3 | 4 | 5,
                                notes: report.notes,
                                location: { lat, lng }
                            };
                        })
                        .filter(report => report.location.lat !== 0 || report.location.lng !== 0);

                    console.log('Parsed reports:', parsedReports);
                    setReports(parsedReports);
                } else if (reportsWithCoords) {
                    // RPC succeeded - use coordinates directly
                    const parsedReports: WaterReport[] = reportsWithCoords.map((report: any) => ({
                        id: report.id,
                        created_at: report.created_at,
                        ph_level: report.ph_level,
                        turbidity: report.turbidity,
                        dissolved_oxygen: report.dissolved_oxygen,
                        conductivity: report.conductivity,
                        bacteria_load: report.bacteria_load,
                        metal_concentration: report.metal_concentration,
                        calculated_tier: report.calculated_tier as 1 | 2 | 3 | 4 | 5,
                        notes: report.notes,
                        location: { lat: report.lat, lng: report.lng }
                    }));
                    setReports(parsedReports);
                }
            } else {
                setReports([]);
            }
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError(err instanceof Error ? err.message : 'Failed to load reports');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch and detect India
    useEffect(() => {
        fetchReports();

        // Try to detect if user is in India via timezone
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (timezone.includes('Kolkata') || timezone.includes('India')) {
                setFlyToIndia(true);
            }
        } catch {
            // Ignore timezone detection errors
        }
    }, [fetchReports]);

    // Handle tier filter toggle
    const handleFilterChange = (tier: number, enabled: boolean) => {
        setActiveFilters(prev => {
            const newFilters = new Set(prev);
            if (enabled) {
                newFilters.add(tier);
            } else {
                newFilters.delete(tier);
            }
            return newFilters;
        });
    };

    // Filter reports based on active tiers
    const filteredReports = reports.filter(report => activeFilters.has(report.calculated_tier));

    return (
        <div className="relative w-full h-full">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-[1000] bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-muted-foreground font-medium">Loading water reports...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-lg">
                    {error}
                </div>
            )}

            {/* Map Container */}
            <MapContainer
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Fly to India if detected */}
                {flyToIndia && <FlyToLocation center={INDIA_CENTER} zoom={INDIA_ZOOM} />}

                {/* Render tier markers */}
                {filteredReports.map((report, index) => (
                    <TierMarker
                        key={report.id}
                        position={[report.location.lat, report.location.lng]}
                        tier={report.calculated_tier}
                        // Higher z-index for newer reports (lower index)
                        // This ensures the most recent report is clickable when markers overlap
                        zIndexOffset={2000 - index}
                        onClick={() => setSelectedReport(report)}
                    />
                ))}
            </MapContainer>

            {/* Filter Panel */}
            <TierFilterPanel
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                forceCollapsed={!!selectedReport}
            />

            {/* Report Count Badge */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-background/80 backdrop-blur-lg px-4 py-2 rounded-xl border border-border shadow-lg">
                <span className="text-sm font-medium">
                    Showing <span className="text-primary font-bold">{filteredReports.length}</span> of{' '}
                    <span className="font-bold">{reports.length}</span> reports
                </span>
            </div>

            {/* Report Detail Modal */}
            <ReportDetailModal
                report={selectedReport}
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
            />
        </div>
    );
}
