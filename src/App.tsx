import { Routes, Route } from 'react-router-dom'
import Home from './page/home'
import './index.css'
import RegionColoring from './page/RegionColoring'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/region-coloring" element={<RegionColoring />} />
    </Routes>
  )
}

export default App