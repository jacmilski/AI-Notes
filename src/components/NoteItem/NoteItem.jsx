import { memo } from 'react'
import { Link } from 'react-router'
import {
  Box,
  Chip,
  Paper,
  Typography,
} from '@mui/material'

const NoteItem = ({ note, isActive, closeDrawer }) => {

  return (
    <Link
      to={`/${note.id}`}
      style={{ textDecoration: 'none' }}
      onClick={closeDrawer}
    >
      <Paper
        elevation={isActive ? 3 : 1}
        sx={{
          padding: 2,
          margin: '5px 5px 10px 5px',
        }}
      >
        <Typography
          variant='subtitle2'
          sx={{
            marginBottom: 1,
            fontWeight: isActive ? 600 : 500,
            color: isActive ? 'primary.main' : '#1a1a1a',
            fontSize: '0.9rem',
            lineHeight: '1.4',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {note.title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Chip
            label={note.tag}
            size='small'
            sx={{
              backgroundColor: isActive ? 'primary.main' : '#e3f2fd',
              color: isActive ? 'white' : 'primary.main',
              fontWeight: 500,
              fontSize: '0.75rem',
              height: '24px',
              borderRadius: '6px',
              '& .MuiChip-label': {
                padding: '0 8px',
              }
            }}
          />
          <Typography
            variant='caption'
            sx={{
              color: isActive ? 'primary.main' : '#6b7280',
              fontSize: '0.75rem',
              fontWeight: isActive ? 500 : 400,
              flexShrink: 0,
            }}
          >
            {note.updated_at
              ? new Date(note.updated_at).toLocaleDateString('pl-PL', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              })
              : '—'}
          </Typography>
        </Box>
      </Paper>
    </Link>
  )
}

export default memo(NoteItem)
