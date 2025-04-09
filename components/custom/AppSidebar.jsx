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
import { useRouter } from 'next/navigation'



function AppSidebar() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/')
  }
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
      <h1 className='text-2xl font-extrabold tracking-wide'>W</h1>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <Button onClick={handleClick} className='cursor-pointer'><MessageCircleCode></MessageCircleCode>New Chat</Button>
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