import { useEffect } from 'react'
import { useParams } from 'react-router'
import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import './tiptap.css'
import useNotesState from '../../store/notesStore'
import { useShallow } from 'zustand/react/shallow'

const Tiptap = () => {

  const { id } = useParams()

  const { notes, setCurrentNoteContent, setCurrentNotePlainText } = useNotesState(
    useShallow((state) => ({
      notes: state.notes,
      setCurrentNoteContent: state.setCurrentNoteContent,
      setCurrentNotePlainText: state.setCurrentNotePlainText,
    }))
  )

  const selectedNote = id ? notes.find((note) => note.id === id) : null

  const editor = useEditor({
    extensions: [ StarterKit, Highlight, Typography ],
    content: '',
    editorProps: {
      attributes: {
        class: 'wrapper',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getJSON()
      const plainText = editor.getText({ blockSeparator: '' })
      setCurrentNoteContent(content)
      setCurrentNotePlainText(plainText)
    }
  })

  useEffect(() => {
    if (selectedNote && editor) {
      editor.commands.setContent(selectedNote.content || '')
    }
    return () => {
      if (editor) {
        editor.commands.clearContent()
      }
    }
  }, [ selectedNote, editor, id ])


  return <EditorContent editor={editor}/>
}

export default Tiptap
