import { useAppState } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const MergeSessionModal = () => {
  const { pendingMerge, mergeGuestData, discardGuestData } = useAppState();

  return (
    <AnimatePresence>
      {pendingMerge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-3">Merge Guest Session?</h2>
            <p className="text-slate-300 mb-6">
              We found a guest session on this device with unsaved chats and progress.
              Do you want to merge this data into your account?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={discardGuestData}
                className="px-4 py-2 font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
              >
                No, Start Fresh
              </button>
              <button
                onClick={mergeGuestData}
                className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors"
              >
                Yes, Merge Data
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
