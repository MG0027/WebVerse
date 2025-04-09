import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from '../ui/button'
import { MessageCircleCode } from 'lucide-react'
import WorkHistory from './WorkHistory'
import SideBarFooter from './SideBarFooter'

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
      <h1 className='text-2xl font-extrabold tracking-wide'>W</h1>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <Button><MessageCircleCode></MessageCircleCode>New Chat</Button>
        <SidebarGroup >
        <WorkHistory></WorkHistory>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter >
        {/* <SideBarFooter></SideBarFooter> */}
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar