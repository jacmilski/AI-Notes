import { useState } from 'react'
import { Box, Button, IconButton, List, ListItem, Typography } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ListItemText from '@mui/material/ListItemText'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete'
import { formatFileSize } from './fileUploadUtils'
import FilePreview from '../FilePreview/FilePreview'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { fileService } from '../../services/fileService'
import { useParams } from 'react-router'
import useUserState from '../../store/userState'
import { useShallow } from 'zustand/react/shallow'


const FileUpload = ({ files, onFilesChange }) => {
  const { id } = useParams()

  const { user } = useUserState(
    useShallow((state) => ({
      user: state.user,
    }))
  )

  const [ isUpLoading, setIsUpLoading ] = useState(false)
  const [ error, setError ] = useState(null)
  const [ previewFile, setPreviewFile ] = useState(null)

  const handleFileUpload = async (event) => {
    setIsUpLoading(true)
    const file = event.target.files[0]

    try {
      const uploadedFile = await fileService.uploadFile(file, id, user.id)
      if (uploadedFile.success) {
        onFilesChange([ ...files, uploadedFile.file ])
      }
    } catch (error) {
      setError('Nie można załadować pliku: ' + error.message)
    } finally {
      setIsUpLoading(false)
    }
  }


  const handleFileOpen = async (file) => {
    try {
      const result = await fileService.getFileUrl(file.file_path)
      if (result.success) {
        window.open(result.url, '_blank')
      }
    } catch (error) {
      setError('Nie można otworzyć pliku: ' + error.message)
    }
  }

  const handleFileDelete = async (file) => {
    try {
      const result = await fileService.deleteFile(file.id, file.file_path)
      if (result.success) {
        onFilesChange(files.filter((f) => f.id !== file.id))
      }
    } catch (error) {
      setError('Nie można usunąć pliku: ' + error.message)
    }
  }


  return (
    <Box>
      <Button
        variant='outlined'
        component='label'
        size='small'
        startIcon={isUpLoading ? <CircularProgress size={16} /> : <AttachFileIcon />}
      >
        {isUpLoading ? 'Wysyłanie...' : 'Załącz plik'}
        <input
          type='file'
          hidden
          onChange={handleFileUpload}
          accept='.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png'
        />

      </Button>
      {error && (
        <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {files?.length === 0 && (
        <Typography variant='body2' color='text.secondary' sx={{ fontStyle: 'italic' }}>
          Brak załączników
        </Typography>
      )}

      {files?.length > 0 && (
        <List dense sx={{ mt: 2 }}>
          {files.map((file) => (
            <ListItem
              key={file.id}
              divider
              secondaryAction={
                <Box>
                  <IconButton
                    size='small'
                    title='Podgląd pliku'
                    onClick={() => setPreviewFile(file)}
                  >
                    <VisibilityIcon fontSize='small' />
                  </IconButton>
                  <IconButton size='small' title='Otwórz plik w nowej karcie' onClick={() => handleFileOpen(file)}>
                    <DownloadIcon fontSize='small' />
                  </IconButton>
                  <IconButton size='small' title='Usuń plik' color='error' onClick={() => handleFileDelete(file)}>
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText primary={file.file_name} secondary={formatFileSize(file.file_size)} />
            </ListItem>
          ))}
        </List>
      )}
      <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
    </Box>
  )
}

export default FileUpload
