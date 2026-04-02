import { Typography } from '@mui/material'

const AppTitle = ({ variant = 'body1', color = 'primary.main', sx = {}}) => {
  return (
    <Typography noWrap variant={variant} color={color} sx={sx}>
      AI NOTES
    </Typography>
  )
}

export default AppTitle
