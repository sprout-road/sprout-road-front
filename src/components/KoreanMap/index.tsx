import {MapContainer} from 'react-leaflet';
import {RegionGeoJson, SidoGeoJson} from '../../types/geoTypes';
import {KOREAN_BOUNDS, MAP_CONFIG} from '../../shared/constants/mapConstants';
import MapLayers from './MapLayers.tsx';
import 'leaflet/dist/leaflet.css';

interface KoreanMapProps {
    sidoData: SidoGeoJson;
    regionData: Map<string, RegionGeoJson>;
    missionCounts: Map<string, number>;
}

function KoreanMap({ sidoData, regionData, missionCounts }: KoreanMapProps) {
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
                    regionData={regionData}
                    missionCounts={missionCounts}
                />
            </MapContainer>
        </div>
    );
}

export default KoreanMap;