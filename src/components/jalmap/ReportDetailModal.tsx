'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AlertTriangle,
    Activity,
    Shield,
    TrendingUp,
    Banknote,
    Clock,
    CheckCircle2,
    FlaskConical,
    Droplets,
    Microscope,
    MapPin,
    Download,
    ChevronRight
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import {
    WaterParameters,
    calculateWaterTier,
    generateUpgradePath,
    getTierBadgeClass,
    getTierColor,
} from '@/lib/water-logic';
import WaterTreatmentDetailModal from '@/components/jalscan/WaterTreatmentDetailModal';

// Type for the water report from Supabase
export interface WaterReport {
    id: string;
    created_at: string;
    ph_level: number;
    turbidity: number;
    dissolved_oxygen: number;
    conductivity: number;
    bacteria_load: number;
    metal_concentration: number;
    calculated_tier: 1 | 2 | 3 | 4 | 5;
    notes: string | null;
    location: {
        lat: number;
        lng: number;
    };
}

interface ReportDetailModalProps {
    report: WaterReport | null;
    isOpen: boolean;
    onClose: () => void;
}

// Parameter display config
const PARAM_CONFIG = {
    ph_level: { label: 'pH Level', unit: 'pH', icon: FlaskConical, optimal: '6.5 - 8.5' },
    turbidity: { label: 'Turbidity', unit: 'NTU', icon: Droplets, optimal: '< 1 NTU' },
    dissolved_oxygen: { label: 'Dissolved Oxygen', unit: 'mg/L', icon: Droplets, optimal: '> 8 mg/L' },
    conductivity: { label: 'Conductivity', unit: 'µS/cm', icon: Droplets, optimal: '< 500 µS/cm' },
    bacteria_load: { label: 'Bacteria Load', unit: 'CFU/100mL', icon: Microscope, optimal: '0 CFU/100mL' },
    metal_concentration: { label: 'Heavy Metals', unit: 'mg/L', icon: AlertTriangle, optimal: '< 0.1 mg/L' },
};

/**
 * ReportDetailModal - Comprehensive water quality report modal
 * Shows full analysis details when clicking a marker on the map
 */
