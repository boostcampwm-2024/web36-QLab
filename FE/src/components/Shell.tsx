import { useState, useRef } from 'react'
import PlayCircle from '@/assets/play_circle.svg'
import { ShellType } from '@/types/interfaces'
import { useExecuteShell } from '@/hooks/useShellQuery'
import generateKey from '@/util'
import { X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ShellProps {
  shell: ShellType
  removeShell: (id: number) => void
  updateShell: (shell: ShellType) => void
  focusedShell: number | null
  setFocusedShell: React.Dispatch<React.SetStateAction<number | null>>
}

export default function Shell({
  shell,
  removeShell,
  updateShell,
  focusedShell,
  setFocusedShell,
}: ShellProps) {
  const { id, queryStatus, query, text, resultTable } = shell

  const [inputValue, setInputValue] = useState(query ?? '')
  const prevQueryRef = useRef<string>('')
  const executeShellMutation = useExecuteShell()

  const handleBlur = () => {
    if (inputValue === prevQueryRef.current) return
    updateShell({ ...shell, query: inputValue })
    prevQueryRef.current = inputValue
  }

  const handleClick = () => {
    if (!id) return
    executeShellMutation.mutate(shell)
  }

  return (
    <>
      <div className="flex h-12 w-full items-center overflow-hidden rounded-sm bg-secondary">
        <button
          type="button"
          className="mr-3 h-full w-12 bg-primary p-3"
          onClick={handleClick}
        >
          <img src={PlayCircle} alt="play button" />
        </button>
        <input
          type="text"
          defaultValue={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setFocusedShell(id || null)} // 추후 로직 제거?
          onBlur={handleBlur}
          className="h-8 w-full border-none bg-secondary p-2 text-base font-medium text-foreground focus:outline-none"
        />
        {focusedShell === id && id != null && (
          <X className="mr-3 fill-current" onClick={() => removeShell(id)} />
        )}
      </div>
      {text && ( // 쉘 실행 결과가 있는가?
        <div className="flex w-full flex-col overflow-hidden overflow-x-auto rounded-sm bg-secondary">
          <p
            className={`m-3 ${queryStatus ? 'text-green-500' : 'text-red-500'}`}
          >
            {text}
          </p>
          {resultTable &&
            resultTable?.length > 0 && ( // 결과 테이블이 있는지
              <>
                <Table className="m-3">
                  <TableHeader>
                    <TableRow>
                      {Object.keys(resultTable[0])?.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultTable.map((row) => (
                      <TableRow key={generateKey(row)}>
                        {Object.values(row).map((cell) => (
                          <TableCell key={String(cell)}>
                            {String(cell)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <button
                  type="button"
                  className="flex w-full justify-center bg-primary"
                >
                  <div className="text-bold w-3 text-background">+</div>
                </button>
              </>
            )}
        </div>
      )}
    </>
  )
}
