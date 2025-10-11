import Header from "../components/ui/Header";
import { useAppState } from "../context/AuthContext";
import ChatWindow from "../features/chat/ChatWindow";
import UploadForm from "../features/upload/UploadForm";
import ChatInput from "../components/chat/ChatInput";
import EmptyState from "../components/chat/EmptyState";
import FocusTimer from "../features/mode/FocusMode";

const ChatPage: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
    const activeSessionId = useAppState(state => state.activeSessionId);

    return (
        <div className="flex flex-col h-full relative"> 
            <Header toggleSidebar={toggleSidebar} />

            
            <div className="flex-grow w-full overflow-y-auto custom-scrollbar p-4">
                {/* Main content area shows ChatWindow OR the EmptyState prompt */}
                <div className="max-w-3xl mx-auto h-full">
                    {activeSessionId ? <ChatWindow /> : <EmptyState />}
                </div>
            </div>
            
            {/* The pinned bottom bar shows ChatInput OR the UploadForm */}
            <div className="w-full p-4 md:p-6 flex justify-center border-t border-white/10 bg-transparent backdrop-blur-[2px] flex-shrink-0">
                <div className="w-full max-w-3xl">
                    {activeSessionId ? <ChatInput /> : <UploadForm />}
                </div>
            </div>

            {activeSessionId && <FocusTimer />}
        </div>
    );
};

export default ChatPage;