import { 
  X, Zap, PlusCircle, Trash2, ChevronsLeft, ChevronsRight, 
  ShieldCheck, FileText, MessageCircle 
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAppState } from "../../context/AuthContext";
import AchievementsWidget from "./AchievementWidget";
import UpgradeModal from "../payment/UpgradeModal";
import { motion } from "framer-motion";

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
  const { 
    sessions, activeSessionId, setActiveSession, fetchSessions, clearSession, 
    mode, setMode, createNewChatSession, theme 
  } = useAppState();
  
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = useAppState.subscribe((state, prevState) => {
      if (state._hasHydrated && !prevState._hasHydrated) {
        fetchSessions();
      }
    });
    return unsubscribe;
  }, [fetchSessions]);

  const handleNewSession = () => {
    if (mode === 'chat') createNewChatSession();
    else setActiveSession(null);
  };

  const handleDelete = (e: React.MouseEvent, sessionId: string, docName: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the session for "${docName}"?`)) {
      clearSession(sessionId);
    }
  };

  const mobileSidebarClasses = isMobileOpen ? "translate-x-0" : "-translate-x-full";
  const desktopSidebarWidth = isDesktopCollapsed ? "w-20" : "w-80";

  // 🎨 Dynamic color logic
  const bgColor =
    theme === "dark"
      ? "bg-gray-900 border-gray-800 text-gray-100"
      : "bg-stone-100 border-stone-200 text-gray-800";
  const hoverBg =
    theme === "dark" ? "hover:bg-gray-700/50" : "hover:bg-gray-200/40";
  const sessionActiveBg =
    theme === "dark" ? "bg-gray-700" : "bg-gray-200";

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-40 ${bgColor} border-r p-4 transform transition-all duration-300 ease-in-out flex flex-col md:translate-x-0 ${mobileSidebarClasses} ${desktopSidebarWidth}`}
      >
        {/* 🔹 Top Section */}
        <div>
          <button
            onClick={toggleMobileSidebar}
            className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>

          {!isDesktopCollapsed && (
            <>
              {/* Logo */}
              <div
                className={`flex items-center justify-center text-xl font-bold mt-4 mb-6 md:mt-0 ${
                  isDesktopCollapsed ? "justify-center" : "justify-start"
                }`}
              >
                <Zap
                  className={`w-6 h-6 mr-2 ${
                    theme === "dark" ? "text-yellow-400" : "text-amber-500"
                  } flex-shrink-0`}
                />
                <span className="transition-opacity duration-200">
                  Akili AI
                </span>
              </div>

              {/* Mode Selector */}
              <div className="my-6 grid grid-cols-2 gap-3">
                {/* Chat Mode */}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode("chat")}
                  className={`relative flex flex-col items-center justify-center py-3 rounded-xl border transition-all duration-300 ${
                    mode === "chat"
                      ? "bg-gradient-to-b from-cyan-500 to-blue-600 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] scale-105"
                      : theme === "dark"
                      ? "bg-gray-800 border-gray-700 hover:border-cyan-400"
                      : "bg-gray-100 border-gray-300 hover:border-cyan-400"
                  }`}
                >
                  {mode === "chat" && (
                    <motion.span
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-2 right-2 text-[10px] bg-cyan-500 text-white px-2 py-0.5 rounded-full shadow-md"
                    >
                      Active
                    </motion.span>
                  )}
                  <MessageCircle
                    size={22}
                    className={`mb-1 ${
                      mode === "chat"
                        ? "text-white scale-110"
                        : "text-cyan-500 opacity-80"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      mode === "chat"
                        ? "text-white"
                        : theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    Chat
                  </span>
                </motion.button>

                {/* Study Mode */}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode("study")}
                  className={`relative flex flex-col items-center justify-center py-3 rounded-xl border transition-all duration-300 ${
                    mode === "study"
                      ? "bg-gradient-to-b from-amber-400 to-orange-500 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.5)] scale-105"
                      : theme === "dark"
                      ? "bg-gray-800 border-gray-700 hover:border-amber-400"
                      : "bg-gray-100 border-gray-300 hover:border-amber-400"
                  }`}
                >
                  {mode === "study" && (
                    <motion.span
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-2 right-2 text-[10px] bg-amber-400 text-gray-900 px-2 py-0.5 rounded-full shadow-md font-medium"
                    >
                      Active
                    </motion.span>
                  )}
                  <FileText
                    size={22}
                    className={`mb-1 ${
                      mode === "study"
                        ? "text-white scale-110"
                        : "text-amber-500 opacity-80"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      mode === "study"
                        ? "text-white"
                        : theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    Study
                  </span>
                </motion.button>
              </div>
            </>
          )}

          {/* New Session Button */}
          <div className="flex justify-center">
            <button
              onClick={handleNewSession}
              className={`flex items-center justify-center w-full max-w-[240px] px-3 py-3 text-sm font-medium rounded-lg transition-colors shadow-md ${
                theme === "dark"
                  ? "text-white bg-blue-600 hover:bg-blue-500"
                  : "text-white bg-blue-500 hover:bg-blue-400"
              }`}
            >
              <PlusCircle className="w-5 h-5 mr-0 md:mr-2 flex-shrink-0" />
              {!isDesktopCollapsed && (
                <span className="transition-opacity duration-200">
                  New Session
                </span>
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
            className={`text-xs uppercase mb-2 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } ${isDesktopCollapsed ? "text-center" : ""}`}
          >
            {isDesktopCollapsed ? "..." : "Past Sessions"}
          </h3>

          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setActiveSession(session.id)}
              className={`group flex items-center justify-between p-2 my-1 rounded-lg cursor-pointer text-sm transition-colors ${
                activeSessionId === session.id
                  ? sessionActiveBg
                  : hoverBg
              }`}
              title={session.document_name}
            >
              <span className="flex items-center justify-between w-full group px-2 py-1 rounded-md">
                <div className="flex items-center gap-2 truncate">
                  {session.mode === "study" ? (
                    <FileText
                      size={16}
                      className={`text-gray-500 ${theme === 'dark' ? 'group-hover:text-amber-400' : 'group-hover:text-amber-900 font-black'}`}
                    />
                  ) : (
                    <MessageCircle
                      size={16}
                      className={`text-gray-500 ${theme === 'dark' ? 'group-hover:text-blue-400' : 'group-hover:text-blue-500 font-black'}`}
                    />
                  )}
                  <span className="truncate">{session.document_name}</span>
                </div>
                {!isDesktopCollapsed && (
                  <button
                    onClick={(e) =>
                      handleDelete(e, session.id, session.document_name)
                    }
                    className="ml-2 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* 🔹 Bottom Section */}
        <div className="mt-4 flex-shrink-0">
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className={`flex items-center w-full p-2 my-2 rounded-lg ${
              theme === "dark"
                ? "text-yellow-400 hover:bg-yellow-400/10"
                : "text-amber-600 hover:bg-amber-100"
            } ${isDesktopCollapsed ? "justify-center" : ""}`}
          >
            <ShieldCheck size={20} />
            {!isDesktopCollapsed && (
              <span className="ml-2 text-sm font-semibold">
                Upgrade Plan
              </span>
            )}
          </button>

          <hr
            className={`my-4 ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          />

          <button
            onClick={toggleDesktopSidebar}
            className={`hidden md:flex items-center justify-center w-full p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {isDesktopCollapsed ? (
              <ChevronsRight size={20} />
            ) : (
              <ChevronsLeft size={20} />
            )}
            {!isDesktopCollapsed && (
              <span className="ml-2 text-sm">Collapse</span>
            )}
          </button>

          <hr
            className={`my-4 ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          />

          <div
            className={`text-sm mt-2 text-center ${
              theme === "dark" ? "text-gray-500" : "text-gray-500"
            }`}
          >
            <p className="font-medium mb-1">&copy; Akili</p>
            {!isDesktopCollapsed && <p>Powered by Google AI</p>}
          </div>
        </div>
      </div>

      {isUpgradeModalOpen && (
        <UpgradeModal onClose={() => setIsUpgradeModalOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;
