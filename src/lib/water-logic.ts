/**
 * BlueMonitor Water Quality Analysis Logic
 * Implements the 5-Tier Classification Matrix from the PRD
 * 
 * The algorithm analyzes input parameters and assigns a Tier based on the 
 * limiting factor (worst-performing parameter).
 */

export interface WaterParameters {
    phLevel: number;          // pH: 0-14 scale
    turbidity: number;        // NTU: 0-100+
    dissolvedOxygen: number;  // mg/L: 0-20
    conductivity: number;     // µS/cm: 0-5000+
    bacteriaLoad: number;     // CFU/100mL: 0-10000+
    metalConcentration: number; // mg/L: 0-10+
}

export interface TierClassification {
    tier: 1 | 2 | 3 | 4 | 5;
    classification: string;
    definition: string;
    usagePermissions: string;
    color: string;
    limitingFactor: string;
    parameterScores: Record<string, number>;
}

export interface TreatmentStep {
    method: string;
    description: string;
    estimatedCostPer1000L: number; // in INR
    timeRequired: string;
    achievableTier: number;
}

export interface UpgradePath {
    currentTier: number;
    steps: TreatmentStep[];
    finalAchievableTier: number;
}

// Tier definitions based on PRD
const TIER_DEFINITIONS = {
    1: {
        classification: 'Pure/Potable',
        definition: 'Sterile and balanced for immediate consumption',
        usagePermissions: 'Direct drinking, cooking, medical use',
        color: '#3b82f6', // Blue-500 (pure)
    },
    2: {
        classification: 'Household-Usable',
        definition: 'Safe for external contact and non-consumption purposes',
        usagePermissions: 'Bathing, laundry, irrigation, cleaning (boil before drinking)',
        color: '#22c55e', // Green-500 (safe)
    },
    3: {
        classification: 'Conditioned-Ready',
        definition: 'Currently contaminated but upgradable to Tier 1 or 2 via treatment',
        usagePermissions: 'Requires filtration/chlorination/boiling',
        color: '#f59e0b', // Amber-500 (warning)
    },
    4: {
        classification: 'Industrial-Grade',
        definition: 'Heavy contamination suitable only for industrial/agricultural processing',
        usagePermissions: 'Cooling systems, construction, treated irrigation only',
        color: '#f97316', // Orange-500
    },
    5: {
        classification: 'Biohazard',
        definition: 'Toxic chemical or extreme biological contamination',
        usagePermissions: 'Avoid all contact; environmental hazard',
        color: '#ef4444', // Red-500 (danger)
    },
} as const;

// Threshold values for each parameter at different tiers
// Values represent the MAXIMUM allowed for that tier
const THRESHOLDS = {
    phLevel: {
        // Optimal pH is 6.5-8.5
        // We calculate distance from optimal range
        tier1: 0.5,   // Very close to optimal (6.0-9.0)
        tier2: 1.0,   // Acceptable (5.5-9.5)
        tier3: 1.5,   // Needs treatment (5.0-10.0)
        tier4: 2.5,   // Industrial only (4.0-11.0)
        // Beyond tier4 = Tier 5
    },
    turbidity: {
        tier1: 1,     // NTU: Crystal clear
        tier2: 5,     // NTU: Slightly cloudy
        tier3: 25,    // NTU: Visible cloudiness
        tier4: 100,   // NTU: Very turbid
        // Beyond tier4 = Tier 5
    },
    dissolvedOxygen: {
        // Higher is better - values represent MINIMUM required
        tier1: 8,     // mg/L: Excellent
        tier2: 6,     // mg/L: Good
        tier3: 4,     // mg/L: Fair
        tier4: 2,     // mg/L: Poor
        // Below tier4 = Tier 5
    },
    conductivity: {
        tier1: 500,   // µS/cm: Low minerals
        tier2: 1000,  // µS/cm: Moderate
        tier3: 2000,  // µS/cm: High
        tier4: 4000,  // µS/cm: Very high
        // Beyond tier4 = Tier 5
    },
    bacteriaLoad: {
        tier1: 0,     // CFU/100mL: Sterile
        tier2: 100,   // CFU/100mL: Low
        tier3: 1000,  // CFU/100mL: Moderate
        tier4: 5000,  // CFU/100mL: High
        // Beyond tier4 = Tier 5
    },
    metalConcentration: {
        tier1: 0.1,   // mg/L: Trace
        tier2: 0.5,   // mg/L: Low
        tier3: 2.0,   // mg/L: Moderate
        tier4: 5.0,   // mg/L: High
        // Beyond tier4 = Tier 5
    },
};

/**
 * Calculate the tier for a single parameter
 */
