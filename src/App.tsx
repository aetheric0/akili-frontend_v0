import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AppLayout from "./layouts/AppLayout";
import { useAppState } from "./context/AuthContext";

const App: React.FC = () => {
const initializeAuth = useAppState(state => state.initializeAuth);
    useEffect(() => {
        // initializeAuth returns the unsubscribe function for cleanup
        const unsubscribe = initializeAuth();
        return () => unsubscribe();
    }, [initializeAuth]);

  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<AppLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
  );
};

export default App;
