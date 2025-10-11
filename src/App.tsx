import { useCallback, useState, useEffect } from "react";
import ChatPage from "./pages/ChatPage";
import Sidebar from "./components/ui/Sidebar";
import { useAppState } from "./context/AuthContext";
import AppWrapper from "./components/ui/AppWrapper";

const App: React.FC = () => {
    // State for mobile sidebar overlay
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    // New state for desktop sidebar collapse
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
    
    const { initializeGuestToken } = useAppState();

    useEffect(() => {
        initializeGuestToken();
    }, [initializeGuestToken]);

    const toggleMobileSidebar = useCallback(() => {
        setIsMobileSidebarOpen(prev => !prev);
    }, []);

    const toggleDesktopSidebar = useCallback(() => {
        setIsDesktopSidebarCollapsed(prev => !prev);
    }, []);

    // Dynamically set the main content's margin based on the desktop sidebar state
    const mainContentMargin = isDesktopSidebarCollapsed ? 'md:ml-20' : 'md:ml-80';

    return (
        <AppWrapper>
            <div className="h-screen flex bg-gray-950 text-white font-sans">
                <Sidebar 
                    isMobileOpen={isMobileSidebarOpen} 
                    isDesktopCollapsed={isDesktopSidebarCollapsed}
                    toggleMobileSidebar={toggleMobileSidebar}
                    toggleDesktopSidebar={toggleDesktopSidebar}
                />
                
                <main className={`flex-grow flex flex-col overflow-hidden ${mainContentMargin} transition-all duration-300`}>
                    <ChatPage toggleSidebar={toggleMobileSidebar} />
                </main>

                {isMobileSidebarOpen && (
                    <div 
                        className="fixed inset-0 z-30 bg-gray-950/70 md:hidden" 
                        onClick={toggleMobileSidebar}
                    />
                )}
            </div>
        </AppWrapper>
    );
}

export default App;