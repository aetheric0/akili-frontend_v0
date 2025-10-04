import { Zap } from "lucide-react";
import { useAppState } from "../../context/AuthContext";

const PaywallModal: React.FC = () => {
    const { grantAccess } = useAppState(); 

    const handleSubscribe = () => {
        console.log('Redirecting to payment page...');
    };

    const handleFreeTrial = () => {
        grantAccess();
    }
    
    return (
        <div className="fixed inset-0 z-50 bg-gray-950 bg-opacity-90 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center w-11/12 max-w-sm border border-yellow-500/30">
                <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Unlock Akili AI</h2>
                <p className="text-gray-400 mb-6">
                    A concise summary and quiz requires access. Choose an option to continue your learning journey.
                </p>

                <div className="flex flex-col space-y-3">
                    <button 
                        className="w-full py-3 px-4 bg-yellow-600 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition-all transform hover:scale-[1.02]" 
                        onClick={handleSubscribe}
                    >
                        Subscribe for KES 199/month
                    </button>
                    <button 
                        className="w-full py-3 px-4 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors"
                        onClick={handleFreeTrial}
                    >
                        Continue with Free Trial
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaywallModal;