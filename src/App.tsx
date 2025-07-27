import {LocationProvider} from './contexts/LocationContext';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/home';
import RegionColoring from './pages/RegionColoring';

function App() {
    return (
        <LocationProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/region-coloring" element={<RegionColoring />} />]
            </Routes>
        </LocationProvider>
    );
}

export default App;