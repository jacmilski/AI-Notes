import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { Logout } from '@mui/icons-material'
import useNotesState from '../../store/notesStore'
import { useShallow } from 'zustand/react/shallow'
import { getFilteredAndSortedNotes } from './sidebarUtils'
import supabase from '../../services/supabaseClient'
import useUserState from '../../store/userState'
import AppTitle from '../AppTitle/AppTitle'
import NotesList from '../NotesList/NotesList'

const Sidebar = ({ closeDrawer }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  
  const { user } = useUserState(
    useShallow((state) => ({
      user: state.user,
    }))
  )
  
  const { notes, setNotes, setCurrentNoteTitle, setCurrentNoteContent, setCurrentNotePlainText } = useNotesState(
    useShallow((state) => ({
      notes: state.notes,
      setNotes: state.setNotes,
      setCurrentNoteTitle: state.setCurrentNoteTitle,
      setCurrentNoteContent: state.setCurrentNoteContent,
      setCurrentNotePlainText: state.setCurrentNotePlainText,
    }))
  )

 
  useEffect(() => {

    const fetchNotes = async () => {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
        if (error) throw error
        if (data) {
          setNotes(data)
        }
      } catch (error) {
        setFetchError('Nie udało się pobrać notatek. Spróbuj ponownie.')
      }
    }
    fetchNotes()
  }, [ user, setNotes ])
  

  const [ fetchError, setFetchError ] = useState(null)
  const [ searchNotesInput, setSearchNotesInput ] = useState('')

  const filteredAndSortedNotes = useMemo(
    () => getFilteredAndSortedNotes(notes, searchNotesInput),
    [ notes, searchNotesInput ]
  )
  

  const logOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Błąd wylogowania:', error.message)
    setNotes([])
    setCurrentNoteTitle('')
    setCurrentNoteContent({})
    setCurrentNotePlainText('')
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
      }}
    >
      {!isMobile && <AppTitle variant='h6' sx={{ mb: 2, pt: 1, pb: 2 }} />}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          marginBottom: 3,
        }}
      >
        <Avatar>{user.email.charAt(0).toUpperCase()}</Avatar>
        <Typography noWrap>
          {user.email}
        </Typography>
      </Box>
      <TextField
        label='Wyszukaj notatki'
        type='search'
        size='small'
        fullWidth
        value={searchNotesInput}
        onChange={(e) => setSearchNotesInput(e.target.value)}
        sx={{ marginBottom: 2 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            )
          }
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <Typography variant='subtitle1'>
            Moje notatki
        </Typography>
        <Link
          to='/'
          style={{ textDecoration: 'none' }}
          onClick={closeDrawer}
        >
          <IconButton size='small'>
            <AddIcon />
          </IconButton>
        </Link>
      </Box>

      {fetchError
        ? (
          <Typography variant='body2' sx={{ p: 2, color: 'error.main' }}>
            {fetchError}
          </Typography>
        )
        : (
          <NotesList
            notes={filteredAndSortedNotes}
            closeDrawer={closeDrawer}
          />
        )
      }
      <Divider sx={{ marginBottom: 2 }}/>
      <Button
        variant='outlined'
        color='error'
        startIcon={<Logout />}
        fullWidth
        onClick={logOut}
      >
        Wyloguj
      </Button>
    </Box>
  )
}

export default Sidebar
