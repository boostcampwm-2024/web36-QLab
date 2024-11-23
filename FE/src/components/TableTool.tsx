import { useState, useRef, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Plus, Minus } from 'lucide-react'

import {
  TableType,
  TableToolType,
  TableToolColumnType,
} from '@/types/interfaces'
import { COLUMN_TYPES } from '@/constants'
import {
  generateKey,
  convertTableData,
  generateCreateTableQuery,
  generateAlterTableQuery,
} from '@/util'
import EditableInput from './EditableInput'

export default function TableTool({
  tableData = [],
}: {
  tableData: TableType[]
}) {
  const tableToolData = convertTableData(tableData)

  const initialTableData = useRef<TableToolType[]>([])
  const [selectedTable, setSelectedTable] = useState(tableToolData[0] || null)

  useEffect(() => {
    initialTableData.current = tableToolData
  }, [tableToolData])

  const handleOnChange = (row: number, id: string, value: unknown) => {
    const updatedColumns = [...selectedTable.columns]

    updatedColumns[row] = {
      ...updatedColumns[row],
      [id]: value,
    }

    setSelectedTable({
      ...selectedTable,
      columns: updatedColumns,
    })
  }

  const handleSubmit = () => {
    if (!selectedTable) return
    const previousTable = initialTableData.current.find(
      (table) => table.tableName === selectedTable.tableName
    )

    const query = previousTable
      ? generateAlterTableQuery(previousTable, selectedTable)
      : generateCreateTableQuery(selectedTable)

    console.log(previousTable, query)
  }

  return (
    <>
      <div className="sticky top-0 items-center gap-3 border-b p-2">
        {tableToolData?.map((table) => (
          <Badge
            variant={
              selectedTable?.tableName === table.tableName
                ? 'default'
                : 'secondary'
            }
            className="mr-2 cursor-pointer"
            onClick={() => {
              setSelectedTable(table)
            }}
            key={table.tableName}
          >
            {table.tableName}
          </Badge>
        ))}
      </div>
      {selectedTable?.columns && selectedTable?.columns.length > 0 && (
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead />
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>PK</TableHead>
              <TableHead>UQ</TableHead>
              <TableHead>AI</TableHead>
              <TableHead>NN</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedTable.columns.map((row: TableToolColumnType, rowIdx) => (
              <TableRow key={generateKey(row)}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                {Object.entries(row).map(
                  ([key, value]) =>
                    key !== 'id' && (
                      <TableCell key={generateKey(value)}>
                        {key === 'name' && (
                          <EditableInput
                            value={String(value)}
                            rowIdx={rowIdx}
                            handleOnChange={handleOnChange}
                          />
                        )}

                        {typeof value === 'boolean' && (
                          <Checkbox
                            checked={value}
                            onCheckedChange={(checked) =>
                              handleOnChange(rowIdx, key, checked)
                            }
                          />
                        )}

                        {key === 'type' && (
                          <Select
                            value={value}
                            onValueChange={(newValue) =>
                              handleOnChange(rowIdx, 'type', newValue)
                            }
                          >
                            <SelectTrigger className="h-[32px] w-[120px] p-2">
                              <SelectValue placeholder={value} />
                            </SelectTrigger>
                            <SelectContent>
                              {COLUMN_TYPES.map((types) => (
                                <SelectItem value={types} key={types}>
                                  {types}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                    )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="flex justify-end p-2">
        <Button variant="outline" size="icon" className="mr-1 h-8">
          <Plus />
        </Button>
        <Button variant="outline" size="icon" className="h-8">
          <Minus />
        </Button>
      </div>
      <div className="mt-8 flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="h-8">
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Table</DialogTitle>
              <DialogDescription>write table name</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Tablename
              </Label>
              <Input
                id="username"
                placeholder="table name"
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="default" className="ml-3 h-8" onClick={handleSubmit}>
          Generate Query
        </Button>
      </div>
    </>
  )
}
