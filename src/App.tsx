import { useCallback, useEffect, useState } from "react";
import Header from "./components/ui/Header";
import PaywallModal from "./components/ui/Modal";
import { useAppState } from "./context/AuthContext";
import ChatPage from "./pages/ChatPage";
import { AKILI_STATE_KEY} from "./types";
import Sidebar from "./components/ui/Sidebar";

const App: React.FC = () => {
    const isPaid = useAppState(state => state.isPaid);
    const activeSessionId = useAppState(state => state.activeSessionId);
    const setLoading = useAppState(state => state.setLoading); 
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    // Session ID Persistence (Save/Load)
    useEffect(() => {
        if (activeSessionId) {
            const sessionData = JSON.stringify({ sessionId: activeSessionId });
            localStorage.setItem(AKILI_STATE_KEY, sessionData);
        } else {
            localStorage.removeItem(AKILI_STATE_KEY); 
        }
    }, [activeSessionId]); 

    // FIX: Clear a potentially stuck 'isLoading' state on load
    useEffect(() => {
        if (activeSessionId) {
            setLoading(false); 
        }
    }, [activeSessionId, setLoading]); 


    return (
        <div className="min-h-screen flex bg-gray-950 text-white font-sans">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                * { font-family: 'Inter', sans-serif; }
            `}</style>

            <Sidebar 
                isSidebarOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
            />
            
            <main className="flex-grow flex flex-col overflow-hidden md:ml-64">
                {isPaid ? (
                    <ChatPage 
                        isSidebarOpen={isSidebarOpen} 
                        toggleSidebar={toggleSidebar} 
                    />
                ) : (
                    <>
                        <Header toggleSidebar={toggleSidebar} />
                        <PaywallModal />
                    </>
                )}
            </main>
             {/* Mobile Overlay for Sidebar */}
             {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-30 bg-gray-950/70 md:hidden" 
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
}

export default App;