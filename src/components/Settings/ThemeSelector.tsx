import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, X, Check } from "lucide-react";
import { THEMES, ThemeDefinition } from "../../constants/ThemeDefinitions";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

interface ThemeSelectorProps {
    open: boolean;
    onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ open, onClose }) => {
    const { activeThemeId, setThemeId, updateTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredThemes = THEMES.filter(theme => 
        theme.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectTheme = (theme: ThemeDefinition) => {
        setThemeId(theme.id);
        updateTheme({
            id: theme.id,
            liquid: theme.liquidConfig,
            opacity: theme.liquidConfig.opacity
        });
    };

    return (
        <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: open ? "0%" : "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-y-0 left-0 z-50 w-80 bg-[#09090b] border-r border-white/10 shadow-2xl flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#09090b]">
                <h3 className="text-white font-semibold">Themes</h3>
                <button 
                    onClick={onClose}
                    className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-white/10 bg-[#09090b]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search themes..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/20 transition-colors"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-[#0c0c0e]">
                {filteredThemes.map((theme) => {
                    const isActive = activeThemeId === theme.id;
                    return (
                        <div 
                            key={theme.id}
                            onClick={() => handleSelectTheme(theme)}
                            className={cn(
                                "group cursor-pointer rounded-xl border-2 transition-all p-3 relative overflow-hidden",
                                isActive 
                                    ? "bg-white/5 border-[#2196f3]" 
                                    : "bg-[#121214] border-transparent hover:border-white/10 hover:bg-white/5"
                            )}
                        >
                            {/* Theme Preview Box */}
                            <div 
                                className="h-24 rounded-lg mb-3 relative overflow-hidden shadow-inner"
                                style={{ backgroundColor: theme.colors.background }}
                            >
                                <div className="absolute top-3 left-3 flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-500/20" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                                    <div className="w-2 h-2 rounded-full bg-green-500/20" />
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-mono opacity-80" style={{ color: theme.colors.foreground }}>
                                    <span>ls -la</span>
                                    <br />
                                    <span style={{ color: theme.colors.accent }}>drwxr-xr-x</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className={cn("text-sm font-medium mb-0.5", isActive ? "text-white" : "text-neutral-300 group-hover:text-white")}>
                                        {theme.name}
                                    </h4>
                                    <p className="text-xs text-neutral-500">{theme.description}</p>
                                </div>
                                {isActive && (
                                    <div className="bg-[#2196f3] rounded-full p-1">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};
