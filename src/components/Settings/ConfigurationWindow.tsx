import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar, SidebarLink, DesktopSidebar } from "../ui/sidebar";
import { Palette, Keyboard, Info, Terminal, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";

// Sub-components for pages
const GeneralSettings = () => (
  <div className="p-4 text-neutral-200">
    <h3 className="text-xl font-semibold mb-6 text-white border-b border-white/10 pb-4">General Settings</h3>
    <div className="space-y-6 max-w-4xl">
        <div className="p-6 rounded-xl bg-neutral-900/50 border border-white/5">
            <h4 className="font-medium text-neutral-100 mb-2 text-lg">Startup Behavior</h4>
            <div className="flex items-center gap-3">
                 <input type="checkbox" className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 accent-white" id="startup" defaultChecked />
                 <label htmlFor="startup" className="text-sm text-neutral-400">Launch Refract automatically when your computer starts</label>
            </div>
        </div>
        <div className="p-6 rounded-xl bg-neutral-900/50 border border-white/5">
            <h4 className="font-medium text-neutral-100 mb-2 text-lg">Shell Configuration</h4>
            <p className="text-sm text-neutral-400 mb-4">Choose the default shell environment for new terminal sessions.</p>
             <div className="relative">
                 <select className="appearance-none bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white w-full max-w-sm focus:ring-1 focus:ring-white/20 focus:border-white/20 outline-none transition-all">
                     <option>Fish (/usr/bin/fish)</option>
                     <option>Zsh (/bin/zsh)</option>
                     <option>Bash (/bin/bash)</option>
                     <option>Powershell</option>
                 </select>
                 <div className="absolute right-0 top-0 bottom-0 flex items-center pr-3 pointer-events-none max-w-sm">
                    <Settings className="w-4 h-4 text-neutral-500" /> 
                 </div>
             </div>
        </div>
    </div>
  </div>
);

const ThemeSettings = () => (
  <div className="p-4 text-neutral-200">
     <h3 className="text-xl font-semibold mb-6 text-white border-b border-white/10 pb-4">Appearance</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="group cursor-pointer">
            <div className="aspect-video rounded-xl bg-[#050505] border-2 border-white ring-2 ring-white/20 flex items-center justify-center mb-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-sm text-white font-medium z-10">Pure Night</span>
            </div>
            <p className="text-sm text-neutral-400 text-center">High contrast, perfect blacks</p>
        </div>
        <div className="group cursor-pointer">
            <div className="aspect-video rounded-xl bg-neutral-900 border border-white/10 group-hover:border-white/30 transition-colors flex items-center justify-center mb-3">
                 <span className="text-sm text-neutral-400 group-hover:text-white transition-colors">Deep Space</span>
            </div>
            <p className="text-sm text-neutral-500 text-center">Softer dark tones</p>
        </div>
        <div className="group cursor-pointer">
            <div className="aspect-video rounded-xl bg-slate-900 border border-white/10 group-hover:border-white/30 transition-colors flex items-center justify-center mb-3">
                 <span className="text-sm text-neutral-400 group-hover:text-white transition-colors">Nebula</span>
            </div>
            <p className="text-sm text-neutral-500 text-center">Blueish tint</p>
        </div>
    </div>
    <div className="mt-10 p-6 rounded-xl bg-neutral-900/50 border border-white/5">
        <div className="flex justify-between mb-4">
             <h4 className="font-medium text-neutral-100">Window Transparency</h4>
             <span className="text-sm text-neutral-500">80%</span>
        </div>
        <input type="range" className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white" />
    </div>
  </div>
);

const ShortcutSettings = () => (
  <div className="p-4 text-neutral-200">
    <h3 className="text-xl font-semibold mb-6 text-white border-b border-white/10 pb-4">Keyboard Shortcuts</h3>
    <div className="space-y-3 max-w-3xl">
        {[
            { label: "Toggle Fullscreen", key: "F11" },
            { label: "New Tab", key: "Ctrl + T" },
            { label: "Split Vertically", key: "Ctrl + D" },
            { label: "Command Palette", key: "Ctrl + K" },
            { label: "Close Tab", key: "Ctrl + W" },
            { label: "Next Tab", key: "Ctrl + Tab" },
        ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/5">
                <span className="text-sm text-neutral-300 font-medium">{item.label}</span>
                <kbd className="px-2.5 py-1.5 text-xs font-mono bg-neutral-950 text-neutral-400 rounded-md border border-neutral-800 shadow-sm">{item.key}</kbd>
            </div>
        ))}
    </div>
  </div>
);

