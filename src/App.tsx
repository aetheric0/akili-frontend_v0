import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppWrapper from "./components/ui/AppWrapper";
import HomePage from "./pages/HomePage";
import AppLayout from "./layouts/AppLayout";
import { useAppState } from "./context/AuthContext";
import { supabase } from "./lib/supabaseClient";

const App: React.FC = () => {
  const { setAuth, setAuthReady, initializeGuestToken, fetchSessions } = useAppState.getState();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        console.log("Existing Supabase session found. Fetching user data.");
        setAuth(session.user, session);
        await fetchSessions();
      } else {
        console.log("No active user session. Initializing as guest.");
        initializeGuestToken();
      }

      setAuthReady(true);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(session?.user ?? null, session);
      if (_event === "SIGNED_IN") {
        fetchSessions();
      }
    });

    return () => subscription.unsubscribe();
  }, [setAuth, setAuthReady, initializeGuestToken, fetchSessions]);

  return (
    <AppWrapper>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<AppLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppWrapper>
  );
};

export default App;
