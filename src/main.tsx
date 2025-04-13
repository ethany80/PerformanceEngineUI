import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Landing from './Landing.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='editor/:documentId' element={<App />} />
        <Route path='editor/' element={<Landing />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
