import { useState } from "react";
import { Plus, X, CheckCircle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function TodoWidget({ todos, setTodos, completedCount }) {
  const { isDark } = useTheme();
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("medium");

  function addTodo() {
    if (!input.trim()) return;
    const newTodos = [
      ...todos,
      { id: Date.now(), text: input.trim(), completed: false, priority },
    ];
    setTodos(newTodos);
    setInput("");
    setPriority("medium");
  }

  function toggleTodo(id) {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
  }

  function deleteTodo(id) {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);
  }

  function progress() {
    return todos.length > 0 ? (completedCount / todos.length) * 100 : 0;
  }

  const widgetClasses = isDark
    ? "lg:col-span-5 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
    : "lg:col-span-5 bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl";

  const inputClasses = isDark
    ? "w-full sm:flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400"
    : "w-full sm:flex-1 px-4 py-3 rounded-2xl bg-white/80 border border-gray-300 text-gray-900 placeholder-gray-500";

  const selectClasses = isDark
    ? "w-full sm:w-auto px-3 py-2 rounded-2xl bg-white/10 border border-white/20 text-sm text-white"
    : "w-full sm:w-auto px-3 py-2 rounded-2xl bg-white/80 border border-gray-300 text-sm text-gray-900";

  const progressBgClasses = isDark
    ? "w-full bg-white/10 rounded-full h-3 mb-6"
    : "w-full bg-gray-200 rounded-full h-3 mb-6";

  const textClasses = isDark
    ? "text-sm text-gray-400 mb-4"
    : "text-sm text-gray-600 mb-4";

  return (
    <div className={`${widgetClasses} transition-all duration-500`}>
      {/* Input */}
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a new task..."
          className={inputClasses}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className={selectClasses}
        >
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
        <button
          onClick={addTodo}
          className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold sm:shrink-0 hover:from-red-700 hover:to-red-800 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Progress */}
      <div className={progressBgClasses}>
        <div
          className="h-3 rounded-full bg-gradient-to-r from-red-500 to-red-700 transition-all"
          style={{ width: `${progress()}%` }}
        />
      </div>
      <p className={textClasses}>
        {completedCount} of {todos.length} tasks completed
      </p>

      {/* Todo List */}
      <ul className="space-y-3">
        {todos.map((todo) => {
          const todoItemClasses = isDark
            ? `flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-300 ${
                todo.completed
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-white/5 border-white/10"
              }`
            : `flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-300 ${
                todo.completed
                  ? "bg-green-100 border-green-300"
                  : "bg-white/80 border-gray-200"
              }`;

          const textClasses = isDark
            ? `font-medium ${
                todo.completed ? "line-through text-gray-400" : "text-white"
              }`
            : `font-medium ${
                todo.completed ? "line-through text-gray-500" : "text-gray-900"
              }`;

          const deleteButtonClasses = isDark
            ? "text-gray-400 hover:text-red-400 transition-colors duration-200"
            : "text-gray-500 hover:text-red-500 transition-colors duration-200";

          return (
            <li key={todo.id} className={todoItemClasses}>
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => toggleTodo(todo.id)}
              >
                <CheckCircle
                  className={`w-5 h-5 ${
                    todo.completed
                      ? "text-green-400"
                      : isDark
                      ? "text-gray-500"
                      : "text-gray-400"
                  }`}
                />
                <span className={textClasses}>{todo.text}</span>
                <span
                  className={`ml-2 text-xs px-2 py-1 rounded-xl ${
                    todo.priority === "high"
                      ? "bg-red-600/20 text-red-400"
                      : todo.priority === "medium"
                      ? "bg-yellow-600/20 text-yellow-400"
                      : "bg-green-600/20 text-green-400"
                  }`}
                >
                  {todo.priority}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className={deleteButtonClasses}
              >
                <X className="w-5 h-5" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
