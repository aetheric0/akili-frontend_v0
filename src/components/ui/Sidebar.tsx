import { X, Zap, RefreshCw } from "lucide-react";
import { useCallback } from "react";
import { useAppState } from "../../context/AuthContext";

interface SidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
    const clearSession = useAppState(state => state.clearSession);
    const sessionId = useAppState(state => state.sessionId);
    
    const handleNewStudy = useCallback(() => {
        clearSession();
        // Close sidebar on mobile after clicking "New Study"
        if (isSidebarOpen) {
            toggleSidebar();
        }
    }, [clearSession, isSidebarOpen, toggleSidebar]);
    
    const sidebarClasses = isSidebarOpen 
        ? 'translate-x-0'
        : '-translate-x-full md:translate-x-0'; // Hide on mobile, show on desktop

    return (
        // Sidebar container
        <div 
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 p-4 transform transition-transform duration-300 ease-in-out 
            ${sidebarClasses} justify-between`}
        >
            {/* Top Section */}
            <div>
                {/* Close Button (Mobile Only) */}
                <button 
                    onClick={toggleSidebar}
                    className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-white"
                    title="Close Sidebar"
                >
                    <X className="w-6 h-6" />
                </button>
                
                {/* Heading: [svg-logo] Akili AI */}
                <h2 className="flex items-center text-xl font-bold text-white mt-4 mb-6 md:mt-0">
                    <Zap className="w-6 h-6 mr-2 text-yellow-400" /> 
                    Akili AI
                </h2>

                {/* Session Status and Control */}
                <div className="flex flex-col space-y-4">
                    {sessionId && (
                        <div className="p-3 bg-gray-800 rounded-lg text-sm text-gray-300">
                            <p className="flex items-center font-medium">
                                <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                                Session Active
                            </p>
                        </div>
                    )}
                    
                    <button 
                        onClick={handleNewStudy}
                        className="flex items-center w-full px-3 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-md"
                        title="Start New Session/Upload New Document"
                    >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Start New Study
                    </button>
                </div>
            </div>

            {/* Bottom Section (Branding moved here) */}
            <div className="space-y-4">
                <hr className="border-gray-700 my-4" />
                <div className="text-sm text-gray-500">
                    <p className="font-medium mb-1">Akili AI</p>
                    <p>Powered by Google AI</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;