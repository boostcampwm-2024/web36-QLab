'use client'

import * as React from 'react'
import { NAV_MENU, USER } from '@/constants'
import { X } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import logo from '@/assets/logo.svg'
import NavUser from './NavUser'

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(NAV_MENU[0])
  const { setOpen, toggleSidebar } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader className="pt-3">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <img src={logo} alt="logo" className="size-6" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {NAV_MENU?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        if (activeItem.title === item.title) {
                          toggleSidebar()
                        } else {
                          setOpen(true)
                        }
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={USER} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem.title}
            </div>
            <button
              type="button"
              className="text-foreground"
              onClick={() => setOpen(false)}
            >
              <X className="fill-current" />
            </button>
          </div>
        </SidebarHeader>
        <div className="p-4 font-medium">{activeItem.title}</div>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}