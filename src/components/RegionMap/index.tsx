import { MapContainer, GeoJSON, Marker, useMap } from 'react-leaflet';
import { LatLngBoundsExpression, Layer, PathOptions } from 'leaflet';
import { useEffect, useState } from 'react';
import { SigunguGeoJson, LocationHighlightResponse } from '../../types/geoTypes';
import { createLocationMarker } from '../../shared/utils/markerUtils';
import { useMarkerState } from '../KoreanMap/hooks/useMarkerState';
import { useMarkerPosition } from '../KoreanMap/hooks/useMarkerPosition';
import MapControls from '../KoreanMap/components/MapControls';
import { useMemo } from 'react';
import 'leaflet/dist/leaflet.css';

interface RegionMapProps {
    sigunguData: SigunguGeoJson;
    highlightInfo: LocationHighlightResponse | null;
    regionName: string;
}

interface SigunguFeature {
    properties: {
        sigCode: string;
        sigNameKo: string;
        sigNameEn: string;
        sidoNameKo?: string; // 시도명도 포함
        centerLat: number;
        centerLng: number;
    };
}

// 지역명 라벨을 지도 위에 표시하는 컴포넌트
function RegionLabels({ sigunguCenters }: { sigunguCenters: Array<{ name: string; lat: number; lng: number; isHighlighted: boolean }> }) {
    const map = useMap();
    const [labels, setLabels] = useState<Array<{ name: string; x: number; y: number; isHighlighted: boolean }>>([]);

    // 지도 이동/줌 시 라벨 위치 업데이트
    useEffect(() => {
        const updateLabelPositions = () => {
            const newLabels = sigunguCenters.map(center => {
                const point = map.latLngToContainerPoint([center.lat, center.lng]);
                return {
                    name: center.name,
                    x: point.x,
                    y: point.y,
                    isHighlighted: center.isHighlighted
                };
            });
            setLabels(newLabels);
        };

        // 초기 위치 설정
        updateLabelPositions();

        // 지도 이벤트 리스너 등록
        map.on('zoom', updateLabelPositions);
        map.on('move', updateLabelPositions);
        map.on('resize', updateLabelPositions);

        // 클린업
        return () => {
            map.off('zoom', updateLabelPositions);
            map.off('move', updateLabelPositions);
            map.off('resize', updateLabelPositions);
        };
    }, [map, sigunguCenters]);

    return (
        <>
            {labels.map((label, index) => (
                <div
                    key={`label-${index}`}
                    className="absolute pointer-events-none select-none z-10"
                    style={{
                        left: label.x,
                        top: label.y,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div
                        className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                            label.isHighlighted
                                ? 'bg-red-100 text-red-800 font-bold border border-red-300'
                                : 'bg-white/90 text-gray-700 border border-gray-200'
                        }`}
                        style={{
                            backdropFilter: 'blur(4px)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        {label.name}
                    </div>
                </div>
            ))}
        </>
    );
}

function RegionMap({ sigunguData, highlightInfo, regionName }: RegionMapProps) {
    const { showMarker, toggleMarker } = useMarkerState();
    const markerPosition = useMarkerPosition(highlightInfo);

    // 좌표 처리 헬퍼 함수
    const processCoordinates = (coord: number[], bounds: { minLat: number, maxLat: number, minLng: number, maxLng: number }) => {
        const lng = coord[0];
        const lat = coord[1];
        bounds.minLat = Math.min(bounds.minLat, lat);
        bounds.maxLat = Math.max(bounds.maxLat, lat);
        bounds.minLng = Math.min(bounds.minLng, lng);
        bounds.maxLng = Math.max(bounds.maxLng, lng);
    };

    // 지역 경계 계산 (GeoJSON 데이터에서 자동 계산)
    const regionBounds: LatLngBoundsExpression = useMemo(() => {
        if (!sigunguData.features || sigunguData.features.length === 0) {
            return [[33, 124], [39, 132]]; // 기본값
        }

        const bounds = {
            minLat: Infinity,
            maxLat: -Infinity,
            minLng: Infinity,
            maxLng: -Infinity
        };

        sigunguData.features.forEach((feature) => {
            if (feature.geometry.type === 'Polygon') {
                feature.geometry.coordinates[0].forEach((coord) => {
                    processCoordinates(coord, bounds);
                });
            } else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach((polygon) => {
                    const coords = polygon as unknown as number[][][];
                    coords[0].forEach((coord) => {
                        processCoordinates(coord, bounds);
                    });
                });
            }
        });

        // 약간의 여백 추가
        const latPadding = (bounds.maxLat - bounds.minLat) * 0.1;
        const lngPadding = (bounds.maxLng - bounds.minLng) * 0.1;

        return [
            [bounds.minLat - latPadding, bounds.minLng - lngPadding],
            [bounds.maxLat + latPadding, bounds.maxLng + lngPadding]
        ];
    }, [sigunguData]);

    // 각 시군구의 중심점 계산 (백엔드 중심좌표 우선 사용)
    const sigunguCenters = useMemo(() => {
        if (!sigunguData.features) return [];

        return sigunguData.features.map((feature) => {
            return {
                name: feature.properties.sigNameKo,
                lat: feature.properties.centerLat,
                lng: feature.properties.centerLng,
                isHighlighted: highlightInfo?.highlightType === 'sigungu' &&
                    feature.properties.sigCode === highlightInfo.targetCode
            };
        });
    }, [sigunguData, highlightInfo]);

    // 시군구 스타일링 (기본적으로 색칠 없음)
    const getSigunguStyle = (feature?: SigunguFeature): PathOptions => {
        if (!feature) return {};

        const isHighlighted = highlightInfo?.highlightType === 'sigungu' &&
            feature.properties.sigCode === highlightInfo.targetCode;

        return {
            color: '#666666',
            weight: 1,
            opacity: 1,
            fillColor: isHighlighted ? '#ff6b6b' : 'transparent', // 기본: 투명
            fillOpacity: isHighlighted ? 0.6 : 0 // 기본: 투명
        };
    };

    // 시군구 이벤트 핸들러
    const onEachSigunguFeature = (feature: SigunguFeature, layer: Layer) => {
        // 시군구 클릭 이벤트
        layer.on('click', () => {
            console.log('클릭한 시군구:', feature.properties);
            // 추후 시군구 상세 페이지로 이동하거나 추가 기능 구현
        });

        // 마우스 오버 효과 (하이라이트되지 않은 경우만)
        if (!(highlightInfo?.highlightType === 'sigungu' &&
            feature.properties.sigCode === highlightInfo.targetCode)) {

            layer.on('mouseover', () => {
                const targetLayer = layer as Layer & { setStyle: (style: PathOptions) => void };
                targetLayer.setStyle({
                    fillColor: '#e3f2fd',
                    fillOpacity: 0.3
                });
            });

            layer.on('mouseout', () => {
                const targetLayer = layer as Layer & { setStyle: (style: PathOptions) => void };
                targetLayer.setStyle(getSigunguStyle(feature));
            });
        }
    };

    // 디버깅: 데이터 확인
    useEffect(() => {
        console.log('🗺️ RegionMap 데이터 확인:');
        console.log('sigunguData:', sigunguData);
        console.log('sigunguCenters:', sigunguCenters);
        console.log('highlightInfo:', highlightInfo);
    }, [sigunguData, sigunguCenters, highlightInfo]);

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
                minZoom={8}
                maxZoom={12}
                maxBounds={regionBounds}
                maxBoundsViscosity={0.8}
            >
                {/* 시군구 레이어 */}
                <GeoJSON
                    key={`region-${regionName}`}
                    data={sigunguData}
                    style={getSigunguStyle}
                    onEachFeature={onEachSigunguFeature}
                />

                {/* 지역명 라벨 (지도 확대/축소에 따라 위치 자동 조정) */}
                <RegionLabels sigunguCenters={sigunguCenters} />

                {/* 현재 위치 마커 */}
                {showMarker && markerPosition && highlightInfo && (
                    <Marker
                        position={markerPosition}
                        icon={createLocationMarker(highlightInfo.targetName)}
                    />
                )}
            </MapContainer>

            {/* 마커 토글 버튼 */}
            <MapControls
                showMarker={showMarker}
                onToggleMarker={toggleMarker}
            />

            {/* 현재 위치 표시 (해당 지역에 있을 때만) */}
            {highlightInfo && (
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-800">
                            현재 위치: {highlightInfo.targetName}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RegionMap;