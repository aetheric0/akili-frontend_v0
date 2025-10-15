import Header from "../components/ui/Header";
import { useAppState } from "../context/AuthContext";
import ChatWindow from "../features/chat/ChatWindow";
import UploadForm from "../features/upload/UploadForm";
import ChatInput from "../components/chat/ChatInput";
import EmptyState from "../components/chat/EmptyState";
import FocusTimer from "../features/mode/FocusMode";
import ProfileMenu from "../components/ui/ProfileWidget";

const ChatPage: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
    const activeSessionId = useAppState(state => state.activeSessionId);

    return (
        <div className="flex flex-col h-full relative"> 
            <Header toggleSidebar={toggleSidebar} />

                {/* <div className="hidden md:flex justify-end items-center p-4 space-x-4">
                    <ProfileMenu />
                    <div className="hidden md:block">
                    {activeSessionId && <FocusTimer />}
                    </div>
                </div>
                
                  {activeSessionId && (
                    <div className="md:hidden">
                        <FocusTimer />
                    </div>
                )} */}
                {activeSessionId && (
                <>
                    <ProfileMenu />
                    <FocusTimer />
                </>
            )}
                        
            <div className="flex-grow w-full overflow-y-auto custom-scrollbar p-4 pt-24 md:pt-4">
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

            {/* {activeSessionId && <FocusTimer />} */}
        </div>
    );
};

export default ChatPage;