import {GeoJSON, MapContainer} from 'react-leaflet';
import {useMemo} from 'react';
import {Feature, Geometry} from 'geojson';
import {LocationResponse, RegionGeoJson} from '../../types/geoTypes';
import RegionLabels from './RegionLabels';
import {useBoundaryData} from './hooks/useBoundaryData';
import {
    calculateRegionBounds,
    calculateSigunguCenters,
    getBoundaryStyle,
    getSigunguStyle,
    isSigunguFeature
} from './utils';
import {MAP_CONFIG} from './constants';
import 'leaflet/dist/leaflet.css';

interface RegionMapProps {
    regionData: RegionGeoJson;
    sidoCode: string | undefined;
    location: LocationResponse | null;
    regionName: string;
    isCompact?: boolean;
    onSigunguClick?: (regionCode: string, regionName: string) => void;
}

function RegionMap({
                       regionData,
                       sidoCode,
                       regionName,
                       isCompact = false,
                       onSigunguClick
                   }: RegionMapProps) {
    // Custom Hook으로 바운더리 데이터 관리
    const { boundaryData } = useBoundaryData(sidoCode);

    // 계산된 값들 (메모이제이션)
    const regionBounds = useMemo(() =>
        calculateRegionBounds(regionData), [regionData]
    );

    const sigunguCenters = useMemo(() =>
        calculateSigunguCenters(regionData), [regionData]
    );

    // 스타일 함수 (타입 안전)
    const sigunguStyleFunction = useMemo(() =>
            (feature: Feature<Geometry, unknown> | undefined) => getSigunguStyle(feature),
        []
    );

    // 각 시군구 feature에 대한 이벤트 핸들러
    const onEachFeature = useMemo(() =>
        (feature: Feature<Geometry, unknown>, layer: L.Layer) => {
            if (!isSigunguFeature(feature) || !onSigunguClick) return;

            // 타입 단언으로 이벤트 메서드 접근
            const eventLayer = layer as L.Layer & {
                on: (event: string, handler: () => void) => void;
                setStyle: (style: L.PathOptions) => void;
            };

            // 클릭 이벤트 처리 - RegionProperties 구조에 맞게 수정
            eventLayer.on('click', () => {
                console.log('🗺️ 클릭된 feature:', feature.properties);
                const regionCode = feature.properties.regionCode;  // sigCode -> regionCode
                const regionName = feature.properties.regionName;  // 변경 없음
                console.log('🗺️ 전달할 데이터:', { regionCode, regionName });
                onSigunguClick(regionCode, regionName);
            });

            // 호버 효과
            eventLayer.on('mouseover', () => {
                eventLayer.setStyle({
                    weight: 3,
                    color: '#4A90E2',
                    fillOpacity: 0.4
                });
            });

            eventLayer.on('mouseout', () => {
                eventLayer.setStyle(getSigunguStyle(feature));
            });
        }, [onSigunguClick]
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
                    onEachFeature={onEachFeature}
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