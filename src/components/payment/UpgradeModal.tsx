import { useState } from 'react';
import { X, Zap, CheckCircle } from 'lucide-react';
import { initializeMpesaPaymentApi } from '../../api/paymentApi';

interface UpgradeModalProps {
    onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose }) => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlan || !phoneNumber) return;

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await initializeMpesaPaymentApi(selectedPlan, phoneNumber);
            setSuccessMessage(response.display_text || "Success! Check your phone to enter your M-Pesa PIN.");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X />
                </button>
                <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center"><Zap className="mr-2"/> Upgrade Your Plan</h2>

                {/* --- Plan Selection --- */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div onClick={() => setSelectedPlan('basic_weekly')} className={`p-4 border-2 rounded-lg cursor-pointer ${selectedPlan === 'basic_weekly' ? 'border-yellow-400 bg-gray-800' : 'border-gray-700'}`}>
                        <h3 className="font-bold">Basic</h3>
                        <p className="text-xl font-bold">50 KES</p>
                        <p className="text-xs text-gray-400">/ week</p>
                    </div>
                    <div onClick={() => setSelectedPlan('standard_monthly')} className={`p-4 border-2 rounded-lg cursor-pointer ${selectedPlan === 'standard_monthly' ? 'border-yellow-400 bg-gray-800' : 'border-gray-700'}`}>
                        <h3 className="font-bold">Premium</h3>
                        <p className="text-xl font-bold">199 KES</p>
                        <p className="text-xs text-gray-400">/ month</p>
                    </div>
                </div>

                {/* --- M-Pesa Form --- */}
                {selectedPlan && (
                    <form onSubmit={handlePayment}>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">M-Pesa Phone Number</label>
                        <input
                            id="phone"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="0712345678"
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 p-3 bg-green-600 font-bold rounded-lg hover:bg-green-500 disabled:bg-gray-500"
                        >
                            {isLoading ? 'Processing...' : 'Pay with M-Pesa'}
                        </button>
                    </form>
                )}
                
                {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                {successMessage && <p className="text-green-400 text-sm mt-4 flex items-center"><CheckCircle className="mr-2"/>{successMessage}</p>}
            </div>
        </div>
    );
};

export default UpgradeModal;