function getParameterTier(param: keyof WaterParameters, value: number): number {
    const thresholds = THRESHOLDS[param];

    // Special handling for pH (distance from optimal range 6.5-8.5)
    if (param === 'phLevel') {
        const optimalMin = 6.5;
        const optimalMax = 8.5;
        const distance = value < optimalMin
            ? optimalMin - value
            : value > optimalMax
                ? value - optimalMax
                : 0;

        if (distance <= thresholds.tier1) return 1;
        if (distance <= thresholds.tier2) return 2;
        if (distance <= thresholds.tier3) return 3;
        if (distance <= thresholds.tier4) return 4;
        return 5;
    }

    // Special handling for dissolved oxygen (higher is better)
    if (param === 'dissolvedOxygen') {
        if (value >= thresholds.tier1) return 1;
        if (value >= thresholds.tier2) return 2;
        if (value >= thresholds.tier3) return 3;
        if (value >= thresholds.tier4) return 4;
        return 5;
    }

    // Standard handling (lower is better)
    if (value <= thresholds.tier1) return 1;
    if (value <= thresholds.tier2) return 2;
    if (value <= thresholds.tier3) return 3;
    if (value <= thresholds.tier4) return 4;
    return 5;
}

/**
 * Get human-readable parameter name
 */
function getParameterName(param: keyof WaterParameters): string {
    const names: Record<keyof WaterParameters, string> = {
        phLevel: 'pH Level',
        turbidity: 'Turbidity',
        dissolvedOxygen: 'Dissolved Oxygen',
        conductivity: 'Conductivity',
        bacteriaLoad: 'Bacteria Load',
        metalConcentration: 'Metal Concentration',
    };
    return names[param];
}

/**
 * Main function: Calculate the water quality tier
 * Uses the "limiting factor" approach - the worst parameter determines the tier
 */
export function calculateWaterTier(params: WaterParameters): TierClassification {
    const parameterScores: Record<string, number> = {};
    let worstTier = 1;
    let limitingFactor = 'All parameters optimal';

    // Calculate tier for each parameter
    const paramKeys: (keyof WaterParameters)[] = [
        'phLevel',
        'turbidity',
        'dissolvedOxygen',
        'conductivity',
        'bacteriaLoad',
        'metalConcentration',
    ];

    for (const key of paramKeys) {
        const tier = getParameterTier(key, params[key]);
        parameterScores[key] = tier;

        if (tier > worstTier) {
            worstTier = tier;
            limitingFactor = getParameterName(key);
        }
    }

    const tierDef = TIER_DEFINITIONS[worstTier as 1 | 2 | 3 | 4 | 5];

    return {
        tier: worstTier as 1 | 2 | 3 | 4 | 5,
        classification: tierDef.classification,
        definition: tierDef.definition,
        usagePermissions: tierDef.usagePermissions,
        color: tierDef.color,
        limitingFactor,
        parameterScores,
    };
}

/**
 * Generate treatment recommendations based on the limiting factor
 */
