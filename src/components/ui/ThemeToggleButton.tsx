import { Sun, Moon } from "lucide-react";
import { useAppState } from "../../context/AuthContext";

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useAppState();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={`
        p-2 rounded-full transition-all 
        ${theme === "dark"
          ? "text-yellow-400 hover:bg-yellow-400/10"
          : "text-slate-600 hover:bg-slate-200"}
      `}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggleButton;