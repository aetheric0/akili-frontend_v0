import { X, Zap, PlusCircle, Trash2, ChevronsLeft, ChevronsRight, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppState } from "../../context/AuthContext";
import AchievementsWidget from "./AchievementWidget";
import UpgradeModal from "../payment/UpgradeModal";

interface SidebarProps {
    isMobileOpen: boolean;
    isDesktopCollapsed: boolean;
    toggleMobileSidebar: () => void;
    toggleDesktopSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isMobileOpen,
    isDesktopCollapsed,
    toggleMobileSidebar,
    toggleDesktopSidebar,
}) => {
    const { sessions, activeSessionId, setActiveSession, fetchSessions, clearSession } = useAppState();
     const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    // Fetch sessions once app state hydrates
    useEffect(() => {
        const unsubscribe = useAppState.subscribe((state, prevState) => {
            if (state._hasHydrated && !prevState._hasHydrated) {
                fetchSessions();
            }
        });
        return unsubscribe;
    }, [fetchSessions]);

    const handleDelete = (e: React.MouseEvent, sessionId: string, docName: string) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the session for "${docName}"?`)) {
            clearSession(sessionId);
        }
    };

    // --- CRITICAL LAYOUT CLASSES ---
    const mobileSidebarClasses = isMobileOpen ? "translate-x-0" : "-translate-x-full";
    const desktopSidebarWidth = isDesktopCollapsed ? "w-20" : "w-80"; // Collapsed (80px) vs Expanded (320px)

    return (
        <>
            <div
                className={`fixed inset-y-0 left-0 z-40 bg-gray-900 border-r border-gray-800 p-4 transform transition-all duration-300 ease-in-out flex flex-col md:translate-x-0 ${mobileSidebarClasses} ${desktopSidebarWidth}`}
            >
                {/* 🔹 Top Section */}
                <div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={toggleMobileSidebar}
                        className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Brand */}
                    <div
                        className={`flex items-center justify-center text-xl font-bold text-white mt-4 mb-6 md:mt-0 ${
                            isDesktopCollapsed ? "justify-center" : "justify-start"
                        }`}
                    >
                        <Zap className="w-6 h-6 mr-2 text-yellow-400 flex-shrink-0" />
                        {!isDesktopCollapsed && (
                            <span className="transition-opacity duration-200">Akili AI</span>
                        )}
                    </div>

                    {/* New Session Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => setActiveSession(null)}
                            className={`flex items-center justify-center w-full max-w-[240px] px-3 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-md ${
                                isDesktopCollapsed ? "justify-center" : "justify-start"
                            }`}
                        >
                            <PlusCircle className="w-5 h-5 mr-0 md:mr-2 flex-shrink-0" />
                            {!isDesktopCollapsed && (
                                <span className="transition-opacity duration-200">New Session</span>
                            )}
                        </button>
                    </div>

                    {/* Achievements Widget */}
                    <div
                        className={`mt-4 flex justify-center transition-transform duration-300 ${
                            isDesktopCollapsed ? "scale-90" : "scale-105"
                        }`}
                    >
                        <div className="w-[90%] max-w-[240px]">
                            <AchievementsWidget isCollapsed={isDesktopCollapsed} />
                        </div>
                    </div>
                </div>

                {/* 🔹 Middle Section (Sessions List) */}
                <div className="flex-grow overflow-y-auto custom-scrollbar mt-4">
                    <h3
                        className={`text-xs text-gray-400 uppercase mb-2 ${
                            isDesktopCollapsed ? "text-center" : ""
                        }`}
                    >
                        {isDesktopCollapsed ? "..." : "Past Sessions"}
                    </h3>
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => setActiveSession(session.id)}
                            className={`group flex items-center justify-between p-2 my-1 rounded-lg cursor-pointer text-white text-sm ${
                                activeSessionId === session.id
                                    ? "bg-gray-700"
                                    : "hover:bg-gray-700/50"
                            }`}
                            title={session.document_name}
                        >
                            <span
                                className={`truncate transition-opacity duration-200 ${
                                    isDesktopCollapsed ? "opacity-0" : "opacity-100"
                                }`}
                            >
                                {session.title}
                            </span>
                            {!isDesktopCollapsed && (
                                <button
                                    onClick={(e) => handleDelete(e, session.id, session.document_name)}
                                    className="ml-2 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* 🔹 Bottom Section (Footer) */}
                <div className="mt-4 flex-shrink-0">
                    
                    <button
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className={`flex items-center w-full p-2 my-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg ${isDesktopCollapsed ? 'justify-center' : ''}`}
                    >
                        <ShieldCheck size={20} />
                        {!isDesktopCollapsed && <span className="ml-2 text-sm font-semibold">Upgrade Plan</span>}
                    </button>
                    <hr className="border-gray-700 my-4" />
                    <button
                        onClick={toggleDesktopSidebar}
                        className="hidden md:flex items-center justify-center w-full p-2 text-gray-400 hover:bg-gray-700 rounded-lg"
                    >
                        {isDesktopCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
                        {!isDesktopCollapsed && <span className="ml-2 text-sm">Collapse</span>}
                    </button>
                    <hr className="border-gray-700 my-4" />
                    {isDesktopCollapsed ? (
                        <div className="text-sm text-gray-500 mt-2 text-center">
                            <p className="font-extrabold mb-1">&copy; Akili</p>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 mt-2 text-center">
                            <p className="font-medium mb-1">&copy; Akili</p>
                            <p>Powered by Google AI</p>
                        </div>
                    )}
                </div>
            </div>
            {/* 3. Conditionally render the modal outside the main sidebar div */}
            {isUpgradeModalOpen && <UpgradeModal onClose={() => setIsUpgradeModalOpen(false)} />}
        </>
    );
};

export default Sidebar;
