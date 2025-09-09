import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  CheckCircle,
  Clock,
  StickyNote,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

/**
 props:
  - todos
  - sessionsCompleted
  - totalFocusMinutes
  - notesCount
*/
export default function StatsWidget({
  todos = [],
  sessionsCompleted = 0,
  totalFocusMinutes = 0,
  notesCount = 0,
}) {
  const { isDark } = useTheme();
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [animatedSessions, setAnimatedSessions] = useState(0);
  const [animatedMinutes, setAnimatedMinutes] = useState(0);
  const [animatedNotes, setAnimatedNotes] = useState(0);

  const completed = todos.filter((t) => t.completed).length;
  const total = todos.length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Calculate additional metrics
  const highPriorityTasks = todos.filter((t) => t.priority === "high").length;
  const completedHighPriority = todos.filter(
    (t) => t.priority === "high" && t.completed
  ).length;
  const averageSessionLength =
    sessionsCompleted > 0
      ? Math.round(totalFocusMinutes / sessionsCompleted)
      : 0;
  const productivityScore = Math.min(
    100,
    Math.round(progressPercent * 0.4 + sessionsCompleted * 5 + notesCount * 2)
  );

  // streak calculation (simplified)
  const streak = Math.min(7, Math.floor(sessionsCompleted / 1));

  // Animate numbers on mount and when values change
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercent);
      setAnimatedSessions(sessionsCompleted);
      setAnimatedMinutes(totalFocusMinutes);
      setAnimatedNotes(notesCount);
    }, 300);
    return () => clearTimeout(timer);
  }, [progressPercent, sessionsCompleted, totalFocusMinutes, notesCount]);

  // circle setup for progress
  const size = 100;
  const half = size / 2;
  const radius = half - 8;
  const circumference = 2 * Math.PI * radius;
  const completedDash = (animatedProgress / 100) * circumference;

  // dynamic colors
  const progressColor =
    animatedProgress > 70
      ? "#22c55e"
      : animatedProgress > 40
      ? "#f97316"
      : "#ef4444";

  const productivityColor =
    productivityScore > 80
      ? "#22c55e"
      : productivityScore > 60
      ? "#f97316"
      : productivityScore > 40
      ? "#eab308"
      : "#ef4444";

  const widgetClasses = isDark
    ? "bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
    : "bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200";

  const titleClasses = isDark
    ? "text-xl font-bold text-white"
    : "text-xl font-bold text-gray-900";

  // const summaryClasses = isDark
  //   ? "text-sm text-gray-400"
  //   : "text-sm text-gray-500";

  const cardClasses = isDark
    ? "p-4 bg-white/3 rounded-xl text-center border border-white/10 hover:bg-white/5 transition-all duration-300"
    : "p-4 bg-white/50 rounded-xl text-center border border-gray-200 hover:bg-white/70 transition-all duration-300";

  const labelClasses = isDark
    ? "text-xs text-gray-400"
    : "text-xs text-gray-500";

  const largeValueClasses = isDark
    ? "text-3xl font-black text-white"
    : "text-3xl font-black text-gray-900";

  const iconClasses = isDark ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`${widgetClasses} transition-all duration-500`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isDark ? "bg-white/10" : "bg-gray-100"
            }`}
          >
            <TrendingUp className={`w-5 h-5 ${iconClasses}`} />
          </div>
          <h3 className={titleClasses}>Productivity Dashboard</h3>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            productivityScore > 80
              ? "bg-green-100 text-green-800"
              : productivityScore > 60
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          Score: {productivityScore}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Task Progress Circle */}
        <div
          className={`${cardClasses} flex flex-col items-center justify-center`}
        >
          <div className="flex items-center justify-center mb-3">
            <CheckCircle className={`w-6 h-6 ${iconClasses}`} />
          </div>
          <div className="w-24 h-24 mb-4 relative flex items-center justify-center">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="absolute"
            >
              <circle
                cx={half}
                cy={half}
                r={radius}
                fill="none"
                stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                strokeWidth="6"
              />
              <circle
                cx={half}
                cy={half}
                r={radius}
                fill="none"
                stroke={progressColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${completedDash} ${
                  circumference - completedDash
                }`}
                transform={`rotate(-90 ${half} ${half})`}
                style={{
                  transition: "stroke-dasharray 1.5s ease-out",
                  strokeDashoffset: circumference,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {animatedProgress}%
              </span>
            </div>
          </div>
          <div className={`${labelClasses} text-center mb-1`}>
            Tasks Completed
          </div>
          <div
            className={`text-sm font-medium text-center ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {completed} of {total}
          </div>
        </div>

        {/* Focus Sessions */}
        <div className={cardClasses}>
          <div className="flex items-center justify-center mb-3">
            <Clock className={`w-6 h-6 ${iconClasses}`} />
          </div>
          <div className={largeValueClasses}>{animatedSessions}</div>
          <div
            className={`text-sm ${
              isDark ? "text-gray-300" : "text-gray-600"
            } mb-1`}
          >
            Focus Sessions
          </div>
          <div className={labelClasses}>{animatedMinutes} min total</div>
          {averageSessionLength > 0 && (
            <div
              className={`text-xs mt-1 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Avg: {averageSessionLength}min
            </div>
          )}
        </div>

        {/* Notes */}
        <div className={cardClasses}>
          <div className="flex items-center justify-center mb-3">
            <StickyNote className={`w-6 h-6 ${iconClasses}`} />
          </div>
          <div className={largeValueClasses}>{animatedNotes}</div>
          <div
            className={`text-sm ${
              isDark ? "text-gray-300" : "text-gray-600"
            } mb-1`}
          >
            Notes Created
          </div>
          <div className={labelClasses}>Knowledge captured</div>
        </div>

        {/* Productivity Score */}
        <div className={cardClasses}>
          <div className="flex items-center justify-center mb-3">
            <Zap className={`w-6 h-6 ${iconClasses}`} />
          </div>
          <div
            className={`text-3xl font-black`}
            style={{ color: productivityColor }}
          >
            {productivityScore}
          </div>
          <div
            className={`text-sm ${
              isDark ? "text-gray-300" : "text-gray-600"
            } mb-1`}
          >
            Productivity Score
          </div>
          <div className={labelClasses}>Overall performance</div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* High Priority Tasks */}
        <div
          className={`p-4 rounded-xl ${
            isDark ? "bg-white/3" : "bg-white/40"
          } border ${isDark ? "border-white/10" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className={`w-4 h-4 ${iconClasses}`} />
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                High Priority
              </span>
            </div>
            <span
              className={`text-lg font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {completedHighPriority}/{highPriorityTasks}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-1000"
              style={{
                width:
                  highPriorityTasks > 0
                    ? `${(completedHighPriority / highPriorityTasks) * 100}%`
                    : "0%",
              }}
            />
          </div>
        </div>

        {/* Streak */}
        <div
          className={`p-4 rounded-xl ${
            isDark ? "bg-white/3" : "bg-white/40"
          } border ${isDark ? "border-white/10" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Streak
              </span>
            </div>
            <span
              className={`text-lg font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {streak} days
            </span>
          </div>
          <div
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            Keep it up! 💪
          </div>
        </div>

        {/* Quick Stats */}
        <div
          className={`p-4 rounded-xl ${
            isDark ? "bg-white/3" : "bg-white/40"
          } border ${isDark ? "border-white/10" : "border-gray-200"}`}
        >
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-1`}
            >
              {total > 0 ? Math.round((completed / total) * 100) : 0}%
            </div>
            <div
              className={`text-xs ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Completion Rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
