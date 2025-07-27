import {LocationProvider} from './contexts/LocationContext';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/home';
import Mission from './pages/mission'
import RegionColoring from './pages/RegionColoring';
import RegionDetail from './pages/RegionDetails';

function App() {
    return (
        <LocationProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="/region-coloring" element={<RegionColoring />} />
                <Route path="/region/:sidoCode" element={<RegionDetail />} />
            </Routes>
        </LocationProvider>
    ); 
}

export default App;