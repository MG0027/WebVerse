"use client"
import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import Header from '@/components/custom/Header'
import { store } from '@/store/store'
import ReduxProvider from '@/redux/provider'
import { GoogleOAuthProvider} from '@react-oauth/google'
import { signIn } from '@/store/authSlice'
import AppSidebar from '@/components/custom/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Menu, X } from 'lucide-react'

function Provider({children}) {
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      store.dispatch(signIn(JSON.parse(storedUser)));
    }
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
   
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_LOGIN_API}>
       <ReduxProvider store={store}>
      <NextThemesProvider
       attribute="class"
       defaultTheme="dark"
       enableSystem
       disableTransitionOnChange>
         <Header></Header>  
         <SidebarProvider>
          {sidebarOpen &&
          <AppSidebar> </AppSidebar>}
          <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
       
      >
        {sidebarOpen ? <div className="fixed top-5 left-52 z-50  text-white rounded-full shadow-lg"><X size={25} /> </div>: <div  className="absolute top-30 left-4 z-50  text-white rounded-full shadow-lg"><Menu size={25} /> </div>}

      </button>
          {children}
         
         </SidebarProvider>
         </NextThemesProvider>
         </ReduxProvider>
         </GoogleOAuthProvider>
      </div>
  )
}

export default Provider