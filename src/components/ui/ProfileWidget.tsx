import { useEffect, useState } from 'react';
import { Award, Star, Coins, User, X, CreditCard, LogOut } from 'lucide-react';
import { useAppState } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const getRankFromXp = (xp: number): string => {
  if (xp > 5000) return 'Master';
  if (xp > 1500) return 'Sage';
  if (xp > 500) return 'Scholar';
  if (xp > 100) return 'Apprentice';
  return 'Novice';
};

// A simple, clean SVG component for the Google logo
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.088,5.571l6.19,5.238C43.021,36.226,44,34,44,30C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const ProfileMenu = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { xp = 0, coins = 0, signOut } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const rank = getRankFromXp(xp);

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  useEffect(() => {
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };
    fetchUser();

    const { data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleSignOut = async () => {
    signOut();
  };

  return (
    <div className="relative z-20">
      <motion.button
        onClick={() => setIsOpen(!isOpen)} // Single button toggles the menu
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-yellow-400 shadow-lg"
      >
        <AnimatePresence mode="wait">
          {user ? (
            // LOGGED-IN ICON: User's avatar
            <motion.img
              key="avatar"
              src={user.user_metadata.avatar_url}
              alt="User avatar"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            // LOGGED-OUT ICON: Generic user icon
            <motion.div
              key="user-icon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <User size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="menu"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-12 right-0 origin-top-right w-64 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl"
          >
            {user ? (
              // --- LOGGED-IN MENU CONTENT ---
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold text-white">{rank}</span>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center"><Star className="w-4 h-4 mr-2" /> XP</span>
                    <span className="font-bold text-white">{xp}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center"><Coins className="w-4 h-4 mr-2" /> Coins</span>
                    <span className="font-bold text-white">{coins}</span>
                  </div>
                </div>
                <div className="h-[1px] bg-white/10 my-3"></div>
                <div className="flex flex-col space-y-1">
                  <a href="/profile" className="flex items-center p-2 rounded-md hover:bg-slate-700/50 transition-colors text-slate-300">
                    <CreditCard className="w-4 h-4 mr-3" /> Manage Account
                  </a>
                  <button onClick={handleSignOut} className="flex items-center p-2 rounded-md hover:bg-slate-700/50 transition-colors text-rose-400">
                    <LogOut className="w-4 h-4 mr-3" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              // --- LOGGED-OUT MENU CONTENT ---
              <div className="p-4">
                <p className="text-sm text-slate-300 mb-3">Save your progress by creating an account.</p>
                <button onClick={handleSignIn} className="w-full flex items-center justify-center p-2 rounded-md bg-white/90 hover:bg-white text-slate-900 font-semibold transition-colors">
                  <GoogleIcon />
                  Sign in with Google
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;