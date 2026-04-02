import { useParams } from 'react-router'
import { Typography } from '@mui/material'
import { Virtuoso } from 'react-virtuoso'
import NoteItem from '../NoteItem/NoteItem'

const NotesList = ({ notes, closeDrawer }) => {
  const { id: currentNoteId } = useParams()

  if (notes.length === 0) {
    return (
      <Typography variant='body2' sx={{ p: 2, color: '#6b7280' }}>
        Brak notatek
      </Typography>
    )
  }

  return (
    <Virtuoso
      style={{ flexGrow: 1 }}
      data={notes}
      itemContent={(_index, note) => (
        <NoteItem
          note={note}
          isActive={currentNoteId === note.id}
          closeDrawer={closeDrawer}
        />
      )}
    />
  )
}

export default NotesList
