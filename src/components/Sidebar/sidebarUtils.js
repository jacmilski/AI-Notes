const getNoteUpdateTimestamp = (note) => {
  const noteUpdateAt = note?.updated_at

  if (!noteUpdateAt) {
    return 0
  }

  const timestamp = new Date(noteUpdateAt).getTime()

  if (Number.isNaN(timestamp)) {
    return 0
  }

  return timestamp
}

export const getFilteredAndSortedNotes = (notes, searchNotesInput) => {
  const normalizedSearchValue = searchNotesInput.trim().toLowerCase()

  const filteredNotes = notes.filter((note) => {
    if (!normalizedSearchValue) {
      return true
    }

    const noteTitle = note.title ?? ''

    return noteTitle.toLowerCase().includes(normalizedSearchValue)
  })

  const sortedNotes = filteredNotes.sort((firstNote, secondNote) => {
    const firstNoteTimestamp = getNoteUpdateTimestamp(firstNote)
    const secondNoteTimestamp = getNoteUpdateTimestamp(secondNote)

    return secondNoteTimestamp - firstNoteTimestamp
  })

  return sortedNotes
}