export default function ReportDetailModal({ report, isOpen, onClose }: ReportDetailModalProps) {
    // State for treatment detail modal
    const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);

    if (!report) return null;

    // Convert DB report to WaterParameters for analysis
    const params: WaterParameters = {
        phLevel: report.ph_level,
        turbidity: report.turbidity,
        dissolvedOxygen: report.dissolved_oxygen,
        conductivity: report.conductivity,
        bacteriaLoad: report.bacteria_load,
        metalConcentration: report.metal_concentration,
    };

    // Calculate classification and upgrade path
    const classification = calculateWaterTier(params);
    const upgradePath = generateUpgradePath(params, classification);
    const tierColor = getTierColor(report.calculated_tier);

    // Format date
    const reportDate = new Date(report.created_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    // Radar chart data
    const radarData = [
        { subject: 'pH', A: (6 - (classification.parameterScores['phLevel'] || 1)) * 20, fullMark: 100 },
        { subject: 'Turbidity', A: (6 - (classification.parameterScores['turbidity'] || 1)) * 20, fullMark: 100 },
        { subject: 'Oxygen', A: (6 - (classification.parameterScores['dissolvedOxygen'] || 1)) * 20, fullMark: 100 },
        { subject: 'Cond.', A: (6 - (classification.parameterScores['conductivity'] || 1)) * 20, fullMark: 100 },
        { subject: 'Bacteria', A: (6 - (classification.parameterScores['bacteriaLoad'] || 1)) * 20, fullMark: 100 },
        { subject: 'Metals', A: (6 - (classification.parameterScores['metalConcentration'] || 1)) * 20, fullMark: 100 },
    ];

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => {
                if (!open) {
                    // Reset treatment selection when closing the main modal
                    setSelectedTreatment(null);
                    onClose();
                }
            }}>
                <DialogContent
                    className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-lg border-border"
                >
                    <DialogHeader className="pb-4 border-b border-border">
                        {/* Tier Badge Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg"
                                    style={{ backgroundColor: tierColor }}
                                >
                                    T{report.calculated_tier}
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-bold">
                                        {classification.classification}
                                    </DialogTitle>
                                    <DialogDescription className="text-base mt-1">
                                        {classification.definition}
                                    </DialogDescription>
                                </div>
                            </div>
                            <Badge className={`text-sm px-3 py-1 ${getTierBadgeClass(report.calculated_tier)}`}>
                                TIER {report.calculated_tier}
                            </Badge>
                        </div>

                        {/* Location & Date */}
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}</span>
                            </div>
                            <span>•</span>
                            <span>{reportDate}</span>
                        </div>
                    </DialogHeader>

                    <div className="space-y-8 py-6">
                        {/* Parameter Analysis Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Radar Chart */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold">Quality Analysis</h3>
                                </div>
                                <div className="h-[280px] bg-muted/30 rounded-2xl p-4 border border-border">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                            <PolarGrid gridType="circle" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#888888', fontSize: 11 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar
                                                name="Quality Score"
                                                dataKey="A"
                                                stroke={tierColor}
                                                fill={tierColor}
                                                fillOpacity={0.4}
                                            />
                                            <Tooltip
                                                formatter={(value) => [`${value}% Safe`, 'Quality']}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Parameter Values */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <FlaskConical className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold">Measured Values</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(PARAM_CONFIG).map(([key, config]) => {
                                        const value = report[key as keyof typeof PARAM_CONFIG];
                                        const Icon = config.icon;
                                        const paramScore = classification.parameterScores[key === 'ph_level' ? 'phLevel' :
                                            key === 'dissolved_oxygen' ? 'dissolvedOxygen' :
                                                key === 'bacteria_load' ? 'bacteriaLoad' :
                                                    key === 'metal_concentration' ? 'metalConcentration' : key] || 1;
                                        const scoreColor = paramScore <= 2 ? 'text-green-500' : paramScore <= 3 ? 'text-amber-500' : 'text-red-500';

                                        return (
                                            <div key={key} className="p-3 bg-muted/30 rounded-xl border border-border">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">{config.label}</span>
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className={`text-lg font-bold ${scoreColor}`}>
                                                        {typeof value === 'number' ? value.toFixed(1) : value}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">{config.unit}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Optimal: {config.optimal}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Usage Permissions */}
                        <div className="bg-muted/20 rounded-2xl p-5 border border-border">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield className="w-5 h-5 text-green-500" />
                                <h3 className="font-semibold">Usage Permissions</h3>
                            </div>
                            <p className="text-muted-foreground mb-3">{classification.usagePermissions}</p>
                            <div className="flex flex-wrap gap-2">
                                {report.calculated_tier <= 2 ? (
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
                            {classification.limitingFactor !== 'All parameters optimal' && (
                                <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                                    <div className="flex items-center gap-2 text-destructive">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span className="font-medium text-sm">
                                            Limiting Factor: {classification.limitingFactor}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Treatment Path */}
                        {upgradePath.steps.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-blue-500" />
                                    <h3 className="font-semibold">Treatment / Upgrade Path</h3>
                                </div>
                                <div className="space-y-3">
                                    {upgradePath.steps.map((step, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedTreatment(step.method)}
                                            className="p-4 bg-muted/20 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge className="bg-blue-500">Step {idx + 1}</Badge>
                                                        <h4 className="font-semibold group-hover:text-primary transition-colors">{step.method}</h4>
                                                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                                    <p className="text-xs text-primary/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click for detailed view with animation</p>
                                                </div>
                                                <div className="text-right text-sm space-y-1">
                                                    <div className="flex items-center gap-1 text-green-500 font-medium">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Achieves Tier {step.achievableTier}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <Banknote className="w-3 h-3" />
                                                        ₹{step.estimatedCostPer1000L}/kL
                                                    </div>
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <Clock className="w-3 h-3" />
                                                        {step.timeRequired}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Final State */}
                                    <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <span className="text-green-500 font-semibold">
                                            Final Achievable: Tier {upgradePath.finalAchievableTier}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {report.notes && (
                            <div className="p-4 bg-muted/20 rounded-xl border border-border">
                                <h4 className="font-medium mb-2">Additional Notes</h4>
                                <p className="text-sm text-muted-foreground">{report.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                        <Button onClick={onClose} variant="outline" className="flex-1">
                            Close
                        </Button>
                        <Button onClick={() => window.print()} className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Water Treatment Detail Modal */}
            <WaterTreatmentDetailModal
                isOpen={!!selectedTreatment}
                onClose={() => setSelectedTreatment(null)}
                methodName={selectedTreatment || ''}
            />
        </>
    );
}
