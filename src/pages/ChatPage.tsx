import Header from "../components/ui/Header";
import { useAppState } from "../context/AuthContext";
import ChatWindow from "../features/chat/ChatWindow";
import UploadForm from "../features/upload/UploadForm";
import ChatInput from "../components/chat/ChatInput";

const ChatPage: React.FC<{ isSidebarOpen: boolean, toggleSidebar: () => void }> = ({ toggleSidebar }) => {
    const activeSessionId = useAppState(state => state.activeSessionId);

    const showResetHint = activeSessionId !== null;

    return (
        // 1. Main container is a flex column that fills the screen
        <div className="flex-grow flex flex-col relative overflow-hidden bg-gray-950"> 
            
            <Header toggleSidebar={toggleSidebar} />
            
            {/* 2. Content area grows to fill space and handles its own scrolling */}
            <div className="flex-grow w-full overflow-y-auto custom-scrollbar px-4 pt-4 pb-24"> 
                <div className="max-w-4xl mx-auto">
                    {showResetHint && (
                        <div className="text-center p-4 bg-gray-800 rounded-lg border border-green-700 mb-4">
                            <p className="font-semibold text-green-400">Current Study Session Active.</p>
                            <p className="text-sm text-yellow-300">To upload a *new* document, use the <b className="text-white">Start New Study</b> button in the sidebar.</p>
                        </div>
                    )}
                    <ChatWindow />
                </div>
            </div>
            
            {/* 3. Input container is the LAST item in the flex column. It is NOT absolutely positioned. */}
            <div className="w-full p-4 md:p-6 flex justify-center border-t border-gray-800 bg-gray-950">
                <div className="w-full max-w-4xl">
                    {/* Only show the ChatInput if a session is active */}
                    {activeSessionId && <ChatInput />}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gray-950/95 backdrop-blur-sm shadow-2xl p-4 md:p-6 flex justify-center border-t border-gray-800">
                <div className="w-full max-w-4xl">
                    <UploadForm />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;