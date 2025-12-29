export interface ThemeDefinition {
    id: string;
    type: 'liquid' | 'dotted';
    name: string;
    description: string;
    colors: {
        background: string;
        foreground: string;
        accent: string;
    };
    liquidConfig: {
        color1: number[];
        color2: number[];
        color3: number[];
        intenseColor: number[];
        opacity: number;
    }
}

export const THEMES: ThemeDefinition[] = [
    {
        id: 'default',
        type: 'liquid',
        name: 'Pure Night',
        description: 'High contrast, perfect blacks',
        colors: {
            background: '#050505',
            foreground: '#ffffff',
            accent: '#ffffff'
        },
        liquidConfig: {
            color1: [0.02, 0.02, 0.05],
            color2: [0.05, 0.08, 0.15],
            color3: [0.1, 0.1, 0.2],
            intenseColor: [0.3, 0.05, 0.05],
            opacity: 0.3
        }
    },
    {
        id: 'deep-space',
        type: 'liquid',
        name: 'Deep Space',
        description: 'Softer dark tones',
        colors: {
            background: '#171717', // neutral-900
            foreground: '#a3a3a3', // neutral-400
            accent: '#ffffff'
        },
        liquidConfig: {
            color1: [0.05, 0.05, 0.08],
            color2: [0.08, 0.08, 0.12],
            color3: [0.12, 0.12, 0.18],
            intenseColor: [0.2, 0.05, 0.3],
            opacity: 0.5
        }
    },
    {
        id: 'nebula',
        type: 'liquid',
        name: 'Nebula',
        description: 'Blueish tint',
        colors: {
            background: '#0f172a', // slate-900
            foreground: '#94a3b8', // slate-400
            accent: '#38bdf8' // sky-400
        },
        liquidConfig: {
            color1: [0.02, 0.05, 0.1],
            color2: [0.05, 0.1, 0.2],
            color3: [0.1, 0.2, 0.3],
            intenseColor: [0.1, 0.3, 0.5],
            opacity: 0.4
        }
    },
    {
        id: 'dotted-matrix',
        type: 'dotted',
        name: 'Matrix Dots',
        description: 'Cyberpunk dotted surface',
        colors: {
            background: '#000000',
            foreground: '#00ff00',
            accent: '#00ff00'
        },
        liquidConfig: {
             // Values act as fallback or unused for dotted, but kept for type safety or hybrid properties
            color1: [0, 0, 0],
            color2: [0, 0, 0],
            color3: [0, 0, 0],
            intenseColor: [0, 1, 0],
            opacity: 0.0
        }
    }
];
