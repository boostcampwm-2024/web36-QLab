import { useState } from 'react'
import { Button } from '@/components/ui/button'
import useShellHandlers from '@/hooks/useShellHandler'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-language_tools'
import testQueries from '@/constants/exampleQuery'
import { ExampleQuery } from '@/types/interfaces'

export default function TestQueryTool() {
  const { addShell, updateShell } = useShellHandlers()
  const [selectedQuery, setSelectedQuery] = useState<ExampleQuery | null>(null)
  const [queryInput, setQueryInput] = useState<string>('')

  const handleSelectQuery = (query: ExampleQuery) => {
    setSelectedQuery(query)
    setQueryInput(query.query)
  }

  const handleRunQuery = async () => {
    if (!queryInput) {
      alert('Please write a query first.')
      return
    }

    const { id } = await addShell()
    await updateShell({ id, query: queryInput })
  }

  const onInputChange = (value: string) => {
    setQueryInput(value)
  }

  return (
    <div className="shadow-sm">
      {/* Query List */}
      <div className="mb-4">
        <p
          id="query-list-label"
          className="block flex h-10 items-center border-b border-t bg-secondary pl-3 text-sm font-medium text-muted-foreground transition-colors"
        >
          Select Query
        </p>
        <div
          id="query-list"
          className="space-y-2"
          role="listbox"
          aria-labelledby="query-list-label"
        >
          {testQueries.map((query) => (
            <div
              key={query.id}
              className={`m-3 cursor-pointer rounded border p-2 ${
                selectedQuery === query ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
              onClick={() => handleSelectQuery(query)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelectQuery(query)
                }
              }}
              role="option"
              aria-selected={selectedQuery === query}
              tabIndex={0}
            >
              {query.name}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Query Display */}
      <div className="mb-4">
        <div className="mb-3 block flex h-10 items-center justify-between border-b border-t bg-secondary pl-3 text-sm font-medium text-muted-foreground transition-colors">
          <p id="selected-query-label">Preview / Edit Query</p>
        </div>

        <AceEditor
          mode="sql"
          placeholder="No query selected."
          value={queryInput}
          onChange={onInputChange}
          fontSize={14}
          width="100%"
          height="200px"
          setOptions={{
            highlightActiveLine: true,
            showGutter: false,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            tabSize: 2,
            wrap: true,
          }}
          className="bg-gray-100"
        />
      </div>

      {/* Action Button */}
      <div className="px-4">
        <Button onClick={handleRunQuery} variant="default" className="w-full">
          Add Query
        </Button>
      </div>
    </div>
  )
}
