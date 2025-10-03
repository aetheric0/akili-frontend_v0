import { MessageSquare, Trash2 } from "lucide-react";
import { useAppState } from "../../context/AuthContext";

const Header: React.FC = () => {
    const clearSession = useAppState(state => state.clearSession);

    return (
        <header className="bg-gray-800 text-white shadow-lg p-4 flex justify-between items-center sticky top-0 z-10">
            <h1 className="text-xl font-bold flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-green-400" />
                Akili Study AI
            </h1>
            <button 
                onClick={clearSession} 
                className="flex items-center text-sm text-red-400 hover:text-red-500 transition duration-150"
                title="Start a new session and clear current context"
            >
                <Trash2 className="w-4 h-4 mr-1" />
                New Session
            </button>
        </header>
    );
}

export default Header;