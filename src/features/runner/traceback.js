/**
 * Traceback Parser for Pyodide/Python error output
 */

const USER_FILE_MARKER = '<user-code>'

/**
 * Filter out internal Pyodide/Python frames and extract structured error information.
 *
 * @param {string} rawTraceback - Full traceback string from Python/Pyodide
 * @param {string} [userFile=USER_FILE_MARKER] - Filename used when compiling user code
 * @returns {{ type: string, message: string, line: number | null, traceback: string }}
 */
export function parseTraceback(rawTraceback, userFile = USER_FILE_MARKER) {
  if (!rawTraceback || typeof rawTraceback !== 'string') {
    return {
      type: 'Error',
      message: '',
      line: null,
      traceback: '',
    }
  }

  const lines = rawTraceback.trim().split(/\r?\n/)
  if (lines.length === 0) {
    return {
      type: 'Error',
      message: '',
      line: null,
      traceback: '',
    }
  }

  // 1. Extract error type and message from the last line (e.g. "NameError: name 'x' is not defined")
  let lastLineIndex = lines.length - 1
  while (lastLineIndex >= 0 && !lines[lastLineIndex].trim()) {
    lastLineIndex--
  }

  const errorLine = lines[lastLineIndex] || ''
  const errorMatch = errorLine.match(/^([a-zA-Z_][a-zA-Z0-9_.]*(?:Error|Exception|Exit|Interrupt)?)(?::\s*(.*))?$/)

  let type = 'Error'
  let message = errorLine

  if (errorMatch) {
    type = errorMatch[1]
    message = errorMatch[2] !== undefined ? errorMatch[2].trim() : ''
  }

  // 2. Scan lines to find user code line numbers and filter internal frames
  let userLine = null
  const cleanedLines = []
  let isInsideTraceback = false
  let skippingInternalFrame = false

  // Regex to detect a frame start: File "...", line 123, in foo
  const frameRegex = /^\s*File\s+"([^"]+)",\s+line\s+(\d+)(?:,\s+in\s+(.+))?/

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('Traceback (most recent call last):')) {
      isInsideTraceback = true
      cleanedLines.push(line)
      continue
    }

    const frameMatch = line.match(frameRegex)
    if (frameMatch) {
      const filename = frameMatch[1]
      const lineno = parseInt(frameMatch[2], 10)

      const isUserCode = filename === userFile || filename.includes('<user-code>')

      if (isUserCode) {
        userLine = lineno
        skippingInternalFrame = false
        cleanedLines.push(line)
      } else if (isInsideTraceback) {
        // Frame is internal (e.g. /lib/python3.14/... or _pyodide)
        skippingInternalFrame = true
      } else {
        // SyntaxError might not have a Traceback header
        cleanedLines.push(line)
      }
      continue
    }

    if (skippingInternalFrame) {
      // If next line starts with whitespace and is part of the code snippet of the internal frame, skip it
      if (line.startsWith('  ') && !line.match(/^[a-zA-Z_]/)) {
        continue
      }
      // Reached the end of internal frame snippet
      skippingInternalFrame = false
    }

    cleanedLines.push(line)
  }

  // If userLine was not found via standard frames, try looking for `File "<user-code>", line X` anywhere
  if (userLine === null) {
    const fallbackMatch = rawTraceback.match(/line\s+(\d+)/)
    if (fallbackMatch) {
      userLine = parseInt(fallbackMatch[1], 10)
    }
  }

  const cleanedTraceback = cleanedLines.join('\n').trim()

  return {
    type,
    message,
    line: userLine,
    traceback: cleanedTraceback || rawTraceback,
  }
}
