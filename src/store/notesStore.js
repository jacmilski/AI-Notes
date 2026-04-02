import { create } from 'zustand'

const useNotesState = create((set) => ({
  notes: [],
  currentNoteTitle: '',
  currentNoteContent: {},
  currentNotePlainText: '',

  addNote: (newNote) => set((state) => ({ notes: [ ...state.notes, newNote ]})),
  updateNote: (updatedNote) => set((state) => ({
    notes: state.notes.map(note => note.id === updatedNote.id ? { ...note, ...updatedNote } : note)
  })),
  removeNote: (deleteNote) => set((state) => ({
    notes: state.notes.filter(note => note.id !== deleteNote.id)
  })),

  setNotes: (newNotes) => set({ notes: newNotes }),
  setCurrentNoteTitle: (newTitle) => set({ currentNoteTitle: newTitle }),
  setCurrentNoteContent: (newContent) => set({ currentNoteContent: newContent }),
  setCurrentNotePlainText: (newPlainText) => set({ currentNotePlainText: newPlainText }),

}))

export default useNotesState

