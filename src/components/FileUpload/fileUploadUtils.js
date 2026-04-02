export const formatFileSize = (bytes) => {
  const parsedBytes = Number(bytes)

  if (!Number.isFinite(parsedBytes) || parsedBytes < 0) {
    return '0 B'
  }

  if (parsedBytes < 1024) {
    return `${parsedBytes} B`
  }

  if (parsedBytes < 1024 * 1024) {
    return `${(parsedBytes / 1024).toFixed(2)} KB`
  }

  return `${(parsedBytes / (1024 * 1024)).toFixed(2)} MB`
}
