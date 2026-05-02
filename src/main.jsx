import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FiberWiki from './FiberWiki.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FiberWiki />
  </StrictMode>,
)