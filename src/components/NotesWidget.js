import React, { useState } from "react";
import { StickyNote, X, Plus } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function NotesWidget({ notes, setNotes }) {
  const { isDark } = useTheme();
  const [newNote, setNewNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  function addNote() {
    if (!newNote.trim()) return;
    setNotes([...notes, { id: Date.now(), text: newNote }]);
    setNewNote("");
    setIsModalOpen(false);
  }

  function deleteNote(id) {
    if (!window.confirm("Delete this note?")) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  const widgetClasses = isDark
    ? "lg:col-span-3 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
    : "lg:col-span-3 bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl";

  const titleClasses = isDark
    ? "text-2xl font-bold text-white"
    : "text-2xl font-bold text-gray-900";

  const noteItemClasses = isDark
    ? "flex justify-between items-center p-3 rounded-xl bg-white/10 transition-all duration-300"
    : "flex justify-between items-center p-3 rounded-xl bg-white/80 border border-gray-200 transition-all duration-300";

  const noteTextClasses = isDark ? "text-gray-200" : "text-gray-800";

  const deleteButtonClasses = isDark
    ? "text-gray-400 hover:text-red-400 transition-colors duration-200"
    : "text-gray-500 hover:text-red-500 transition-colors duration-200";

  const emptyTextClasses = isDark
    ? "text-gray-400 text-sm"
    : "text-gray-500 text-sm";

  return (
    <div className={`${widgetClasses} transition-all duration-500`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
          <StickyNote className="w-5 h-5 text-white" />
        </div>
        <h2 className={titleClasses}>Quick Notes</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-auto px-3 py-2 bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {notes.map((note) => (
          <div key={note.id} className={noteItemClasses}>
            <span className={noteTextClasses}>{note.text}</span>
            <button
              onClick={() => deleteNote(note.id)}
              className={deleteButtonClasses}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {notes.length === 0 && (
          <p className={emptyTextClasses}>No notes yet...</p>
        )}
      </div>

      {/* Modal for new note */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div
            className={`p-6 rounded-2xl shadow-xl w-96 transition-all duration-300 ${
              isDark ? "bg-slate-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-lg font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Add New Note
            </h3>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your note..."
              className={`w-full h-32 p-3 rounded-xl border transition-all duration-300 ${
                isDark
                  ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  isDark
                    ? "bg-gray-600 text-white hover:bg-gray-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={addNote}
                className="px-4 py-2 bg-red-600 rounded-xl text-white hover:bg-red-700 transition-all duration-300"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
