import { useCallback, useEffect, useState } from "react";
import ChatPage from "./pages/ChatPage";
import Sidebar from "./components/ui/Sidebar";
import AppWrapper from "./components/ui/AppWrapper";
import AuthHandler from "./components/auth/AuthHandler";
import { useAppState } from "./context/AuthContext";
import { supabase } from "./lib/supabaseClient";

const App: React.FC = () => {
    // State for mobile sidebar overlay
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    // New state for desktop sidebar collapse
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

   const { setAuth, setAuthReady, initializeGuestToken, fetchSessions } = useAppState.getState();
    
    useEffect(() => {
        // This effect runs only ONCE when the app starts
        const checkUser = async () => {
            // 1. Check if a user session already exists
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                // If a user IS logged in, set their session and fetch their data.
                console.log("Existing Supabase session found. Fetching user data.");
                setAuth(session.user, session);
                await fetchSessions();
            } else {
                // If NO user is logged in, THEN we create a guest token.
                console.log("No active user session. Initializing as guest.");
                initializeGuestToken();
            }
            
            // 2. Mark the initial auth check as complete.
            setAuthReady(true);
        };
        
        checkUser();
        
        // 3. Set up a listener for any FUTURE changes (like a user logging in or out).
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuth(session?.user ?? null, session);
            if (_event === 'SIGNED_IN') {
                fetchSessions(); // Fetch sessions on new sign-in
            }
        });

        return () => subscription.unsubscribe();
    }, [setAuth, setAuthReady, initializeGuestToken, fetchSessions]);

    
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
            <AuthHandler />
            <div className="h-screen flex bg-transparent text-white font-sans">
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