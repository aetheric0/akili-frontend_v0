import { useCallback, useState } from "react";
import Sidebar from "../components/ui/Sidebar";
import ChatPage from "../pages/ChatPage";
import AuthHandler from "../components/auth/AuthHandler";

const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
 

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  const toggleDesktopSidebar = useCallback(() => {
    setIsDesktopSidebarCollapsed(prev => !prev);
  }, []);

  const mainContentMargin = isDesktopSidebarCollapsed ? "md:ml-20" : "md:ml-80";

  return (
    <div className="h-screen flex bg-transparent text-white font-sans">
      <AuthHandler />
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        toggleMobileSidebar={toggleMobileSidebar}
        toggleDesktopSidebar={toggleDesktopSidebar}
      />

      <main
        className={`flex-grow flex flex-col overflow-hidden ${mainContentMargin} transition-all duration-300`}
      >
        <ChatPage toggleSidebar={toggleMobileSidebar} />
      </main>

      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-950/70 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
    </div>
  );
};

export default AppLayout;
