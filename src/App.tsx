import Header from "./components/ui/Header";
import PaywallModal from "./components/ui/Modal";
import { useAppState } from "./context/AuthContext";
import ChatPage from "./pages/ChatPage";

const App: React.FC = () => {
    const { isPaid } = useAppState(); 

    return (
        <div className="min-h-screen flex flex-col bg-gray-950 text-white">
            <Header />
            {isPaid ? <ChatPage /> : <PaywallModal />}
        </div>
    );
}

export default App;