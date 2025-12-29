import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

export const useWindowControls = () => {
    const appWindow = getCurrentWebviewWindow();

    const minimize = () => {
        appWindow.minimize();
    };

    const maximize = () => {
        appWindow.toggleMaximize();
    };

    const close = () => {
        appWindow.close();
    };

    const startDrag = () => {
        appWindow.startDragging();
    };
    
    const startResize = (direction: 'SouthEast' = 'SouthEast') => {
        appWindow.startResizeDragging(direction);
    }

    const toggleFullscreen = async () => {
        const isFullscreen = await appWindow.isFullscreen();
        appWindow.setFullscreen(!isFullscreen);
    };

    return {
        minimize,
        maximize,
        close,
        startDrag,
        startResize,
        toggleFullscreen,
        appWindow // Expose the raw instance if ever needed for edge cases
    };
};
