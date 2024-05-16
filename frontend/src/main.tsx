import './index.css'

import App from './App.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from "@/components/ui/sonner"
import { UserProvider } from './context/UserContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <App />
      <Toaster/>
    </UserProvider>
  </React.StrictMode>,
)
