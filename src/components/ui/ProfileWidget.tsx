import { Award, Star, Coins } from 'lucide-react';
import { useAppState } from '../../context/AuthContext';

// This logic can be moved to a utils file later
const getRankFromXp = (xp: number): string => {
    if (xp > 5000) return 'Master';
    if (xp > 1500) return 'Sage';
    if (xp > 500) return 'Scholar';
    if (xp > 100) return 'Apprentice';
    return 'Novice';
};

const ProfileWidget = () => {
    // We'll get these from the state once the backend provides them
    const xp = useAppState(state => state.xp) || 0;
    const coins = useAppState(state => state.coins) || 0;
    const rank = getRankFromXp(xp);

    return (
        <div className="p-3 bg-gray-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Rank</span>
                <span className="font-bold text-white flex items-center">
                    <Award className="w-4 h-4 mr-1 text-yellow-400" /> {rank}
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">XP</span>
                <span className="font-bold text-white flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" /> {xp}
                </span>
            </div>
             <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Coins</span>
                <span className="font-bold text-white flex items-center">
                    <Coins className="w-4 h-4 mr-1 text-yellow-400" /> {coins}
                </span>
            </div>
        </div>
    );
};

export default ProfileWidget;