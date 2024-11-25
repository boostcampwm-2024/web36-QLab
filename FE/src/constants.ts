import { Table2, FileText, Network } from 'lucide-react'

export const QUERY_KEYS = {
  SHELLS: 'shells',
  TABLES: 'tables',
} as const

export const MENU_TITLE = {
  TABLE: 'Create/Edit Table',
  RECORD: 'Add Random Record',
  VIEW: 'Current Table',
}

export const MENU = [
  {
    title: MENU_TITLE.TABLE,
    icon: Table2,
    isActive: true,
  },
  {
    title: MENU_TITLE.RECORD,
    icon: FileText,
    isActive: false,
  },
  {
    title: MENU_TITLE.VIEW,
    icon: Network,
    isActive: false,
  },
]

export const COLUMN_TYPES = [
  'TINYINT',
  'SMALLINT',
  'MEDIUMINT',
  'INT',
  'BIGINT',
  'BIT(1)',
  'FLOAT',
  'DOUBLE',
  'DECIMAL(10,0)',
  'CHAR(1)',
  'VARCHAR(255)',
  'TINYTEXT',
  'TEXT',
  'MEDIUMTEXT',
  'LONGTEXT',
  'BINARY(1)',
  'VARBINARY(255)',
  'TINYBLOB',
  'BLOB',
  'MEDIUMBLOB',
  'LONGBLOB',
  'JSON',
  'DATE',
  'DATETIME',
  'TIMESTAMP',
  'TIME',
  'YEAR',
]

export const RECORD_TYPES = [
  'name',
  'country',
  'city',
  'email',
  'phone',
  'sex',
  'boolean',
  'number',
  'enum',
]
