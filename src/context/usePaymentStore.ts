import { create } from "zustand";

// Key for localStorage persistence
const IS_PAID_KEY = 'is_paid';

interface PaymentState {
    isPaid: boolean;
    
    // Action to load the status from localStorage on application startup
    initializeStatus: () => void;

    // Action to grant access (called upon successful payment or trial start)
    grantAccess: () => void;
}

// ⚠️ Note: For production, you would typically integrate this check with a secure
// backend server, not solely rely on client-side localStorage.
export const usePaymentStore = create<PaymentState>((set) => ({
    // Initialize state by checking localStorage synchronously
    isPaid: localStorage.getItem(IS_PAID_KEY) === 'true',

    initializeStatus: () => {
        // This function is mostly for consistency, as the state is initialized above.
        // It ensures the store state accurately reflects localStorage on load.
        const storedStatus = localStorage.getItem(IS_PAID_KEY) === 'true';
        set({ isPaid: storedStatus });
    },

    grantAccess: () => {
        // 1. Update the localStorage for future page loads
        localStorage.setItem(IS_PAID_KEY, 'true');

        // 2. Update the Zustand store state to immeidately hide the paywall
        set({ isPaid: true });
    },
}));