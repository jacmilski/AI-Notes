import { useEffect, useState } from 'react'
import { Alert, Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import supabase from '../../services/supabaseClient'

const ResetPassword = () => {

  const navigate = useNavigate()

  const [ newPassword, setNewPassword ] = useState('')
  const [ confirmPassword, setConfirmPassword ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [ error, setError ] = useState('')
  const [ success, setSuccess ] = useState(false)

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => navigate('/'), 2000)
    return () => clearTimeout(timer)
  }, [ success, navigate ])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!newPassword) {
      setError('Podaj nowe hasło')
      return
    }
    
    if (newPassword.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setError('Hasła nie są takie same')
      return
    }
    
    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      setSuccess(true)
    } catch (error) {
      setError(error.message || 'Wystąpił błąd podczas aktualizacji hasła. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100dvh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fafafa',
        }}
      >
        <Paper sx={{ p: 4, maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <Typography variant='h5' gutterBottom color='success.main' >
            Twoje hasło zostało zmienione!
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Przekierowujemy Cię do aplikacji...
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <Typography variant='h5' gutterBottom color='success.main' >
            Resetowanie hasła
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3, textAlign: 'center' }}>
            Podaj nowe hasło dla Twojego konta
        </Typography>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component='form' onSubmit={handleSubmit} >
          <TextField
            fullWidth
            label='Nowe hasło'
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin='normal'
            required
            disabled={loading}
          />
          <TextField
            fullWidth
            label='Potwierdź hasło'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin='normal'
            required
            disabled={loading}
          />

          <Button
            type='submit'
            fullWidth
            variant='contained'
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Aktualizuję hasło' : 'Zmień hasło'}
          </Button>

          <Button
            fullWidth
            type='button'
            variant='text'
            disabled={loading}
            onClick={() => navigate('/')}
          >
           Powrót do aplikacji
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
export default ResetPassword
