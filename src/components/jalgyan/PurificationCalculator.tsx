'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Droplet, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type ContaminationType = 'cloudy' | 'clear';

export function PurificationCalculator() {
    const [waterVolume, setWaterVolume] = useState<string>('');
    const [contaminationType, setContaminationType] = useState<ContaminationType>('cloudy');
    const [showResults, setShowResults] = useState(false);

    const calculatePurification = () => {
        const volume = parseFloat(waterVolume);
        if (isNaN(volume) || volume <= 0) {
            return null;
        }

        if (contaminationType === 'cloudy') {
            return {
                bleachDrops: Math.round(volume * 4),
                chlorineTablets: Math.ceil(volume / 2),
                type: 'Cloudy/Turbid Water',
                warning: 'Strain through cloth first to remove visible particles',
            };
        } else {
            return {
                bleachDrops: Math.round(volume * 2),
                chlorineTablets: Math.ceil(volume / 4),
                type: 'Clear but Unsafe Water',
                warning: 'Even clear water may contain harmful bacteria and viruses',
            };
        }
    };

    const handleCalculate = () => {
        if (waterVolume && parseFloat(waterVolume) > 0) {
            setShowResults(true);
        }
    };

    const results = calculatePurification();

    return (
        <Card className="bg-card border-border shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/20">
                        <Beaker className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-foreground">Water Purification Calculator</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                    Calculate the exact amount of bleach or chlorine tablets needed to make your water safe
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Water Volume Input */}
                <div className="space-y-2">
                    <Label htmlFor="volume" className="text-base text-foreground">
                        Water Volume (Liters)
                    </Label>
                    <Input
                        id="volume"
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="e.g., 10"
                        value={waterVolume}
                        onChange={(e) => {
                            setWaterVolume(e.target.value);
                            setShowResults(false);
                        }}
                        className="text-lg h-12"
                    />
                </div>

                {/* Contamination Type Selector */}
                <div className="space-y-3">
                    <Label className="text-base text-foreground">Contamination Type</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setContaminationType('cloudy');
                                setShowResults(false);
                            }}
                            className={`p-4 rounded-xl border-2 transition-all ${contaminationType === 'cloudy'
                                ? 'border-primary bg-primary/10 shadow-sm'
                                : 'border-border bg-card hover:border-primary/50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Droplet className={`w-5 h-5 ${contaminationType === 'cloudy' ? 'text-primary' : 'text-gray-400'}`} />
                                <div className="text-left">
                                    <div className={`font-semibold ${contaminationType === 'cloudy' ? 'text-primary' : 'text-foreground'}`}>
                                        Cloudy/Turbid
                                    </div>
                                    <div className="text-sm text-muted-foreground">Visible particles</div>
                                </div>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setContaminationType('clear');
                                setShowResults(false);
                            }}
                            className={`p-4 rounded-xl border-2 transition-all ${contaminationType === 'clear'
                                ? 'border-primary bg-primary/10 shadow-sm'
                                : 'border-border bg-card hover:border-primary/50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Droplet className={`w-5 h-5 ${contaminationType === 'clear' ? 'text-primary' : 'text-gray-400'}`} />
                                <div className="text-left">
                                    <div className={`font-semibold ${contaminationType === 'clear' ? 'text-primary' : 'text-foreground'}`}>
                                        Clear but Unsafe
                                    </div>
                                    <div className="text-sm text-muted-foreground">No visible particles</div>
                                </div>
                            </div>
                        </motion.button>
                    </div>
                </div>

                {/* Calculate Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCalculate}
                    disabled={!waterVolume || parseFloat(waterVolume) <= 0}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Calculate Requirements
                </motion.button>

                {/* Results */}
                {showResults && results && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4 p-6 rounded-xl bg-primary/5 border border-primary/20"
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold text-foreground mb-1">{results.type}</h4>
                                <p className="text-sm text-yellow-700">{results.warning}</p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-background border border-border">
                                <div className="text-sm text-muted-foreground mb-1">Household Bleach (5.25%)</div>
                                <div className="text-3xl font-bold text-primary">{results.bleachDrops}</div>
                                <div className="text-sm text-muted-foreground mt-1">drops required</div>
                            </div>

                            <div className="p-4 rounded-lg bg-background border border-border">
                                <div className="text-sm text-muted-foreground mb-1">Chlorine Tablets</div>
                                <div className="text-3xl font-bold text-primary">{results.chlorineTablets}</div>
                                <div className="text-sm text-muted-foreground mt-1">tablets required</div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                            <p className="text-sm text-yellow-800">
                                ⏱️ <strong>Wait Time:</strong> Let water sit for 30 minutes after treatment before drinking
                            </p>
                        </div>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}
