import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Alert, Box, IconButton, InputAdornment, Typography, Tooltip, Input, Divider } from '@mui/material'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import Tiptap from '../TipTap/Tiptap'
import useNotesState from '../../store/notesStore'
import { useShallow } from 'zustand/react/shallow'
import ManageNoteButtons from '../ManageNoteButtons/ManageNoteButtons'
import { generateAiContent } from '../../services/aiGoogleStudio'
import { generateTitlePrompt } from '../../prompts/prompts'
import FileUpload from '../FileUpload/FileUpload'
import { fileService } from '../../services/fileService'


const Note = () => {

  const [ isGeneratingAiContent, setIsGeneratingAiContent ] = useState(false)
  const [ aiTitleError, setAiTitleError ] = useState('')
  const [ files, setFiles ] = useState([])
  const [ filesError, setFilesError ] = useState('')

  const { id } = useParams()
 
  const { notes, currentNoteTitle, setCurrentNoteTitle, currentNotePlainText } = useNotesState(
    useShallow((state) => ({
      notes: state.notes,
      currentNoteTitle: state.currentNoteTitle,
      setCurrentNoteTitle: state.setCurrentNoteTitle,
      currentNotePlainText: state.currentNotePlainText,
    }))
  )

  const selectedNote = notes.find((note) => note.id === id)

  useEffect(() => {
    if (selectedNote) {
      setCurrentNoteTitle(selectedNote.title)
    }
    return () => {
      setCurrentNoteTitle('')
    }
  }, [ id, selectedNote, setCurrentNoteTitle ])

  useEffect(() => {
    if (!id || id === 'undefined') return

    const fetchFiles = async () => {
      try {
        const result = await fileService.getNoteFiles(id)
        if (result.success) {
          setFiles(result.files)
        }
      } catch (error) {
        setFilesError('Nie można pobrać plików.')
      }
    }

    fetchFiles()
  }, [ id ])

  const notificationDate = new Date(selectedNote?.updated_at ?? Date.now()).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const handleTitle = useCallback(async () => {
    const normalizedNotePlainText = currentNotePlainText.trim()

    if (!normalizedNotePlainText) {
      setAiTitleError('Dodaj treść notatki, aby wygenerować tytuł.')
      return
    }

    setIsGeneratingAiContent(true)
    setAiTitleError('')

    try {
      const aiTitle = await generateAiContent(generateTitlePrompt(normalizedNotePlainText))
      setCurrentNoteTitle(aiTitle)
    } catch (error) {
      setAiTitleError('Nie udało się wygenerować tytułu. Spróbuj ponownie.')
      console.error('Błąd podczas generowania tytułu przez AI:', error.message)
    } finally {
      setIsGeneratingAiContent(false)
    }
  }, [ currentNotePlainText, setCurrentNoteTitle ])

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Typography sx={{ color: '#6b7280' }}>
          {notificationDate}
        </Typography>
        <ManageNoteButtons />
      </Box>
      {aiTitleError ? (
        <Alert severity='error' sx={{ marginBottom: 2 }}>
          {aiTitleError}
        </Alert>
      ) : isGeneratingAiContent && (
        <Alert severity='info' sx={{ marginBottom: 2 }}>
          Czekaj, trwa generowanie tytułu przez AI...
        </Alert>)}
      <Box sx={{ marginBottom: 3 }} >
        <Input
          className='titleInput'
          type='text'
          placeholder='Podaj nowy tytuł'
          fullWidth
          value={currentNoteTitle}
          onChange={(e) => {
            setCurrentNoteTitle(e.target.value)
            if (aiTitleError) {
              setAiTitleError('')
            }
          }}
          startAdornment={
            <InputAdornment position='start'>
              <Tooltip title='Wygeneruj tytuł przez AI'>
                <span>
                  <IconButton
                    size='small'
                    color='primary'
                    onClick={handleTitle}
                    disabled={!currentNotePlainText.trim() || isGeneratingAiContent}
                  >
                    <AutoAwesomeOutlinedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          }
        />
      </Box>
      <Tiptap />

      <Box sx={{ mt: 3 }}>
        <Divider sx={{ marginBottom: 2 }}/>
        <Typography variant='h6' gutterBottom>
          Załączniki
        </Typography>

        {filesError && (
          <Alert severity='error' sx={{ marginBottom: 2 }}>
            {filesError}
          </Alert>
        )}
        {id && (
          <FileUpload files={files} onFilesChange={setFiles} />
        )}

        {!id && (
          <Box
            sx={{
              p: 3,
              bgcolor: 'action.hover',
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              Zapisz notatkę, aby dodać załączniki.
            </Typography>
            <Typography variant='caption' color='text.secondary' sx={{ mt: 1 , display: 'block' }}>
              Upload plików jest dostępny po pierwszym zapisaniu notatki.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Note
