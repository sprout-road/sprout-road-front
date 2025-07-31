import {GeoJSON, MapContainer} from 'react-leaflet';
import {useMemo} from 'react';
import {Feature, Geometry} from 'geojson';
import {LocationHighlightResponse, RegionGeoJson} from '../../types/geoTypes';
import RegionLabels from './RegionLabels';
import {useBoundaryData} from './hooks/useBoundaryData';
import {calculateRegionBounds, calculateSigunguCenters, getBoundaryStyle, getSigunguStyle} from './utils';
import {createSigunguEventHandler} from './eventHandlers';
import {MAP_CONFIG} from './constants';
import 'leaflet/dist/leaflet.css';

interface RegionMapProps {
    regionData: RegionGeoJson;
    sidoCode: string | undefined;
    highlightInfo: LocationHighlightResponse | null;
    regionName: string;
    isCompact?: boolean;
}

function RegionMap({ regionData, sidoCode, highlightInfo, regionName, isCompact = false }: RegionMapProps) {
    // Custom Hook으로 바운더리 데이터 관리
    const { boundaryData } = useBoundaryData(sidoCode);

    // 계산된 값들 (메모이제이션)
    const regionBounds = useMemo(() =>
        calculateRegionBounds(regionData), [regionData]
    );

    const sigunguCenters = useMemo(() =>
        calculateSigunguCenters(regionData), [regionData]
    );

    // 이벤트 핸들러
    const onEachSigunguFeature = useMemo(() =>
        createSigunguEventHandler(highlightInfo), [highlightInfo]
    );

    // 스타일 함수 (타입 안전)
    const sigunguStyleFunction = useMemo(() =>
            (feature: Feature<Geometry, unknown> | undefined) => getSigunguStyle(feature, highlightInfo),
        [highlightInfo]
    );

    const zoomConfig = isCompact ? MAP_CONFIG.ZOOM.COMPACT : MAP_CONFIG.ZOOM.NORMAL;

    return (
        <div className="relative w-full h-full overflow-hidden bg-white">
            <MapContainer
                bounds={regionBounds}
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
                minZoom={zoomConfig.MIN}
                maxZoom={zoomConfig.MAX}
                maxBounds={regionBounds}
                maxBoundsViscosity={MAP_CONFIG.BOUNDS_VISCOSITY}
            >
                {/* 시군구 면 레이어 */}
                <GeoJSON
                    key={`region-${regionName}`}
                    data={regionData}
                    style={sigunguStyleFunction}
                    onEachFeature={onEachSigunguFeature}
                />

                {/* 시도 바운더리 오버레이 */}
                {boundaryData && (
                    <GeoJSON
                        key={`sido-boundary-overlay-${regionName}`}
                        data={boundaryData}
                        style={getBoundaryStyle(isCompact)}
                    />
                )}

                {/* 지역명 라벨 */}
                <RegionLabels sigunguCenters={sigunguCenters} />
            </MapContainer>
        </div>
    );
}

export default RegionMap;