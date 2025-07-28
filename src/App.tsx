import {LocationProvider} from './contexts/LocationContext';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/home';
import Mission from './pages/mission'
import RegionColoring from './pages/RegionColoring';
import RegionDetail from './pages/RegionDetails';
import './index.css';
import TravelDiaryCreate from './pages/TravelDiary/Create';
import Login from './pages/Login';


function App() {
    return (
        <LocationProvider>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/main" element={<Home />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="/region-coloring" element={<RegionColoring />} />
                <Route path="/region/:sidoCode" element={<RegionDetail />} />
                <Route path="/region/:sidoCode/create-diary" element={<TravelDiaryCreate />} />
            </Routes>
        </LocationProvider>
    );
}

export default App;