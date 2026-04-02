import { useState } from 'react'
import { Alert, Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '@mui/material'
import InfoOutlineIcon from '@mui/icons-material/InfoOutline'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useNavigate, useParams } from 'react-router'
import useUserState from '../../store/userState'
import { useShallow } from 'zustand/react/shallow'
import useNotesState from '../../store/notesStore'
import supabase from '../../services/supabaseClient'
import { generateAiContent } from '../../services/aiGoogleStudio'
import { generateTagPrompt } from '../../prompts/prompts'

const ManageNoteButton = ({ onClick, color = 'primary', title, children }) => {
  return (
    <Tooltip title={title}>
      <IconButton color={color} onClick={onClick}>
        {children}
      </IconButton>
    </Tooltip>
  )
}

const ManageNoteButtons = () => {

  const navigate = useNavigate()
  const { id } = useParams()

  const [ isInfoDialogOpen, setIsInfoDialogOpen ] = useState(false)
  const [ isSaving, setIsSaving  ] = useState(false)
  const [ operationError, setOperationError ] = useState('')

  const { user } = useUserState(
    useShallow((state) => ({
      user: state.user,
    }))
  )

  const { addNote, updateNote, removeNote, currentNoteTitle, currentNoteContent, currentNotePlainText } = useNotesState(
    useShallow((state) => ({
      addNote: state.addNote,
      updateNote: state.updateNote,
      removeNote: state.removeNote,
      currentNoteTitle: state.currentNoteTitle,
      currentNoteContent: state.currentNoteContent,
      currentNotePlainText: state.currentNotePlainText,
    }))
  )

  const handleSave = async () => {
    setIsSaving(true)
    let noteTag = 'ogólne'

    if (!id && currentNotePlainText && currentNotePlainText.trim().length > 10) {
      try {
        noteTag = await generateAiContent(generateTagPrompt(currentNotePlainText), 1)
      } catch (error) {
        console.error('Błąd podczas generowania tytułu przez AI:', error.message)
      }
    }

    try {
      if (!id) {
        const newEntry = {
          user_id: user.id,
          title: currentNoteTitle,
          content: currentNoteContent,
          plainTextContent: currentNotePlainText,
          tag: noteTag,
          updated_at: new Date(),
        }
        const { data } = await supabase
          .from('notes')
          .insert([ newEntry ])
          .select()
          .single()

        if (data) {
          addNote(data)
          navigate(`/${data.id}`)
        }
      } else {
        const updatedEntry = {
          user_id: user.id,
          title: currentNoteTitle,
          content: currentNoteContent,
          plainTextContent: currentNotePlainText,
          updated_at: new Date(),
        }
        const { data } = await supabase
          .from('notes')
          .update(updatedEntry)
          .eq('id', id)
          .select()
          .single()

        if (data) {
          updateNote(data)
        }
      }
      
    } catch (error) {
      setOperationError('Nie udało się zapisać notatki. Spróbuj ponownie.')
      console.error('Błąd podczas zapisywania notatki:', error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (error) throw error
      removeNote({ id })
      navigate('/')
    } catch (error) {
      setOperationError('Nie udało się usunąć notatki. Spróbuj ponownie.')
      console.error('Błąd podczas usuwania notatki:', error.message)
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {operationError && (
        <Alert severity='error' onClose={() => setOperationError('')} sx={{ py: 0 }}>
          {operationError}
        </Alert>
      )}
      <ManageNoteButton
        title='Instrukcje markdown'
        onClick={() => {
          setIsInfoDialogOpen(true)
        }}
      >
        <InfoOutlineIcon />
      </ManageNoteButton>
      <ManageNoteButton title='Zapisz notatkę' color='primary' onClick={handleSave}>
        {isSaving
          ? (
            <CircularProgress size={24}/>
          ):(
            <SaveOutlinedIcon />
          )
        }
      </ManageNoteButton>
      {id && (
        <ManageNoteButton title='Usuń notatkę' color='error' onClick={handleDelete}>
          <DeleteOutlinedIcon />
        </ManageNoteButton>
      )}
      <Dialog
        onClose={() => setIsInfoDialogOpen(false)}
        open={isInfoDialogOpen}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>Instrukcje markdown</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {[
              { code: '#', desc: 'Nagłówek H1' },
              { code: '##', desc: 'Nagłówek H2' },
              { code: '###', desc: 'Nagłówek H3' },
              { code: '**tekst**', desc: 'Pogrubienie' },
              { code: '*tekst*', desc: 'Kursywa' },
              { code: '~~tekst~~', desc: 'Przekreślenie' },
              { code: '> tekst', desc: 'Cytat' },
              { code: '- element', desc: 'Lista nieuporządkowana' },
              { code: '1. element', desc: 'Lista numerowana' },
              { code: '`kod`', desc: 'Kod inline' },
              { code: '```kod```', desc: 'Blok kodu' },
            ].map(({ code, desc }) => (
              <Typography key={code} variant='body2'>
                <Box component='span' sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {code}
                </Box>
                {' — '}{desc}
              </Typography>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default ManageNoteButtons
