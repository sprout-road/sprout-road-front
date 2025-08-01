import {LocationProvider} from './contexts/LocationContext';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/home';
import Mission from './pages/Mission'
import RegionColoring from './pages/RegionColoring';
import RegionDetail from './pages/RegionDetails';
import './index.css';
import Login from './pages/Login';
import TravelLogDetail from './pages/TravelLog';
import TravelLogCreate from './pages/TravelLog/Create';

function App() {
    return (
        <LocationProvider>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/main" element={<Home />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="/region-coloring" element={<RegionColoring />} />
                <Route path="/region/:sidoCode" element={<RegionDetail />} />
                <Route path="/travel-log/:diaryId" element={<TravelLogDetail />} />
                <Route path="/create-diary" element={<TravelLogCreate />} />
            </Routes>
        </LocationProvider>
    );
}

export default App;