const AboutSettings = () => (
  <div className="p-4 text-neutral-200 flex flex-col items-center justify-center h-[70vh]">
    <div className="w-24 h-24 bg-gradient-to-br from-neutral-800 to-black rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-black/50 border border-white/10">
         <Terminal className="text-white h-12 w-12" />
    </div>
    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Refract</h3>
    <p className="text-neutral-500 mb-8 text-lg">Next-Gen Terminal Emulator</p>
    
    <div className="grid grid-cols-2 gap-8 text-center max-w-md w-full">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-2xl font-bold text-white mb-1">0.1.0</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Version</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-2xl font-bold text-white mb-1">Beta</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Channel</div>
        </div>
    </div>
  </div>
);

export const ConfigurationWindow = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState("general");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const links = [
        {
            label: "General",
            href: "#",
            icon: <LayoutDashboard className="text-neutral-400 group-hover/sidebar:text-white transition-colors h-5 w-5 flex-shrink-0" />,
            id: "general"
        },
        {
            label: "Appearance",
            href: "#",
            icon: <Palette className="text-neutral-400 group-hover/sidebar:text-white transition-colors h-5 w-5 flex-shrink-0" />,
            id: "appearance"
        },
        {
            label: "Shortcuts",
            href: "#",
            icon: <Keyboard className="text-neutral-400 group-hover/sidebar:text-white transition-colors h-5 w-5 flex-shrink-0" />,
            id: "shortcuts"
        },
        {
            label: "About",
            href: "#",
            icon: <Info className="text-neutral-400 group-hover/sidebar:text-white transition-colors h-5 w-5 flex-shrink-0" />,
            id: "about"
        }
    ];

    const renderContent = () => {
        switch(activeTab) {
            case "general": return <GeneralSettings />;
            case "appearance": return <ThemeSettings />;
            case "shortcuts": return <ShortcutSettings />;
            case "about": return <AboutSettings />;
            default: return <GeneralSettings />;
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-10 inset-x-0 bottom-0 z-40 bg-[#050505] flex flex-row overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >

                    {/* Sidebar: Always Desktop Style (Icons with Hover Slide) - using !flex to enforce display */}
                     <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
                         {/* We use DesktopSidebar explicitly to enforce the specific layout behavior */}
                        <DesktopSidebar 
                            className="!flex flex-col justify-start gap-10 bg-black border-r border-white/5 h-full"
                            animate={{
                                width: sidebarOpen ? "250px" : "80px",
                            }}
                        >
                            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden mt-4">
                               <div className="flex items-center gap-3 mb-8 px-2">
                                  <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-white/10 cursor-pointer">
                                      <Terminal className="text-black h-5 w-5" />
                                  </div>
                                  <motion.span 
                                     animate={{ opacity: sidebarOpen ? 1 : 0, display: sidebarOpen ? "block" : "none" }}
                                     className="font-bold text-white text-lg whitespace-pre"
                                  >
                                      Refract
                                  </motion.span>
                               </div>

                                {/* Link List */}
                                <div className="flex flex-col gap-2">
                                    {links.map((link, idx) => (
                                        <SidebarLink 
                                            key={idx} 
                                            link={link} 
                                            onClick={() => setActiveTab(link.id)}
                                            className={cn(
                                                "rounded-lg transition-all duration-200 px-3 py-2",
                                                activeTab === link.id ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-white"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mt-auto">
                                <SidebarLink 
                                    link={{
                                        label: "Close Config",
                                        href: "#",
                                        icon: <LogOut className="text-neutral-400 group-hover/sidebar:text-red-400 transition-colors h-5 w-5 flex-shrink-0" />
                                    }} 
                                    onClick={onClose}
                                    className="text-neutral-400 hover:text-red-400 hover:bg-red-900/10 rounded-lg px-3 py-2"
                                />
                            </div>
                        </DesktopSidebar>
                     </Sidebar>

                     {/* Content Area */}
                    <div className="flex-1 flex flex-col h-full relative bg-[#09090b] overflow-hidden">
                         <div className="flex-1 overflow-auto custom-scrollbar p-6 md:p-12 pb-12">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="max-w-5xl mx-auto w-full"
                            >
                                {renderContent()}
                            </motion.div>
                         </div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
};
