import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import config from '../config.json';

// --- Types ---

export interface LiquidTheme {
    color1: number[];
    color2: number[];
    color3: number[];
    intenseColor: number[];
}

export interface Theme {
    id: string;
    opacity: number;
    liquid: LiquidTheme;
}

export interface TerminalSettings {
    fontFamily: string;
    fontSize: number;
    shell: string;
}

export interface WindowSettings {
    useCustomSize: boolean;
    columns: number;
    rows: number;
    zoom: number;
}

interface ThemeContextType {
    theme: Theme;
    terminal: TerminalSettings;
    windowSettings: WindowSettings;
    activeThemeId: string;
    updateTheme: (updates: Partial<Theme>) => void;
    updateTerminal: (updates: Partial<TerminalSettings>) => void;
    updateWindow: (updates: Partial<WindowSettings>) => void;
    setThemeId: (id: string) => void;
}

// --- Defaults ---

const defaultTheme: Theme = {
    id: 'default',
    opacity: config.theme.opacity,
    liquid: {
        color1: config.theme.liquid.color1,
        color2: config.theme.liquid.color2,
        color3: config.theme.liquid.color3,
        intenseColor: config.theme.liquid.intenseColor,
    }
};

const defaultTerminal: TerminalSettings = {
    fontFamily: config.terminal.fontFamily,
    fontSize: config.terminal.fontSize,
    shell: config.terminal.shell
};

const defaultWindow: WindowSettings = {
    useCustomSize: false,
    columns: 80,
    rows: 24,
    zoom: 100
};

// --- Context ---

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'glaze_config';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Initialize state from localStorage or defaults
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        try {
            return saved ? JSON.parse(saved).theme || defaultTheme : defaultTheme;
        } catch {
            return defaultTheme;
        }
    });

    const [terminal, setTerminal] = useState<TerminalSettings>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        try {
            return saved ? JSON.parse(saved).terminal || defaultTerminal : defaultTerminal;
        } catch {
            return defaultTerminal;
        }
    });

    const [windowSettings, setWindowSettings] = useState<WindowSettings>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        try {
            // Check for saved window settings, merge with default to ensure new fields (like zoom) exist if reading old config
            const parsed = saved ? JSON.parse(saved).window : undefined;
            return parsed ? { ...defaultWindow, ...parsed } : defaultWindow;
        } catch {
            return defaultWindow;
        }
    });

    const [activeThemeId, setActiveThemeId] = useState<string>('default');

    // Persistence Effect
    useEffect(() => {
        const configToSave = {
            theme,
            terminal,
            window: windowSettings
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
    }, [theme, terminal, windowSettings]);

    const updateTheme = (updates: Partial<Theme>) => {
        setTheme(prev => ({ ...prev, ...updates }));
    };

    const updateTerminal = (updates: Partial<TerminalSettings>) => {
        setTerminal(prev => ({ ...prev, ...updates }));
    };

    const updateWindow = (updates: Partial<WindowSettings>) => {
        setWindowSettings(prev => ({ ...prev, ...updates }));
    };

    const setThemeId = (id: string) => {
        setActiveThemeId(id);
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            terminal,
            windowSettings,
            activeThemeId,
            updateTheme,
            updateTerminal,
            updateWindow,
            setThemeId
        }}>
            {children}
        </ThemeContext.Provider>
    );
};


export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
