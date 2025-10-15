import { Menu, Zap } from "lucide-react";
import ProfileMenu from "./ProfileWidget";
import { useAppState } from "../../context/AuthContext";



const Header: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
    const activeSessionId = useAppState((state) => state.activeSessionId);

    return (
        <header className="relative z-20 flex justify-between items-center p-4 bg-gray-950 border-b border-gray-800 shadow-md text-white md:hidden">
            <button 
                onClick={toggleSidebar}
                className="text-gray-400 hover:text-white md:hidden"
                title="Open Menu"
            >
                <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
                <Zap className="text-yellow-400 w-6 h-6" />
                <h1 className="text-xl font-bold">Akili AI</h1>
            </div>
            {/* Spacer to balance the layout with the menu button */}
            <div className="w-6 h-6"></div>
            <div className="w-10 h-10 flex items-center justify-end">
              {activeSessionId && <ProfileMenu />}
            </div>
        </header>
    );
};
export default Header;