import Header from "../components/ui/Header";
import { useAppState } from "../context/AuthContext";
import ChatWindow from "../features/chat/ChatWindow";
import UploadForm from "../features/upload/UploadForm";
import ChatInput from "../components/chat/ChatInput";
// import EmptyState from "../components/chat/EmptyState";
import FocusTimer from "../features/mode/FocusMode";
import ProfileMenu from "../components/ui/ProfileWidget";
import { useEffect } from "react";
import EmptyState from "../components/chat/EmptyState";
import ThemeToggleButton from "../components/ui/ThemeToggleButton";

const ChatPage: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
    const { mode, activeSessionId, sessions, setActiveSession, createNewChatSession } = useAppState();

    const activeSession = sessions.find(s => s.id === activeSessionId);

    useEffect(() => {
        const hasFetched = useAppState.getState()._hasHydrated;

        if (mode === 'study') { 
            if (activeSession?.mode === 'chat') setActiveSession(null);
            return;
        }
        if (mode === 'chat' && sessions.length === 0 && hasFetched) {
            createNewChatSession();
        }
    }, [mode, activeSession, sessions, createNewChatSession, setActiveSession])

    // Determine which main view to show
    const isStudyModeEntry = mode === 'study' && (!activeSession || activeSession.mode !== 'study');

    return (
        <div className="flex flex-col h-full relative"> 
            <Header toggleSidebar={toggleSidebar} />

                <div className="hidden md:flex justify-end items-center p-4 space-x-4">
                    {/* Theme toggle button */}
                    <ThemeToggleButton />

                    {/* User Profile */}
                    <ProfileMenu />

                    {/* Study Mode Focus Timer (if active) */}
                    {mode === 'study' && activeSessionId && (
                        <div className="hidden md:block">
                            <FocusTimer />
                        </div>
                    )}
                </div>
                
                  {mode === 'study' && activeSessionId && <div className="md:hidden"><FocusTimer /></div>}
            
            {/* Main Content Area */}            
             <div className="flex-grow w-full overflow-y-auto custom-scrollbar p-4 md:px-6 pt-8 md:pt-4">
                <div className="max-w-3xl mx-auto h-full">
                    {isStudyModeEntry ? <EmptyState /> : <ChatWindow />}
                </div>
            </div>
            
            {/* The pinned bottom bar shows ChatInput OR the UploadForm */}
            <div className="w-full p-4 md:p-6 flex justify-center border-t border-white/10 bg-transparent backdrop-blur-[2px] flex-shrink-0">
                <div className="w-full max-w-3xl">
                    {isStudyModeEntry ? (
                        // If in Study Mode with NO active session, show the Upload Form here.
                        <UploadForm />
                    ) : (
                        // In ALL other cases (Chat Mode, or an active Study Session), show the Chat Input.
                        <ChatInput />
                    )}
                </div>
            </div>

            {/* {activeSessionId && <FocusTimer />} */}
        </div>
    );
};

export default ChatPage;