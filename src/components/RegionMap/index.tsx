import {GeoJSON, MapContainer} from 'react-leaflet';
import {useMemo} from 'react';
import {Feature, Geometry} from 'geojson';
import {PathOptions} from 'leaflet';
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
    missionCounts?: Map<string, number>;
}

type ColorIntensity = 'light' | 'medium' | 'dark';

function RegionMap({
                       regionData,
                       sidoCode,
                       regionName,
                       isCompact = false,
                       onSigunguClick,
                       missionCounts = new Map()
                   }: RegionMapProps) {

    const { boundaryData } = useBoundaryData(sidoCode);

    const regionBounds = useMemo(() =>
        calculateRegionBounds(regionData), [regionData]
    );

    const sigunguCenters = useMemo(() =>
        calculateSigunguCenters(regionData), [regionData]
    );

    // 색상 강도 계산 함수
    const getColorIntensity = (count: number, maxCount: number): ColorIntensity | null => {
        if (count === 0) return null;

        // 최대값이 1인 경우에만 medium으로 고정
        if (maxCount === 1) {
            return 'medium';
        }

        // 3단계로 정확하게 구분
        const percentage = (count / maxCount) * 100;

        if (percentage <= 33) return 'light';
        if (percentage <= 66) return 'medium';
        return 'dark';
    };

    // 미션 기반 스타일 함수
    const getMissionAwareStyle = useMemo(() => {
        return (feature: Feature<Geometry, unknown> | undefined): PathOptions => {
            // 기본 스타일 가져오기
            const baseStyle = getSigunguStyle(feature);

            // 미션 데이터가 없거나 feature가 없으면 기본 스타일 반환
            if (!feature?.properties || missionCounts.size === 0) {
                return baseStyle;
            }

            const regionCode = (feature.properties as any).regionCode;
            const count = missionCounts.get(regionCode) || 0;

            // 미션이 없으면 기본 스타일
            if (count === 0) {
                return baseStyle;
            }

            // 미션이 있으면 색칠
            const maxCount = Math.max(...Array.from(missionCounts.values()));
            const intensity = getColorIntensity(count, maxCount);

            if (!intensity) {
                return baseStyle;
            }

            // 색상 매핑
            const colorMap: Record<ColorIntensity, Partial<PathOptions>> = {
                light: {
                    fillColor: '#bbf7d0',
                    fillOpacity: 0.6
                },
                medium: {
                    fillColor: '#22c55e',
                    fillOpacity: 0.7
                },
                dark: {
                    fillColor: '#15803d',
                    fillOpacity: 0.8
                }
            };

            // 기본 스타일에 미션 색상 오버라이드
            return {
                ...baseStyle,
                ...colorMap[intensity],
                color: '#666666', // 경계선은 회색으로 유지
                weight: 1
            };
        };
    }, [missionCounts]);

    // 각 시군구 feature에 대한 이벤트 핸들러
    const onEachFeature = useMemo(() =>
        (feature: Feature<Geometry, unknown>, layer: L.Layer) => {
            if (!isSigunguFeature(feature) || !onSigunguClick) return;

            const eventLayer = layer as L.Layer & {
                on: (event: string, handler: () => void) => void;
                setStyle: (style: L.PathOptions) => void;
            };

            // 클릭 이벤트 처리
            eventLayer.on('click', () => {
                console.log('🗺️ 클릭된 feature:', feature.properties);
                const regionCode = feature.properties.regionCode;
                const regionName = feature.properties.regionName;
                console.log('🗺️ 전달할 데이터:', { regionCode, regionName });
                onSigunguClick(regionCode, regionName);

                // 클릭시 파란색 테두리 추가
                const currentStyle = getMissionAwareStyle(feature);
                eventLayer.setStyle({
                    ...currentStyle,
                    weight: 4,
                    color: '#4A90E2',
                });
            });

            // 호버 효과 - 원래 색상 유지하면서 테두리만 변경
            eventLayer.on('mouseover', () => {
                // 현재 스타일 가져오기
                const currentStyle = getMissionAwareStyle(feature);

                eventLayer.setStyle({
                    ...currentStyle, // 기존 색상 유지
                    weight: 3,
                    color: '#4A90E2', // 테두리만 파란색으로
                });
            });

            eventLayer.on('mouseout', () => {
                // 원래 미션 스타일로 복원
                eventLayer.setStyle(getMissionAwareStyle(feature));
            });
        }, [onSigunguClick, missionCounts, getMissionAwareStyle]
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
                {/* 시군구 면 레이어 - 미션 색칠 적용 */}
                <GeoJSON
                    key={`region-${regionName}-${missionCounts.size}`}
                    data={regionData}
                    style={getMissionAwareStyle}
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