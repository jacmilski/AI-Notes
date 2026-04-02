import { useEffect, useState } from 'react'
import { Alert, Box, Button, CircularProgress, Dialog } from '@mui/material'
import { fileService } from '../../services/fileService'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'


const FilePreview = ({ file, onClose }) => {

  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState(null)
  const [ fileUrl, setFileUrl ] = useState(null)

  useEffect(() => {
    
    const handleOpen = async () => {
      setLoading(true)
      try {
        const result = await fileService.getFileUrl(file.file_path)
        if (result.success) {
          setFileUrl(result.url)
        }
      } catch (err) {
        setError('Nie można załadować podglądu: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    if (file) {
      handleOpen()
    }
  }, [ file ])

  const handleClose = () => {
    setFileUrl('')
    setError(null)
    setLoading(false)
    onClose()
  }

  // Funkcja renderująca podgląd pliku w zależności od typu zawartości
  const renderPreview = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={24} />
      </Box>
    }

    if (error) {
      return <Alert severity='error'>
        {error}
      </Alert>
    }

    const contentType = file.content_type

    if (contentType?.startsWith('image/')) {
      return (
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <img
            src={fileUrl}
            alt={file.file_name}
            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
          />
        </Box>
      )} else {

      return (
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <iframe
            src={fileUrl}
            title={file.file_name}
            style={{ border: 'none' }}
            width='100%'
            height='60vh'
          />
        </Box>
      )
    }
  }

  if (!file) return null

  const fileContent = renderPreview()

  return (
    <Dialog
      open={!!file}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
      slotProps={{
        paper:{
          sx: { maxHeight: '80vh' }
        }
      }}
    >
      <DialogTitle>
        {file.file_name}
      </DialogTitle>
      <DialogContent>
        {fileContent}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Zamknij
        </Button>
        <Button
          variant='outlined'
          color='primary'
          onClick={() => window.open(fileUrl, '_blank', 'noopener,noreferrer')}
          disabled={!fileUrl}
        >
          Otwórz w nowej karcie
        </Button>
      </DialogActions>
    
    </Dialog>
  )
}

export default FilePreview
