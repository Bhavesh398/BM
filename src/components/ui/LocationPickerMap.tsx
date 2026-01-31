'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

// Fix for default marker icon in Leaflet with Next.js
const icon = L.icon({
    iconUrl: '/images/leaflet/marker-icon.png',
    shadowUrl: '/images/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Helper component to handle click events
function LocationMarker({
    position,
    setPosition
}: {
    position: { lat: number; lng: number } | null,
    setPosition: (pos: { lat: number; lng: number }) => void
}) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={icon} />
    );
}

interface LocationPickerMapProps {
    initialLocation?: { lat: number; lng: number } | null;
    onLocationSelect: (location: { lat: number; lng: number }) => void;
    onClose: () => void;
}

export default function LocationPickerMap({
    initialLocation,
    onLocationSelect,
    onClose
}: LocationPickerMapProps) {
    // Default to India coordinates if no initial location
    const defaultCenter = initialLocation || { lat: 20.5937, lng: 78.9629 };
    const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(initialLocation || null);

    // Patch for missing marker icons - usually needed for Leaflet in Webpack/Next.js
    useEffect(() => {
        // We'll rely on the custom icon definition above to avoid 404s for default assets
    }, []);

    const handleConfirm = () => {
        if (selectedPos) {
            onLocationSelect(selectedPos);
            onClose();
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-background rounded-xl overflow-hidden border border-border">
            <div className="relative flex-1 min-h-[200px]">
                <MapContainer
                    center={defaultCenter}
                    zoom={5}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%', zIndex: 1 }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={selectedPos} setPosition={setSelectedPos} />
                </MapContainer>

                {/* Instructions Overlay */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur px-4 py-2 rounded-full shadow-lg z-[1000] text-sm font-medium border border-border pointer-events-none">
                    Click anywhere on the map to pin location
                </div>
            </div>

            <div className="p-4 flex justify-between items-center bg-muted/20 border-t border-border">
                <div className="text-sm">
                    {selectedPos ? (
                        <span className="font-mono text-primary">
                            {selectedPos.lat.toFixed(6)}, {selectedPos.lng.toFixed(6)}
                        </span>
                    ) : (
                        <span className="text-muted-foreground italic">No location selected</span>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={!selectedPos}>
                        <Check className="w-4 h-4 mr-2" />
                        Confirm Location
                    </Button>
                </div>
            </div>
        </div>
    );
}
