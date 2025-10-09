import { X, Zap, PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { useAppState } from "../../context/AuthContext";

interface SidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
    // 1. Get the new state properties from Zustand
    const sessions = useAppState(state => state.sessions);
    const activeSessionId = useAppState(state => state.activeSessionId);
    const setActiveSession = useAppState(state => state.setActiveSession);
    const fetchSessions = useAppState(state => state.fetchSessions);

    // 2. Fetch sessions when the component mounts
    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const sidebarClasses = isSidebarOpen 
        ? 'translate-x-0'
        : '-translate-x-full md:translate-x-0';

    return (
        // 3. Use flex-col and h-full to enable the sticky footer
        <div 
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 p-4 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarClasses}`}
        >
            {/* Top Section */}
            <div>
                <button 
                    onClick={toggleSidebar}
                    className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>
                
                <h2 className="flex items-center text-xl font-bold text-white mt-4 mb-6 md:mt-0">
                    <Zap className="w-6 h-6 mr-2 text-yellow-400" /> 
                    Akili AI
                </h2>

                <button 
                    onClick={() => setActiveSession(null)} // Setting activeSessionId to null will show the UploadForm
                    className="flex items-center w-full px-3 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-md mb-4"
                    title="Start New Session/Upload New Document"
                >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    New Study Session
                </button>
            </div>

            {/* Middle Section (Sessions List) */}
            {/* 4. Use flex-grow to push the footer down and overflow-y-auto to enable scrolling */}
            <div className="flex-grow overflow-y-auto custom-scrollbar">
                <h3 className="text-xs text-gray-400 uppercase mb-2">Past Sessions</h3>
                {sessions.length > 0 ? (
                    sessions.map((session, index) => (
                        <div 
                            key={session.id ?? `${session.document_name}-${index}`} 
                            onClick={() => setActiveSession(session.id)}
                            className={`p-2 my-1 rounded-lg cursor-pointer text-white truncate text-sm ${
                                activeSessionId === session.id ? 'bg-gray-700' : 'hover:bg-gray-700/50'
                            }`}
                            title={session.document_name}
                        >
                            {session.document_name}
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No past sessions found.</p>
                )}
            </div>

            {/* Bottom Section (Sticky Footer) */}
            <div className="mt-4">
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