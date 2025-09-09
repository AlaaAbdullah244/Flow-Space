import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

/**
 Props:
  - sessionsCompleted, setSessionsCompleted
  - totalFocusMinutes, setTotalFocusMinutes
*/

export default function TimerWidget({
  sessionsCompleted,
  setSessionsCompleted,
  totalFocusMinutes,
  setTotalFocusMinutes,
}) {
  const { isDark } = useTheme();
  // mode: 'focus' or 'break'
  const [mode, setMode] = useState("focus");
  const [sessionMinutes, setSessionMinutes] = useState(25); // active length in minutes
  const [timeLeft, setTimeLeft] = useState(sessionMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  // keep audio in ref
  const beepRef = useRef(null);

  // load persisted timer state (if exists)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("timer_state_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed) {
          setMode(parsed.mode || "focus");
          setSessionMinutes(parsed.sessionMinutes || 25);
          setTimeLeft(
            typeof parsed.timeLeft === "number"
              ? parsed.timeLeft
              : (parsed.sessionMinutes || 25) * 60
          );
          setIsRunning(Boolean(parsed.isRunning));
        }
      }
    } catch (e) {
      console.error("Can't load timer state:", e);
    }
  }, []);

  // persist timer state
  useEffect(() => {
    const payload = { mode, sessionMinutes, timeLeft, isRunning };
    localStorage.setItem("timer_state_v2", JSON.stringify(payload));
  }, [mode, sessionMinutes, timeLeft, isRunning]);

  // update timeLeft when sessionMinutes changed (and not running)
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(sessionMinutes * 60);
    }
  }, [sessionMinutes, isRunning]);

  // main ticker
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            // finish
            handleComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, mode, sessionMinutes]);

  // compute minutes/seconds
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // progress for circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const totalForMode =
    (mode === "focus" ? sessionMinutes : sessionMinutes === 15 ? 5 : 5) * 60;
  // note: using small break defaults (5 min). You can extend to long breaks logic.
  const progressPercent =
    totalForMode > 0 ? Math.round((1 - timeLeft / totalForMode) * 100) : 0;
  const dashoffset = circumference * (1 - progressPercent / 100);

  // audio setup
  useEffect(() => {
    beepRef.current = new Audio(
      "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=" // very short silent placeholder (some browsers require real sound file)
    );
    // It's better to replace above data URI with a real small beep hosted locally or in assets.
  }, []);

  // handle finish
  function handleComplete() {
    setIsRunning(false);

    // vibrate if available
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    // play sound (best-effort)
    try {
      if (beepRef.current) {
        beepRef.current.currentTime = 0;
        beepRef.current.play().catch(() => {});
      }
    } catch (e) {}

    // if focus finished, update stats
    if (mode === "focus") {
      setSessionsCompleted((s) => s + 1);
      setTotalFocusMinutes((m) => m + sessionMinutes);
    }

    // auto-switch mode: focus -> break, break -> focus
    setTimeout(() => {
      if (mode === "focus") {
        // short break 5 min (or long logic could be added)
        setMode("break");
        setSessionMinutes(5);
        setTimeLeft(5 * 60);
      } else {
        setMode("focus");
        setSessionMinutes(25);
        setTimeLeft(25 * 60);
      }
    }, 400);
  }

  function startPause() {
    setIsRunning((r) => !r);
  }

  function resetTimer() {
    setIsRunning(false);
    // reset according to current mode defaults
    setTimeLeft((mode === "focus" ? sessionMinutes : sessionMinutes) * 60);
  }

  function quickSet(mins) {
    setSessionMinutes(mins);
    setMode("focus");
    setIsRunning(false);
    setTimeLeft(mins * 60);
  }

  const widgetClasses = isDark
    ? "lg:col-span-4 bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl"
    : "lg:col-span-4 bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 shadow-2xl";

  const titleClasses = isDark
    ? "text-lg font-bold text-white"
    : "text-lg font-bold text-gray-900";

  const modeBadgeClasses = isDark
    ? "ml-auto text-sm text-gray-300 px-3 py-1 rounded-full bg-white/5"
    : "ml-auto text-sm text-gray-600 px-3 py-1 rounded-full bg-gray-100";

  const statusTextClasses = isDark
    ? "text-xs text-gray-400 mt-1"
    : "text-xs text-gray-500 mt-1";

  const statsTextClasses = isDark
    ? "text-xs text-gray-400 text-center mt-2"
    : "text-xs text-gray-500 text-center mt-2";

  return (
    <div className={`${widgetClasses} transition-all duration-500`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <h2 className={titleClasses}>Focus Timer</h2>
        <div className={modeBadgeClasses}>
          {mode === "focus" ? "Focus" : "Break"}
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="relative inline-block">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="url(#g)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              className="transition-all duration-700 ease-linear"
            />
            <defs>
              <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-4xl font-mono font-extrabold">
                {minutes}:{seconds}
              </div>
              <div className={statusTextClasses}>
                {isRunning ? "Running" : "Paused"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={startPause}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold flex items-center gap-2"
        >
          {isRunning ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="px-3 py-2 rounded-2xl bg-white/10 border border-white/20 text-sm"
        >
          <RotateCcw className="inline w-4 h-4 mr-1" />
          Reset
        </button>
      </div>

      <div className="flex gap-2 justify-center mb-2">
        <button
          onClick={() => quickSet(15)}
          className={`px-3 py-1 rounded-xl text-sm ${
            sessionMinutes === 15 ? "bg-red-600/80" : "bg-white/5"
          }`}
        >
          15
        </button>
        <button
          onClick={() => quickSet(25)}
          className={`px-3 py-1 rounded-xl text-sm ${
            sessionMinutes === 25 ? "bg-red-600/80" : "bg-white/5"
          }`}
        >
          25
        </button>
        <button
          onClick={() => quickSet(50)}
          className={`px-3 py-1 rounded-xl text-sm ${
            sessionMinutes === 50 ? "bg-red-600/80" : "bg-white/5"
          }`}
        >
          50
        </button>
      </div>

      <div className={statsTextClasses}>
        Focus Sessions:{" "}
        <span
          className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {sessionsCompleted}
        </span>
        {" • "}
        Minutes Focused:{" "}
        <span
          className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {totalFocusMinutes}
        </span>
      </div>
    </div>
  );
}
