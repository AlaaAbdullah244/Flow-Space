import React, { useState, useEffect } from "react";
import TodoWidget from "./components/TodoWidget";
import TimerWidget from "./components/TimerWidget";
import NotesWidget from "./components/NotesWidget";
import StatsWidget from "./components/StatsWidget";
import AnimatedBackground from "./components/AnimatedBackground";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import "./App.css";

// --- custom hook for persistence ---
function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(`❌ Failed to parse localStorage key "${key}"`, e);
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error(`❌ Failed to save localStorage key "${key}"`, e);
    }
  }, [key, state]);

  return [state, setState];
}

function AppContent() {
  const { toggleTheme, isDark } = useTheme();

  // TODOS
  const [todos, setTodos] = useLocalStorageState("todos", []);

  // NOTES
  const [notes, setNotes] = useLocalStorageState("notes_v2", []);

  // TIMER STATS
  const [sessionsCompleted, setSessionsCompleted] = useLocalStorageState(
    "sessionsCompleted",
    0
  );
  const [totalFocusMinutes, setTotalFocusMinutes] = useLocalStorageState(
    "totalFocusMinutes",
    0
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <header className="text-center mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <h1 className="text-4xl font-black">FlowSpace</h1>
            <div className="flex-1 flex justify-end">
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isDark
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
                title={`Switch to ${isDark ? "light" : "dark"} mode`}
              >
                {isDark ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
          <p
            className={`mt-2 transition-colors duration-500 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Focus, Notes & Tasks — everything saved locally
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <TodoWidget
            todos={todos}
            setTodos={setTodos}
            completedCount={todos.filter((t) => t.completed).length}
          />

          <TimerWidget
            sessionsCompleted={sessionsCompleted}
            setSessionsCompleted={setSessionsCompleted}
            totalFocusMinutes={totalFocusMinutes}
            setTotalFocusMinutes={setTotalFocusMinutes}
          />

          <NotesWidget notes={notes} setNotes={setNotes} />

          <div className="lg:col-span-12">
            <StatsWidget
              todos={todos}
              sessionsCompleted={sessionsCompleted}
              totalFocusMinutes={totalFocusMinutes}
              notesCount={notes.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
