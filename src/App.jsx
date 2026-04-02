import { useEffect, useState } from 'react'
import {
  Box,
  useMediaQuery,
  useTheme,
  Toolbar,
  IconButton,
  Drawer,
  CircularProgress,
  AppBar
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Sidebar from './components/Sidebar/Sidebar'
import Note from './components/Note/Note'
import useUserState from './store/userState'
import supabase from './services/supabaseClient'
import { useShallow } from 'zustand/react/shallow'
import Auth from './components/Auth/Auth'
import AppTitle from './components/AppTitle/AppTitle'



const drawerWidth = 280
const actionBarHeight = 56

function App() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [ drawerOpen, setDrawerOpen ] = useState(false)


  const { user, setUser } = useUserState(
    useShallow((state) => (
      {
        user: state.user,
        setUser: state.setUser
      }
    ))
  )

  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    const { data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [ setUser ])

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const marginTop = isMobile ? `${actionBarHeight}px` : 0

  if (isLoading) {
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
        <CircularProgress size={40}/>
      </Box>
    )
  }

  if (!user) {
    return (
      <Auth />
    )
  }

  return (
    <Box    sx={{ display: 'flex', minHeight: '100dvh' }}>
      {isMobile && (<AppBar
        position='fixed'
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon
              sx={{ fill: '#fafafa' }}
            />
            <AppTitle color='common.white' sx={{ ml: 2, fontSize: '1rem' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      )}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true }
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop,
            height: isMobile ? `calc(100dvh - ${actionBarHeight}px)` : '100dvh',
            overflowY: 'auto',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Sidebar closeDrawer={() => isMobile && setDrawerOpen(false)} />
      </Drawer>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop,
          marginLeft: 0,
          minHeight: '100dvh',
          overflowY: 'auto',
        }}
      >
        <Note />
      </Box>
    </Box>
  )
}

export default App
