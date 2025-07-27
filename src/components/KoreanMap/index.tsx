import { MapContainer } from 'react-leaflet';
import { SidoGeoJson, LocationHighlightResponse } from '../../types/geoTypes';
import { KOREAN_BOUNDS, MAP_CONFIG } from '../../shared/constants/mapConstants';
import { useMarkerState } from './hooks/useMarkerState';
import { useSigunguData } from './hooks/useSigunguData';
import { useMarkerPosition } from './hooks/useMarkerPosition';
import MapLayers from './components/MapLayers';
import MapControls from './components/MapControls';
import 'leaflet/dist/leaflet.css';

interface KoreanMapProps {
    sidoData: SidoGeoJson;
    highlightInfo: LocationHighlightResponse | null;
}

function KoreanMap({ sidoData, highlightInfo }: KoreanMapProps) {
    const { showMarker, toggleMarker } = useMarkerState();
    const sigunguData = useSigunguData(highlightInfo);
    const markerPosition = useMarkerPosition(highlightInfo);

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
                    showMarker={showMarker}
                    markerPosition={markerPosition}
                />
            </MapContainer>

            <MapControls
                showMarker={showMarker}
                onToggleMarker={toggleMarker}
            />
        </div>
    );
}

export default KoreanMap;