export function generateUpgradePath(
    params: WaterParameters,
    classification: TierClassification
): UpgradePath {
    const steps: TreatmentStep[] = [];
    const currentTier = classification.tier;

    // If already Tier 1, no upgrade needed
    if (currentTier === 1) {
        return { currentTier, steps: [], finalAchievableTier: 1 };
    }

    // Get individual parameter scores to determine treatment priority
    const scores = classification.parameterScores;

    // Treatment methods for each parameter type
    const treatments: Record<string, TreatmentStep[]> = {
        bacteriaLoad: [
            {
                method: 'UV Sterilization',
                description: 'Ultraviolet light treatment to kill bacteria and viruses',
                estimatedCostPer1000L: 50,
                timeRequired: '10-30 minutes',
                achievableTier: 1,
            },
            {
                method: 'Chlorination',
                description: 'Add chlorine tablets or liquid chlorine for disinfection',
                estimatedCostPer1000L: 15,
                timeRequired: '30 minutes',
                achievableTier: 2,
            },
            {
                method: 'Boiling',
                description: 'Bring water to rolling boil for at least 1 minute',
                estimatedCostPer1000L: 100,
                timeRequired: '15-20 minutes',
                achievableTier: 2,
            },
        ],
        turbidity: [
            {
                method: 'Ceramic Filtration',
                description: 'Pass water through ceramic filter to remove particles',
                estimatedCostPer1000L: 30,
                timeRequired: '4-6 hours (gravity fed)',
                achievableTier: 1,
            },
            {
                method: 'Flocculation + Sedimentation',
                description: 'Add alum to clump particles, let settle for 2+ hours',
                estimatedCostPer1000L: 20,
                timeRequired: '2-4 hours',
                achievableTier: 3,
            },
        ],
        phLevel: [
            {
                method: 'pH Adjustment',
                description: 'Add lime (to raise) or citric acid (to lower) pH',
                estimatedCostPer1000L: 25,
                timeRequired: '15-30 minutes',
                achievableTier: 1,
            },
        ],
        metalConcentration: [
            {
                method: 'Activated Carbon Filtration',
                description: 'Charcoal filtration to absorb heavy metals',
                estimatedCostPer1000L: 80,
                timeRequired: '2-4 hours',
                achievableTier: 2,
            },
            {
                method: 'Reverse Osmosis',
                description: 'High-pressure membrane filtration for complete purification',
                estimatedCostPer1000L: 150,
                timeRequired: '1-2 hours',
                achievableTier: 1,
            },
        ],
        conductivity: [
            {
                method: 'Distillation',
                description: 'Boil and collect condensed steam for pure water',
                estimatedCostPer1000L: 200,
                timeRequired: '4-8 hours',
                achievableTier: 1,
            },
            {
                method: 'Reverse Osmosis',
                description: 'Membrane filtration to reduce dissolved solids',
                estimatedCostPer1000L: 150,
                timeRequired: '1-2 hours',
                achievableTier: 1,
            },
        ],
        dissolvedOxygen: [
            {
                method: 'Aeration',
                description: 'Agitate or spray water to increase oxygen absorption',
                estimatedCostPer1000L: 10,
                timeRequired: '30 minutes - 2 hours',
                achievableTier: 1,
            },
        ],
    };

    // Add treatments for parameters that need improvement
    for (const [param, score] of Object.entries(scores)) {
        if (score > 1 && treatments[param]) {
            // Find the best treatment for the current score level
            const availableTreatments = treatments[param];
            const bestTreatment = availableTreatments.find(t => t.achievableTier <= 2) || availableTreatments[0];

            if (!steps.some(s => s.method === bestTreatment.method)) {
                steps.push(bestTreatment);
            }
        }
    }

    // Sort by cost efficiency
    steps.sort((a, b) => a.estimatedCostPer1000L - b.estimatedCostPer1000L);

    // Calculate final achievable tier (optimistic - assumes all treatments work)
    const finalAchievableTier = Math.min(...steps.map(s => s.achievableTier), currentTier);

    return {
        currentTier,
        steps,
        finalAchievableTier,
    };
}

/**
 * Generate realistic random values for simulation mode
 */
export function generateSimulatedData(): WaterParameters {
    // Generate somewhat realistic values with some contamination
    const scenarios = [
        // Clean water scenario
        { phLevel: 7.2, turbidity: 0.5, dissolvedOxygen: 9, conductivity: 300, bacteriaLoad: 0, metalConcentration: 0.05 },
        // River water scenario
        { phLevel: 7.8, turbidity: 15, dissolvedOxygen: 7, conductivity: 800, bacteriaLoad: 500, metalConcentration: 0.3 },
        // Contaminated well scenario
        { phLevel: 6.2, turbidity: 8, dissolvedOxygen: 5, conductivity: 1500, bacteriaLoad: 2000, metalConcentration: 1.5 },
        // Industrial runoff scenario
        { phLevel: 4.5, turbidity: 45, dissolvedOxygen: 3, conductivity: 3500, bacteriaLoad: 3000, metalConcentration: 4.0 },
        // Highly polluted scenario
        { phLevel: 3.0, turbidity: 120, dissolvedOxygen: 1, conductivity: 5500, bacteriaLoad: 8000, metalConcentration: 8.0 },
    ];

    // Pick a random scenario
    const base = scenarios[Math.floor(Math.random() * scenarios.length)];

    // Add some randomness
    return {
        phLevel: Math.max(0, Math.min(14, base.phLevel + (Math.random() - 0.5) * 1)),
        turbidity: Math.max(0, base.turbidity + (Math.random() - 0.5) * base.turbidity * 0.3),
        dissolvedOxygen: Math.max(0, Math.min(20, base.dissolvedOxygen + (Math.random() - 0.5) * 2)),
        conductivity: Math.max(0, base.conductivity + (Math.random() - 0.5) * base.conductivity * 0.2),
        bacteriaLoad: Math.max(0, Math.round(base.bacteriaLoad + (Math.random() - 0.5) * base.bacteriaLoad * 0.4)),
        metalConcentration: Math.max(0, base.metalConcentration + (Math.random() - 0.5) * base.metalConcentration * 0.3),
    };
}

/**
 * Get tier color for display
 */
export function getTierColor(tier: number): string {
    return TIER_DEFINITIONS[tier as 1 | 2 | 3 | 4 | 5]?.color || '#6b7280';
}

/**
 * Get tier badge styles for Tailwind
 */
export function getTierBadgeClass(tier: number): string {
    const classes: Record<number, string> = {
        1: 'bg-blue-500 text-white',
        2: 'bg-green-500 text-white',
        3: 'bg-amber-500 text-white',
        4: 'bg-orange-500 text-white',
        5: 'bg-red-500 text-white animate-pulse',
    };
    return classes[tier] || 'bg-gray-500 text-white';
}
