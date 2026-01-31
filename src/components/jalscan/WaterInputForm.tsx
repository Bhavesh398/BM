'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import {
    Radio,
    FlaskConical,
    MapPin,
    Microscope,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Banknote,
    Droplets,
    Globe,
    Lock,
    X,
    Activity,
    TrendingUp,
    Shield,
    Info
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import {
    WaterParameters,
    TierClassification,
    UpgradePath,
    calculateWaterTier,
    generateUpgradePath,
    generateSimulatedData,
    getTierBadgeClass,
} from '@/lib/water-logic';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Map as MapIcon } from 'lucide-react';
import WaterTreatmentDetailModal from './WaterTreatmentDetailModal';

const LocationPickerMap = dynamic(() => import('@/components/ui/LocationPickerMap'), {

    ssr: false,
    loading: () => (
        <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 animate-pulse rounded-xl">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span>Loading Map...</span>
            </div>
        </div>
    ),
});

// Parameter configuration for sliders
const PARAMETER_CONFIG = {
    phLevel: {
        label: 'pH Level',
        description: 'Acidity/Alkalinity (0-14 scale)',
        min: 0,
        max: 14,
        step: 0.1,
        unit: 'pH',
        optimal: '6.5 - 8.5',
        icon: FlaskConical,
    },
    turbidity: {
        label: 'Turbidity',
        description: 'Water clarity measurement',
        min: 0,
        max: 200,
        step: 1,
        unit: 'NTU',
        optimal: '< 1 NTU',
        icon: Droplets,
    },
    dissolvedOxygen: {
        label: 'Dissolved Oxygen',
        description: 'Oxygen content in water',
        min: 0,
        max: 20,
        step: 0.1,
        unit: 'mg/L',
        optimal: '> 8 mg/L',
        icon: Droplets,
    },
    conductivity: {
        label: 'Conductivity',
        description: 'Electrical conductance',
        min: 0,
        max: 6000,
        step: 10,
        unit: 'µS/cm',
        optimal: '< 500 µS/cm',
        icon: Droplets,
    },
    bacteriaLoad: {
        label: 'Bacteria Load',
        description: 'Coliform bacteria count',
        min: 0,
        max: 10000,
        step: 10,
        unit: 'CFU/100mL',
        optimal: '0 CFU/100mL',
        icon: Microscope,
    },
    metalConcentration: {
        label: 'Heavy Metals',
        description: 'Toxic metal concentration',
        min: 0,
        max: 10,
        step: 0.1,
        unit: 'mg/L',
        optimal: '< 0.1 mg/L',
        icon: AlertTriangle,
    },
};

interface WaterInputFormProps {
    onReportGenerated?: (result: {
        classification: TierClassification;
        upgradePath: UpgradePath;
        params: WaterParameters;
    }) => void;
}

