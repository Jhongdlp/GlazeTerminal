import { createContext, useContext, useState, ReactNode } from 'react';
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

interface ThemeContextType {
    theme: Theme;
    terminal: TerminalSettings;
    activeThemeId: string;
    updateTheme: (updates: Partial<Theme>) => void;
    updateTerminal: (updates: Partial<TerminalSettings>) => void;
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

// --- Context ---

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(defaultTheme);
    const [terminal, setTerminal] = useState<TerminalSettings>(defaultTerminal);
    const [activeThemeId, setActiveThemeId] = useState<string>('default');

    const updateTheme = (updates: Partial<Theme>) => {
        setTheme(prev => ({ ...prev, ...updates }));
    };

    const updateTerminal = (updates: Partial<TerminalSettings>) => {
        setTerminal(prev => ({ ...prev, ...updates }));
    };

    const setThemeId = (id: string) => {
        setActiveThemeId(id);
        // In the future, this could load different presets
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            terminal,
            activeThemeId,
            updateTheme,
            updateTerminal,
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
