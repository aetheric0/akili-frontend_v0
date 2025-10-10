import { Award, Star, Coins } from 'lucide-react';
import { useAppState } from '../../context/AuthContext';

interface AchievementsWidgetProps {
  isCollapsed: boolean;
}

// Define ranks and their XP thresholds for easy management
const RANKS = [
    { name: 'Novice', xp: 0 },
    { name: 'Apprentice', xp: 100 },
    { name: 'Scholar', xp: 500 },
    { name: 'Sage', xp: 1500 },
    { name: 'Master', xp: 5000 },
];

const AchievementsWidget: React.FC<AchievementsWidgetProps> = ({ isCollapsed }) => {
    // We'll get these from the state once the backend provides them
    const xp = useAppState(state => state.xp) || 0;
    const coins = useAppState(state => state.coins) || 0;

    // --- Rank Calculation Logic ---
    let currentRank = RANKS[0];
    let nextRank = RANKS[1];
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (xp >= RANKS[i].xp) {
            currentRank = RANKS[i];
            nextRank = RANKS[i + 1] || null; // null if it's the max rank
            break;
        }
    }

    const xpForNextRank = nextRank ? nextRank.xp - currentRank.xp : 0;
    const xpIntoCurrentRank = xp - currentRank.xp;
    const progressPercentage = nextRank ? (xpIntoCurrentRank / xpForNextRank) * 100 : 100;

    return (
        <div className="p-3 my-4 bg-gray-800 rounded-lg space-y-3 transition-all duration-300 overflow-hidden">
            
            {isCollapsed ? (
                <div className="flex flex-col items-center space-y-3">
                <span title={currentRank.name}>
                    <Award className="w-5 h-5 text-yellow-400"  />
                </span>
                <span title={`${coins} Coins`}>
                    <Coins className="w-5 h-5 text-yellow-400"  />
                </span>
                <span title={`${xp} XP`}>
                    <Star className="w-5 h-5 text-yellow-400" />
                </span>
                
        </div>
            ) : (
            <>
            <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-white flex items-center">
                    <Award className="w-4 h-4 mr-2 text-yellow-400" /> {currentRank.name}
                </span>
                <span className="text-gray-400 text-xs">
                    {nextRank ? `${xp}/${nextRank.xp} XP` : 'Max Rank'}
                </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                    className="bg-yellow-400 h-1.5 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
                 <span className="font-semibold text-white flex items-center">
                    <Coins className="w-4 h-4 mr-2 text-yellow-400" /> {coins} Coins
                </span>
                <span className="font-semibold text-white flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" /> {xp} XP
                </span>
            </div>
            </>
            )}
        </div>
    );
};

export default AchievementsWidget;