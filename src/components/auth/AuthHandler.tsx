import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAppState } from "../../context/AuthContext";
import { API_BASE_URL } from "../../types";

// const MERGE_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/auth/merge-guest-session`;

const MERGE_ENDPOINT = `${API_BASE_URL}/auth/merge-guest-session`;

const AuthHandler = () => {
  // Get the functions we need directly from the store's prototype
  const { fetchSessions, setAuthSession, guest_token } = useAppState.getState();

  useEffect(() => {
    // Set the initial user state when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthSession(session?.user ?? null, session);
      if (session) {
        console.log("Existing session found on page load. Fetching data.");
        fetchSessions();
      }
    });

    // Listen for future sign-in or sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuthSession(session?.user ?? null, session);

      if (event === 'SIGNED_IN' && session) {
        console.log("User has signed in. Checking for guest data to merge...");
        
        if (guest_token && localStorage.getItem("isGuestSessionActive") === "true") {
          try {
            await fetch(MERGE_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
              body: JSON.stringify({ guest_token }),
            });
            console.log("Guest session merge successful.");
            localStorage.removeItem("isGuestSessionActive");
          } catch (error) {
            console.error("Failed to merge guest session:", error);
          }
        }
        
        console.log("Fetching user sessions from backend...");
        await fetchSessions();
      }
    });

    return () => subscription.unsubscribe();
  }, [guest_token, fetchSessions, setAuthSession]);

  return null; // This component renders nothing
};

export default AuthHandler;