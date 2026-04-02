import React, { useState } from 'react'
import { Alert, Box, Button, Card, CardContent, CircularProgress, Divider, Link, TextField, Typography } from '@mui/material'
import supabase from '../../services/supabaseClient'

const Auth = () => {

  const [ loading, setLoading ] = useState(false)

  const [ isLogin, setIsLogin ] = useState(true)
  const [ message, setMessage ] = useState('')
  const [ error, setError ] = useState('')

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const [ showEmailError, setShowEmailError ] = useState(false)
  const [ showPasswordError, setShowPasswordError ] = useState(false)

  const isEmailValid = email.includes('@') && email.includes('.')
  const isPasswordValid = password.length >= 6
  const isFormValid = isEmailValid && isPasswordValid

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setShowEmailError(false)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setShowPasswordError(false)
  }
  const handleEmailBlur = () => {
    if (email.length > 0) {
      setShowEmailError(!isEmailValid)
    }
  }

  const handlePasswordBlur = () => {
    if (password.length > 0) {
      setShowPasswordError(!isPasswordValid)
    }
  }

  
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
       
        if (error) throw error

      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
       
        if (error) throw error
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }

  }
    
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Wprowadź adres email aby zresetować hasło!')
      return
    }
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      setMessage('Link do resetowania hasła został wysłany na Twój email!')

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
        padding: 2,
      }}>
      <Card sx={{ maxWidth: 420, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant='body1' sx={{ textAlign: 'center', color: 'text.primary', mb: 2 }}>
               AI Notes
          </Typography>
          <Typography variant='body2' sx={{ textAlign: 'center', mb: 3 }}>
            {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
          </Typography>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity='success' sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              disabled={loading}
              error={showEmailError}
              helperText={showEmailError ? 'Wprowadź prawidłowy adres email!' : ''}
              sx={{ mb: 2 }}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              id='password'
              label='Password'
              name='password'
              type='password'
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              disabled={loading}
              error={showPasswordError}
              helperText={showPasswordError ? 'Wprowadź prawidłowe hasło!' : ''}
              sx={{ mb: 2 }}
            />
            <Button
              sx={{ mt: 1, mb: 2, py: 1.5 }}
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              disabled={loading || !isFormValid}
            >
              {loading ?
                (   <CircularProgress size={24} color='inherit' />
                ) : (
                  isLogin ? 'Zaloguj się' : 'Zarejestruj się'
                )}
            </Button>

            {isLogin &&
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Link
                  component='button'
                  type='button'
                  variant='body2'
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  Zapomniałeś hasła?
                </Link>
              </Box>
            }

            <Divider sx={{ my: 3 }}>
              <Typography variant='body2' color='text.secondary' sx={{ px: 2 }}>
                    lub
              </Typography>
            </Divider>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                {isLogin ? 'Nie masz konta?' : 'Masz już konto?'}
              </Typography>

              <Button
                type='button'
                variant='text'
                color='primary'
                onClick={() => {
                  setIsLogin(!isLogin)
                  setMessage('')
                  setError('')
                  setEmail('')
                  setPassword('')
                  setShowEmailError(false)
                  setShowPasswordError(false)
                }}
                disabled={loading}
              >
                {isLogin ? 'Utwórz konto' : 'Zaloguj się'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Auth
