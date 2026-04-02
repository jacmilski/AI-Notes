import supabase from './supabaseClient'

export const fileService = {
  uploadFile: async (file, noteId, userId) => {
    const filePath = `${userId}/${file.name}`

    const { error: storageError } = await supabase.storage
      .from('note_files')
      .upload(filePath, file, { upsert: false })

    if (storageError) throw storageError

    const { data: fileData, error: dbError } = await supabase
      .from('files')
      .insert({
        user_id: userId,
        note_id: noteId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        content_type: file.type,
      })
      .select()
      .single()

    if (dbError) throw dbError

    return { success: true, file: fileData }
  },

  getNoteFiles: async (noteId) => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('note_id', noteId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, files: data }
  },

  getFileUrl: async (filePath) => {
    const { data, error } = await supabase.storage
      .from('note_files')
      .createSignedUrl(filePath, 3600)

    if (error) throw error

    return { success: true, url: data.signedUrl }
  },

  deleteFile: async (fileId, filePath) => {
    const { error: storageError } = await supabase.storage
      .from('note_files')
      .remove([ filePath ])

    if (storageError) throw storageError

    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId)

    if (dbError) throw dbError
    return { success: true }
  },
}
