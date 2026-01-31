// Type definitions for BlueMonitor

// Water Report Types
export interface WaterReport {
    id: string;
    created_at: string;
    user_id: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [lng, lat]
    };
    ph_level: number;
    turbidity: number;
    dissolved_oxygen: number;
    conductivity: number;
    bacteria_load: number;
    metal_concentration: number;
    calculated_tier: 1 | 2 | 3 | 4 | 5;
    is_public: boolean;
    notes: string | null;
}

// User Profile Types
export type UserRole = 'citizen' | 'ngo' | 'government';

export interface UserProfile {
    id: string;
    organization_name: string | null;
    is_verified: boolean;
    role: UserRole;
}

// Supabase Database Types
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: UserProfile;
                Insert: Omit<UserProfile, 'id'> & { id: string };
                Update: Partial<UserProfile>;
            };
            water_reports: {
                Row: WaterReport;
                Insert: Omit<WaterReport, 'id' | 'created_at'> & {
                    location: string; // PostGIS POINT format: 'POINT(lng lat)'
                };
                Update: Partial<Omit<WaterReport, 'id' | 'created_at'>>;
            };
        };
    };
}

// Map Types
export interface MapMarker {
    id: string;
    position: [number, number]; // [lat, lng] for Leaflet
    tier: 1 | 2 | 3 | 4 | 5;
    report: WaterReport;
}

// Filter Types
export interface MapFilters {
    tiers: number[];
    contaminant?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
}
