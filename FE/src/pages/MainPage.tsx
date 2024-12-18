import { useState } from 'react'
import { MENU } from '@/constants/constants'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'
import { Toaster } from '@/components/ui/toaster'
import MainContent from '@/components/MainContent'

import { ErrorBoundary } from 'react-error-boundary'
import MainErrorPage from './MainErrorPage'

export default function MainPage() {
  const [activeItem, setActiveItem] = useState(MENU[0])

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '400px',
        } as React.CSSProperties
      }
    >
      <ErrorBoundary
        FallbackComponent={MainErrorPage}
        onReset={() => window.location.reload()}
      >
        <LeftSidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <SidebarInset>
          <MainContent />
        </SidebarInset>
        <RightSidebar />
        <Toaster />
      </ErrorBoundary>
    </SidebarProvider>
  )
}
