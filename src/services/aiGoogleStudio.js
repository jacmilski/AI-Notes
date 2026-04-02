import { GoogleGenAI } from '@google/genai'

// The client gets the API key from the environment variable `VITE_GEMINI_API_KEY`.
export const ai = new GoogleGenAI({
  apiKey: `${import.meta.env.VITE_GEMINI_API_KEY}`
})

const sanitizeGeneratedTitle = (generatedTitle, maxWords = 3) => {
  const normalizedTitle = generatedTitle
    .replace(/[\r\n]+/g, ' ')
    .replace(/["'`]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const shortenedTitle = normalizedTitle
    .split(' ')
    .filter(Boolean)
    .slice(0, maxWords)
    .join(' ')
    .trim()

  return shortenedTitle
}

export const generateAiContent = async (prompt, maxWords = 3) => {
  try {
    const normalizedPrompt = prompt.trim()

    if (!normalizedPrompt) {
      throw new Error('Brakuje treści do wygenerowania odpowiedzi przez AI.')
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: normalizedPrompt,
      config: {
        // stopSequences: [ '\n\n' ],
        thinking: {
          enabled: false,
        },
      },
    })

    const sanitizedTitle = sanitizeGeneratedTitle(response.text ?? '', maxWords)

    if (!sanitizedTitle) {
      throw new Error('Model nie zwrócił poprawnego tytułu.')
    }

    return sanitizedTitle
  } catch (error) {
    console.error('Błąd generowania treści przez AI:', error)
    throw error
  }
}



