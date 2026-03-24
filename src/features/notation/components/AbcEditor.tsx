import React from 'react'
import Editor from '@monaco-editor/react'

interface AbcEditorProps {
  value: string
  onChange: (value: string) => void
  darkMode?: boolean
  height?: string
  className?: string
}

const abcLanguage = {
  defaultToken: '',
  tokenPostfix: '.abc',
  keywords: [
    'X',
    'T',
    'C',
    'M',
    'L',
    'K',
    'Q',
    'P',
    'Z',
    'N',
    'G',
    'H',
    'B',
    'D',
    'S',
    'F',
    'O',
    'R',
    'r',
    'I',
    'V',
    'W',
    'w',
  ],
  notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'z', 'Z', 'x', 'X'],
  tokenizer: {
    root: [
      [/^[A-Za-z]:.*$/, 'keyword'],
      [/%.*$/, 'comment'],
      [/\|:?|\|\||\|]|:\|/, 'delimiter'],
      [/[\^_=]/, 'operator'],
      [/[A-Ga-g][,']*\d*/, 'variable'],
      [/[zZxX]\d*/, 'string'],
      [/\[/, 'bracket', '@chord'],
      [/![^!]+!/, 'annotation'],
      [/\(\d/, 'number'],
      [/\d+/, 'number'],
      [/[-()]/, 'delimiter'],
      [/\s+/, 'white'],
    ],
    chord: [
      [/[A-Ga-g][,']*\d*/, 'variable'],
      [/[\^_=]/, 'operator'],
      [/\]/, 'bracket', '@pop'],
      [/./, 'variable'],
    ],
  },
}

export const AbcEditor: React.FC<AbcEditorProps> = ({
  value,
  onChange,
  darkMode = false,
  height = '300px',
  className = '',
}) => {
  const handleEditorMount = (_editor: unknown, monaco: typeof import('monaco-editor')) => {
    monaco.languages.register({ id: 'abc' })
    monaco.languages.setMonarchTokensProvider(
      'abc',
      abcLanguage as Parameters<typeof monaco.languages.setMonarchTokensProvider>[1]
    )

    monaco.editor.defineTheme('abc-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '0066cc', fontStyle: 'bold' },
        { token: 'comment', foreground: '008800', fontStyle: 'italic' },
        { token: 'variable', foreground: 'cc6600' },
        { token: 'string', foreground: 'aa00aa' },
        { token: 'number', foreground: '009999' },
        { token: 'operator', foreground: 'cc0000' },
        { token: 'delimiter', foreground: '666666' },
        { token: 'bracket', foreground: '0000cc' },
        { token: 'annotation', foreground: '666666', fontStyle: 'italic' },
      ],
      colors: {},
    })

    monaco.editor.defineTheme('abc-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '66bbff', fontStyle: 'bold' },
        { token: 'comment', foreground: '66cc66', fontStyle: 'italic' },
        { token: 'variable', foreground: 'ffaa66' },
        { token: 'string', foreground: 'ff66ff' },
        { token: 'number', foreground: '66cccc' },
        { token: 'operator', foreground: 'ff6666' },
        { token: 'delimiter', foreground: 'aaaaaa' },
        { token: 'bracket', foreground: '6666ff' },
        { token: 'annotation', foreground: 'aaaaaa', fontStyle: 'italic' },
      ],
      colors: {},
    })
  }

  return (
    <div className={`abc-editor ${className}`}>
      <Editor
        height={height}
        theme={darkMode ? 'abc-dark' : 'abc-light'}
        language="abc"
        value={value}
        options={{
          automaticLayout: true,
          fontSize: 14,
          fontFamily: '"Fira Code", monospace',
          wordWrap: 'on',
          minimap: { enabled: false },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          renderLineHighlight: 'line',
          tabSize: 2,
        }}
        onMount={handleEditorMount}
        onChange={(newValue) => {
          if (newValue !== undefined) {
            onChange(newValue)
          }
        }}
      />
    </div>
  )
}

export default AbcEditor
