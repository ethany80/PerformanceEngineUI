import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import App from './pages/App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Landing from './pages/Landing.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='editor/:documentId' element={<App />} />
        {/* Since I'm limited on time, and in absence of redirects, just route an empty id to the landing page. */}
        <Route path='editor/' element={<Landing />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
