import {MapContainer} from 'react-leaflet';
import {LocationHighlightResponse, SidoGeoJson, SigunguGeoJson} from '../../types/geoTypes';
import {KOREAN_BOUNDS, MAP_CONFIG} from '../../shared/constants/mapConstants';
import MapLayers from './components/MapLayers';
import 'leaflet/dist/leaflet.css';

interface KoreanMapProps {
    sidoData: SidoGeoJson;
    highlightInfo: LocationHighlightResponse | null;
    sigunguData?: SigunguGeoJson | null; // 선택적으로 전달받을 수 있음
}

function KoreanMap({ sidoData, highlightInfo, sigunguData = null }: KoreanMapProps) {
    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white relative">
            <MapContainer
                bounds={KOREAN_BOUNDS}
                className="w-full h-full"
                style={{
                    backgroundColor: 'transparent',
                    touchAction: 'pan-x pan-y'
                }}
                zoomControl={false}
                dragging={true}
                scrollWheelZoom={true}
                doubleClickZoom={true}
                touchZoom={true}
                boxZoom={false}
                keyboard={true}
                attributionControl={false}
                minZoom={MAP_CONFIG.minZoom}
                maxZoom={MAP_CONFIG.maxZoom}
                maxBounds={KOREAN_BOUNDS}
                maxBoundsViscosity={MAP_CONFIG.maxBoundsViscosity}
            >
                <MapLayers
                    sidoData={sidoData}
                    sigunguData={sigunguData}
                    highlightInfo={highlightInfo}
                    showLocationInfo={false} // RegionColoring에서는 헤더가 있으니 숨김
                />
            </MapContainer>
        </div>
    );
}

export default KoreanMap;