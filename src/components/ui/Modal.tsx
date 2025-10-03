import { useAppState } from "../../context/AuthContext";

const PaywallModal: React.FC = () => (
    // FIX: Increased opacity to make the modal overlay more prominent
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center z-[1000] text-white">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Upgrade Required</h2>
            <p className="mb-6">Access to the main app is restricted. Please subscribe or start a trial to continue.</p>
            <div className="flex flex-col gap-3">
                {/* Mock buttons */}
                <button className="bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold transition"
                    onClick={() => console.log('Redirecting to payment...')}>
                    Subscribe Now
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition"
                    // Mock action to proceed
                    onClick={() => useAppState.setState({ isPaid: true })}>
                    Start Free Trial (Mock)
                </button>
            </div>
        </div>
    </div>
);
export default PaywallModal;