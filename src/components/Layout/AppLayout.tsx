import React, { useState } from 'react';
import { LiquidBackground } from '../LiquidBackground';
import TopBar from './TopBar';
import { useTheme } from '../../context/ThemeContext';
import { useWindowControls } from '../../hooks/useWindowControls';
import { ConfigurationWindow } from '../Settings/ConfigurationWindow';

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
    const { theme } = useTheme();
    const { startResize } = useWindowControls();
    const [showSettings, setShowSettings] = useState(false);

    const handleResize = () => {
        startResize('SouthEast');
    };


    return (
        <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-glass shadow-glass-glow border border-glass-border transition-all duration-300">
            
            {/* Layer 0: Liquid Render Engine */}
            <LiquidBackground />

            {/* Layer 1: Contrast Control (The "Dark Glass" tint) */}
            <div 
                className="absolute inset-0 z-5 bg-gray-950 pointer-events-none" 
                style={{ opacity: theme.opacity }}
            />

            {/* Settings Window Overlay */}
            <ConfigurationWindow open={showSettings} onClose={() => setShowSettings(false)} />

            {/* Layer 2: UI Context (Terminal & Controls) */}
            <div className="relative z-10 w-full h-full flex flex-col bg-transparent">
                <div className="relative z-50">
                    <TopBar title={title} onOpenSettings={() => setShowSettings(true)} />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 relative overflow-hidden p-2 z-0">
                    {children}

                    
                    {/* Resize Handle */}
                    <div 
                        onMouseDown={handleResize}
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 hover:bg-white/10 rounded-tl"
                    />
                </div>
            </div>
        </div>
    );
};

export default AppLayout;
