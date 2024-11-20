import { MENU_TITLE } from '@/constants'
import { TableType } from '@/types/interfaces'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import ViewTable from './ViewTable'

export default function RightSidebar({
  tables = [],
  ...props
}: {
  tables: TableType[]
}) {
  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l lg:flex"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      side="right"
    >
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">
            {MENU_TITLE.VIEW}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <ViewTable tableData={tables} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}