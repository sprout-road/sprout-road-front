import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const container = document.getElementById('root')!

createRoot(container).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)