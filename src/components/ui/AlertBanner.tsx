import { X, AlertTriangle } from "lucide-react";

interface AlertBannerProps {
    message: string | null;
    type: 'error' | 'warning';
    onClose?: () => void;
}

// Simulates /components/ui/AlertBanner.tsx
const AlertBanner: React.FC<AlertBannerProps> = ({ message, type, onClose }) => {
    const bgColor = type === 'error' ? 'bg-red-600' : 'bg-yellow-600';
    const Icon = type === 'error' ? X : AlertTriangle;

    if (!message) return null;

    return (
        <div className={`p-3 rounded-lg flex justify-between items-start text-sm font-medium ${bgColor} text-white mb-4 shadow-xl`}>
            <div className="flex items-start">
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <p className="break-words">{message}</p>
            </div>
            {onClose && (
                <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors">
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default AlertBanner;