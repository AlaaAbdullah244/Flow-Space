import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function AnimatedBackground() {
  const { isDark } = useTheme();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        }`}
      />

      {/* Animated gradient overlays */}
      <div
        className={`absolute inset-0 opacity-30 animate-pulse-slow ${
          isDark
            ? "bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20"
            : "bg-gradient-to-tr from-purple-200/30 via-transparent to-blue-200/30"
        }`}
        style={{
          animation: "gradientShift 8s ease-in-out infinite",
        }}
      />

      {/* Additional moving gradient layer */}
      <div
        className={`absolute inset-0 opacity-20 ${
          isDark
            ? "bg-gradient-to-bl from-red-900/10 via-transparent to-green-900/10"
            : "bg-gradient-to-bl from-red-200/20 via-transparent to-green-200/20"
        }`}
        style={{
          animation: "gradientShift 12s ease-in-out infinite reverse",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-20 ${
              isDark ? "bg-white/10" : "bg-gray-400/20"
            }`}
            style={{
              width: Math.random() * 4 + 2 + "px",
              height: Math.random() * 4 + 2 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: Math.random() * 10 + "s",
            }}
          />
        ))}
      </div>

      {/* Animated orbs */}
      <div className="absolute inset-0">
        <div
          className={`absolute rounded-full blur-xl opacity-20 ${
            isDark ? "bg-red-500" : "bg-blue-400"
          }`}
          style={{
            width: "300px",
            height: "300px",
            left: "10%",
            top: "20%",
            animation: "orbFloat1 15s ease-in-out infinite",
          }}
        />
        <div
          className={`absolute rounded-full blur-xl opacity-15 ${
            isDark ? "bg-purple-500" : "bg-indigo-400"
          }`}
          style={{
            width: "200px",
            height: "200px",
            right: "15%",
            top: "60%",
            animation: "orbFloat2 20s ease-in-out infinite",
          }}
        />
        <div
          className={`absolute rounded-full blur-xl opacity-10 ${
            isDark ? "bg-blue-500" : "bg-purple-400"
          }`}
          style={{
            width: "150px",
            height: "150px",
            left: "60%",
            top: "10%",
            animation: "orbFloat3 12s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