export default function WaterInputForm({ onReportGenerated }: WaterInputFormProps) {
    // Form state
    const [params, setParams] = useState<WaterParameters>({
        phLevel: 7.0,
        turbidity: 5,
        dissolvedOxygen: 8,
        conductivity: 500,
        bacteriaLoad: 100,
        metalConcentration: 0.2,
    });

    // Location state
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [showMap, setShowMap] = useState(false);
    const [isPublic, setIsPublic] = useState(true);
    const [notes, setNotes] = useState('');

    // UI state
    const [isLoadingTelemetry, setIsLoadingTelemetry] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{
        classification: TierClassification;
        upgradePath: UpgradePath;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);

    // Handle parameter change
    const handleParamChange = (key: keyof WaterParameters, value: number) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    // Simulate fetching telemetry data
    const handleFetchTelemetry = async () => {
        setIsLoadingTelemetry(true);
        setError(null);
        setResult(null);

        // Simulate IoT delay
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        const simulatedData = generateSimulatedData();
        setParams(simulatedData);
        setIsLoadingTelemetry(false);
    };

    // Get current location
    const handleGetLocation = () => {
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (err) => {
                setLocationError(`Unable to get location: ${err.message}`);
            },
            { enableHighAccuracy: true }
        );
    };

    // Analyze water quality
    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysisProgress(0);
        setResult(null);

        // Simulate complex analysis steps
        const steps = [
            "Calibrating sensors...",
            "Normalizing pH data...",
            "Checking turbidity levels...",
            "Scanning for pathogens...",
            "Calculating conductivity...",
            "Finalizing report..."
        ];

        for (let i = 0; i <= 100; i += 2) {
            setAnalysisProgress(i);
            // Non-linear delay for realism
            const delay = i < 80 ? 30 : 50;
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        const classification = calculateWaterTier(params);
        const upgradePath = generateUpgradePath(params, classification);

        await new Promise(resolve => setTimeout(resolve, 500)); // Final buffer

        setResult({ classification, upgradePath });
        setIsAnalyzing(false);

        if (onReportGenerated) {
            onReportGenerated({ classification, upgradePath, params });
        }
    };

    // Submit to Supabase
    const handleSubmit = async () => {
        if (!result) return;

        if (isPublic && !location) {
            setError('Public reports require a location tag. Please capture your location.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error('You must be logged in to submit a report');
            }

            // Insert water report
            const { error: insertError } = await supabase
                .from('water_reports')
                .insert({
                    user_id: user.id,
                    location: location ? `POINT(${location.lng} ${location.lat})` : null, // PostGIS format
                    ph_level: params.phLevel,
                    turbidity: params.turbidity,
                    dissolved_oxygen: params.dissolvedOxygen,
                    conductivity: params.conductivity,
                    bacteria_load: params.bacteriaLoad,
                    metal_concentration: params.metalConcentration,
                    calculated_tier: result.classification.tier,
                    is_public: isPublic,
                    notes: notes || null,
                });

            if (insertError) {
                throw insertError;
            }

            // Success
            alert('Water report submitted successfully!');
            setResult(null); // Close report

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit report');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* IoT Telemetry Section */}
            <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10">
                                <Radio className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">IoT Telemetry Link</CardTitle>
                                <CardDescription>
                                    Connect to Proteus sensor for real-time data
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isLoadingTelemetry ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                            <span className="text-xs text-muted-foreground">
                                {isLoadingTelemetry ? 'Syncing...' : 'Ready'}
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative w-32 h-40 flex-shrink-0">
                            <Image
                                src="/images/proteus-sensor.png"
                                alt="Proteus Sensor"
                                fill
                                className="object-contain"
                            />
                            {isLoadingTelemetry && (
                                <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <p className="text-sm text-muted-foreground mb-4">
                                Click to fetch the latest water quality readings from your connected IoT sensor.
                                This will auto-populate all parameter fields.
                            </p>
                            <Button
                                onClick={handleFetchTelemetry}
                                disabled={isLoadingTelemetry}
                                className="w-full sm:w-auto"
                            >
                                {isLoadingTelemetry ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Fetching Data...
                                    </>
                                ) : (
                                    <>
                                        <Radio className="w-4 h-4 mr-2" />
                                        Sync Telemetry
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Parameter Input Grid */}
            <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-primary" />
                    Water Quality Parameters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(Object.keys(PARAMETER_CONFIG) as (keyof WaterParameters)[]).map((key) => {
                        const config = PARAMETER_CONFIG[key];
                        const Icon = config.icon;
                        const value = params[key];

                        return (
                            <Card key={key} className="overflow-hidden">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4 text-primary" />
                                            <CardTitle className="text-sm">{config.label}</CardTitle>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {value.toFixed(config.step < 1 ? 1 : 0)} {config.unit}
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-xs">
                                        {config.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <Slider
                                        value={[value]}
                                        onValueChange={(val) => handleParamChange(key, val[0])}
                                        min={config.min}
                                        max={config.max}
                                        step={config.step}
                                        className="mb-2"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{config.min}</span>
                                        <span className="text-primary">Optimal: {config.optimal}</span>
                                        <span>{config.max}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Generate Report Button */}
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
                                <Microscope className="w-5 h-5 text-primary" />
                                Ready to Analyze
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Generate a comprehensive water quality report based on your parameters
                            </p>
                        </div>
                        <Button
                            onClick={handleAnalyze}
                            size="lg"
                            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                        >
                            <Microscope className="w-4 h-4 mr-2" />
                            Generate Report
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Analyzing Overlay */}
            <AnimatePresence>
                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
                    >
                        <div className="w-full max-w-md space-y-8 text-center">
                            <div className="relative w-32 h-32 mx-auto">
                                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
                                <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Microscope className="w-12 h-12 text-primary animate-bounce" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold animate-pulse">
                                    Analyzing Water Quality...
                                </h3>

                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${analysisProgress}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground font-mono">
                                    {analysisProgress < 30 && "Calibrating sensors..."}
                                    {analysisProgress >= 30 && analysisProgress < 60 && "Processing parameters..."}
                                    {analysisProgress >= 60 && analysisProgress < 90 && "Comparing against standards..."}
                                    {analysisProgress >= 90 && "Finalizing report..."}
                                    <span className="ml-2">{analysisProgress}%</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Result Modal */}
            <AnimatePresence>
                {result && !isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
                    >
                        <div className="min-h-screen p-4 md:p-8 flex items-start justify-center">
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                className="w-full max-w-4xl bg-card rounded-[2rem] shadow-2xl border border-border overflow-hidden"
                            >
                                {/* Header with Tier Image Background */}
                                <div className="relative h-64 md:h-80 w-full overflow-hidden">
                                    <Image
                                        src={`/images/tier_${result.classification.tier}_${result.classification.tier === 1 ? 'pure' :
                                            result.classification.tier === 2 ? 'household' :
                                                result.classification.tier === 3 ? 'conditioned' :
                                                    result.classification.tier === 4 ? 'industrial' : 'biohazard'
                                            }.png`}
                                        alt={`Tier ${result.classification.tier}`}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            // Fallback if specific file naming fails, though we know the names
                                            console.error("Image load error", e);
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="absolute right-6 top-6 rounded-full shadow-lg z-10 hover:bg-destructive hover:text-white transition-colors"
                                        onClick={() => setResult(null)}
                                    >
                                        <X className="w-6 h-6" />
                                    </Button>

                                    <div className="absolute bottom-0 left-0 p-8 w-full">
                                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                            <div>
                                                <Badge className={`mb-4 text-lg px-4 py-1 ${getTierBadgeClass(result.classification.tier)}`}>
                                                    TIER {result.classification.tier} DETECTED
                                                </Badge>
                                                <h2 className="text-4xl md:text-5xl font-black text-foreground mb-2">
                                                    {result.classification.classification}
                                                </h2>
                                                <p className="text-lg text-muted-foreground max-w-xl text-shadow-sm">
                                                    {result.classification.definition}
                                                </p>
                                            </div>

                                            <div className="text-right hidden md:block">
                                                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Limiting Factor</div>
                                                <div className="text-xl font-bold text-destructive flex items-center justify-end gap-2">
                                                    <AlertTriangle className="w-5 h-5" />
                                                    {result.classification.limitingFactor}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 md:p-10 space-y-12">

                                    {/* 1. Visual Analysis (Charts) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Activity className="w-6 h-6 text-primary" />
                                                <h3 className="text-xl font-bold">Parameter Analysis</h3>
                                            </div>

                                            <div className="h-[300px] w-full bg-muted/30 rounded-3xl p-4 border border-border">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                                        { subject: 'pH', A: (6 - (result.classification.parameterScores['phLevel'] || 1)) * 20, fullMark: 100 },
                                                        { subject: 'Turbidity', A: (6 - (result.classification.parameterScores['turbidity'] || 1)) * 20, fullMark: 100 },
                                                        { subject: 'Oxygen', A: (6 - (result.classification.parameterScores['dissolvedOxygen'] || 1)) * 20, fullMark: 100 },
                                                        { subject: 'Cond.', A: (6 - (result.classification.parameterScores['conductivity'] || 1)) * 20, fullMark: 100 },
                                                        { subject: 'Bacteria', A: (6 - (result.classification.parameterScores['bacteriaLoad'] || 1)) * 20, fullMark: 100 },
                                                        { subject: 'Metals', A: (6 - (result.classification.parameterScores['metalConcentration'] || 1)) * 20, fullMark: 100 },
                                                    ]}>
                                                        <PolarGrid gridType="circle" />
                                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#888888', fontSize: 12 }} />
                                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                        <Radar
                                                            name="Quality Score"
                                                            dataKey="A"
                                                            stroke="#3b82f6"
                                                            fill="#3b82f6"
                                                            fillOpacity={0.4}
                                                        />
                                                        <Tooltip
                                                            formatter={(value) => [`${value}% Safe`, 'Quality']}
                                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                                        />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <p className="text-xs text-center text-muted-foreground">
                                                *Map shows quality score (100% = Tier 1, 0% = Tier 5)
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Shield className="w-6 h-6 text-green-500" />
                                                <h3 className="text-xl font-bold">Usage Permissions</h3>
                                            </div>
                                            <div className="bg-green-500/5 p-6 rounded-[2rem] border border-green-500/20">
                                                <p className="text-lg font-medium text-foreground leading-relaxed">
                                                    {result.classification.usagePermissions}
                                                </p>
                                                <div className="mt-6 flex flex-wrap gap-2">
                                                    {result.classification.tier <= 2 ? (
                                                        <>
                                                            <Badge className="bg-green-500 hover:bg-green-600">Safe for Consumption</Badge>
                                                            <Badge variant="outline" className="border-green-500 text-green-500">Agriculture</Badge>
                                                            <Badge variant="outline" className="border-green-500 text-green-500">Domestic</Badge>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Badge variant="destructive">Unsafe for Drinking</Badge>
                                                            <Badge variant="secondary">Treatment Required</Badge>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Location Picker Moved Here */}
                                            <div className="bg-muted/10 p-6 rounded-[2rem] border border-border mt-6">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-primary" />
                                                            <span className="text-sm font-medium">Report Location</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={handleGetLocation}
                                                            >
                                                                <MapPin className="w-3 h-3 mr-1" />
                                                                Auto
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setShowMap(!showMap)}
                                                            >
                                                                <MapIcon className="w-3 h-3 mr-1" />
                                                                {showMap ? 'Hide Map' : 'Select on Map'}
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Map Picker UI */}
                                                    <AnimatePresence>
                                                        {showMap && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="h-[450px] w-full rounded-xl overflow-hidden border border-border shadow-inner">
                                                                    <LocationPickerMap
                                                                        initialLocation={location}
                                                                        onLocationSelect={(loc) => {
                                                                            console.log('Location selected:', loc);
                                                                            setLocation(loc);
                                                                        }}
                                                                        onClose={() => setShowMap(false)}
                                                                    />
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    {location ? (
                                                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                                                            <span className="text-sm text-muted-foreground">Selected:</span>
                                                            <Badge variant="outline" className="text-green-600 bg-green-500/10 border-green-500/20">
                                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                                            </Badge>
                                                        </div>
                                                    ) : (
                                                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                                            <p className="text-xs text-yellow-600 flex items-center gap-2">
                                                                <AlertTriangle className="w-3 h-3" />
                                                                Location required for public reports.
                                                            </p>
                                                        </div>
                                                    )}

                                                    {locationError && (
                                                        <p className="text-xs text-red-400">{locationError}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Timeline Improvement Plan */}
                                    {result.upgradePath.steps.length > 0 && (
                                        <div className="border-t border-border pt-10">
                                            <div className="flex items-center gap-3 mb-8">
                                                <TrendingUp className="w-6 h-6 text-blue-500" />
                                                <h3 className="text-xl font-bold">Treatment Timeline</h3>
                                            </div>

                                            <div className="relative pl-8 border-l-2 border-muted space-y-12">
                                                {result.upgradePath.steps.map((step, idx) => (
                                                    <div key={idx} className="relative">
                                                        {/* Timeline Dot */}
                                                        <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-background border-4 border-blue-500" />

                                                        <div
                                                            className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-muted/20 p-6 rounded-2xl hover:bg-muted/40 transition-colors cursor-pointer group hover:border-primary/20 border border-transparent"
                                                            onClick={() => setSelectedTreatment(step.method)}
                                                        >
                                                            <div className="w-full">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <Badge className="bg-blue-500">Step {idx + 1}</Badge>
                                                                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                                                                        {step.method}
                                                                        <Info className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                                                                    </h4>
                                                                </div>
                                                                <p className="text-muted-foreground mb-4 max-w-2xl">
                                                                    {step.description}
                                                                </p>
                                                            </div>

                                                            <div className="flex flex-col gap-2 min-w-[150px]">
                                                                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                                    Achieves Tier {step.achievableTier}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                    <Banknote className="w-3 h-3" /> Cost: ₹{step.estimatedCostPer1000L}/kL
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                    <Clock className="w-3 h-3" /> Time: {step.timeRequired}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Final Goal */}
                                                <div className="relative">
                                                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-green-500 border-4 border-background shadow-sm" />
                                                    <div className="text-green-500 font-bold text-sm uppercase tracking-widest pt-1">
                                                        Optimized State (Tier {result.upgradePath.finalAchievableTier})
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer Actions */}
                                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting || (isPublic && !location)}
                                            size="lg"
                                            className="flex-1 h-14 text-lg rounded-2xl"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Transmitting Report...
                                                </>
                                            ) : (
                                                <>
                                                    <Globe className="w-5 h-5 mr-2" />
                                                    Publish to Global Map
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="flex-1 h-14 text-lg rounded-2xl"
                                            onClick={() => window.print()}
                                        >
                                            Download PDF
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Treatment Detail Modal */}
            <WaterTreatmentDetailModal
                isOpen={!!selectedTreatment}
                onClose={() => setSelectedTreatment(null)}
                methodName={selectedTreatment || ''}
            />
        </div>
    );
}
