import { MapContainer, GeoJSON, Marker } from 'react-leaflet';
import { LatLngBoundsExpression, Layer, LeafletEvent, PathOptions, LatLng, DivIcon } from 'leaflet';
import { SidoGeoJson, LocationHighlightResponse, SigunguGeoJson } from '../types/geoTypes';
import { LocationApiService } from '../services/locationApi';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface KoreanMapProps {
    sidoData: SidoGeoJson;
    highlightInfo: LocationHighlightResponse | null;
}

interface FeatureProperties {
    sidoCode: string;
    sidoNameKo: string;
    sidoNameEn: string;
}

interface Feature {
    properties: FeatureProperties;
}

function KoreanMap({ sidoData, highlightInfo }: KoreanMapProps) {
    const [sigunguData, setSigunguData] = useState<SigunguGeoJson | null>(null);
    const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);

    // 🗂️ LocalStorage에서 마커 표시 상태 불러오기
    const [showMarker, setShowMarker] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem('map_show_marker');
            return saved !== null ? JSON.parse(saved) : true; // 기본값: true
        } catch (error) {
            console.error('LocalStorage 읽기 실패:', error);
            return true;
        }
    });

    // 🗂️ 마커 표시 상태가 변경될 때 LocalStorage에 저장
    const toggleMarker = () => {
        const newState = !showMarker;
        setShowMarker(newState);

        try {
            localStorage.setItem('map_show_marker', JSON.stringify(newState));
            console.log('🗂️ 마커 상태 저장:', newState);
        } catch (error) {
            console.error('LocalStorage 저장 실패:', error);
        }
    };

    // 한국 지도 경계 (웹앱 최적화 - 약간의 이동 허용)
    const koreanBounds: LatLngBoundsExpression = [
        [32.0, 123.0], // 남서쪽 (조금 더 넓게)
        [40.0, 133.0]  // 북동쪽 (조금 더 넓게)
    ];

    // 🎯 서버에서 받은 중심 좌표로 마커 위치 설정
    const getMarkerPosition = (highlightInfo: LocationHighlightResponse): LatLng | null => {
        if (!highlightInfo) {
            console.log('❌ 하이라이트 정보 없음');
            return null;
        }

        // 서버에서 중심 좌표를 보내준 경우
        if (highlightInfo.centerLat && highlightInfo.centerLng) {
            console.log(`✅ 서버 중심 좌표 사용: [${highlightInfo.centerLat}, ${highlightInfo.centerLng}]`);
            return new LatLng(highlightInfo.centerLat, highlightInfo.centerLng);
        }

        console.log('❌ 서버에서 중심 좌표를 보내주지 않음');
        return null;
    };

    // 🎨 투명 배경의 깔끔한 마커 (검은 글씨)
    const createLocationMarker = (text: string) => {
        return new DivIcon({
            html: `
                <div style="
                    position: relative;
                    background: rgba(255, 255, 255, 0.9);
                    color: #1f2937;
                    padding: 8px 12px;
                    border-radius: 16px;
                    font-weight: 600;
                    font-size: 14px;
                    text-align: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    border: 2px solid rgba(59, 130, 246, 0.5);
                    white-space: nowrap;
                    transform: translateY(-8px);
                    backdrop-filter: blur(8px);
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    ">
                        <span style="
                            display: inline-block;
                            width: 6px;
                            height: 6px;
                            background: #ef4444;
                            border-radius: 50%;
                            animation: pulse 2s infinite;
                        "></span>
                        ${text}
                    </div>
                    <!-- 말풍선 꼬리 -->
                    <div style="
                        position: absolute;
                        bottom: -6px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 0;
                        height: 0;
                        border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        border-top: 6px solid rgba(255, 255, 255, 0.9);
                    "></div>
                </div>
                <style>
                    @keyframes pulse {
                        0% {
                            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                        }
                        70% {
                            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
                        }
                        100% {
                            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
                        }
                    }
                </style>
            `,
            className: 'location-marker',
            iconSize: [100, 40],
            iconAnchor: [50, 35],
        });
    };

    // 🗺️ 하이라이트 정보가 변경될 때 시군구 데이터 로드 및 마커 위치 설정
    useEffect(() => {
        const loadSigunguIfNeeded = async () => {
            if (highlightInfo?.highlightType === 'sigungu' && highlightInfo.parentSidoCode) {
                try {
                    console.log('🗺️ 시군구 데이터 로드:', highlightInfo.parentSidoCode);
                    const data = await LocationApiService.getSigunguBySidoCode(highlightInfo.parentSidoCode);
                    setSigunguData(data);
                } catch (error) {
                    console.error('❌ 시군구 데이터 로드 실패:', error);
                }
            } else {
                setSigunguData(null);
            }

            // 🎯 마커 위치 설정
            if (highlightInfo) {
                console.log('🎯 하이라이트 정보 받음:', highlightInfo);
                const position = getMarkerPosition(highlightInfo);
                console.log('🎯 마커 위치:', position);
                setMarkerPosition(position);
            } else {
                console.log('🎯 하이라이트 정보 없음, 마커 제거');
                setMarkerPosition(null);
            }
        };

        loadSigunguIfNeeded();
    }, [highlightInfo]);

    // ✅ 시도 스타일링 함수 (Leaflet 타입 맞춤)
    const getSidoStyle = (feature?: Feature): PathOptions => {
        if (!feature) return {};

        const isHighlighted = highlightInfo?.highlightType === 'sido' &&
            feature.properties.sidoCode === highlightInfo.targetCode;

        return {
            color: '#666666',
            weight: 1,
            opacity: 1,
            fillColor: isHighlighted ? '#ff6b6b' : 'transparent',
            fillOpacity: isHighlighted ? 0.6 : 0
        };
    };

    // ✅ 시군구 스타일링 함수 (Leaflet 타입 맞춤)
    const getSigunguStyle = (feature?: { properties: { sigCode: string } }): PathOptions => {
        if (!feature) return {};

        const isHighlighted = highlightInfo?.highlightType === 'sigungu' &&
            feature.properties.sigCode === highlightInfo.targetCode;

        return {
            color: '#4ecdc4',
            weight: 1,
            opacity: 0.8,
            fillColor: isHighlighted ? '#ff6b6b' : '#4ecdc4',
            fillOpacity: isHighlighted ? 0.7 : 0.1
        };
    };

    const onEachSidoFeature = (feature: Feature, layer: Layer) => {
        // 시도 클릭 이벤트
        layer.on('click', () => {
            const properties = feature.properties;
            console.log('클릭한 시도:', properties);
        });

        // 마우스 오버 효과 (하이라이트되지 않은 경우만)
        if (!(highlightInfo?.highlightType === 'sido' &&
            feature.properties.sidoCode === highlightInfo.targetCode)) {

            layer.on('mouseover', (e: LeafletEvent) => {
                const targetLayer = e.target as Layer & { setStyle: (style: PathOptions) => void };
                targetLayer.setStyle({
                    fillColor: '#e3f2fd',
                    fillOpacity: 0.3
                });
            });

            layer.on('mouseout', (e: LeafletEvent) => {
                const targetLayer = e.target as Layer & { setStyle: (style: PathOptions) => void };
                targetLayer.setStyle(getSidoStyle(feature));
            });
        }
    };

    // ✅ 시군구 피처 이벤트 (정확한 타입 사용)
    const onEachSigunguFeature = (feature: { properties: Record<string, string> }, layer: Layer) => {
        // 시군구 클릭 이벤트
        layer.on('click', () => {
            console.log('클릭한 시군구:', feature.properties);
        });
    };

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white relative">
            <MapContainer
                bounds={koreanBounds}
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
                minZoom={6}
                maxZoom={10}
                maxBounds={koreanBounds}
                maxBoundsViscosity={0.8}
            >
                {/* ✅ 시도 레이어 */}
                <GeoJSON
                    key="sido-layer"
                    data={sidoData}
                    style={getSidoStyle}
                    onEachFeature={onEachSidoFeature}
                />

                {/* ✅ 시군구 레이어 (타입 맞춤) */}
                {sigunguData && (
                    <GeoJSON
                        key="sigungu-layer"
                        data={sigunguData}
                        style={getSigunguStyle}
                        onEachFeature={onEachSigunguFeature}
                    />
                )}

                {/* 🎯 지역 위치 마커 (투명 배경, 검은 글씨) */}
                {showMarker && markerPosition && highlightInfo && (
                    <Marker
                        position={markerPosition}
                        icon={createLocationMarker(highlightInfo.targetName)}
                    />
                )}
            </MapContainer>

            {/* 🎯 위치 표시 토글 버튼 (우하단) */}
            <button
                onClick={toggleMarker}
                className={`
                    absolute bottom-6 right-6 z-10 
                    w-12 h-12 rounded-full shadow-lg
                    transition-all duration-200 ease-in-out
                    flex items-center justify-center
                    ${showMarker
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-400 hover:bg-gray-500 text-white'
                }
                `}
                title={showMarker ? "위치 마커 숨기기" : "위치 마커 보기"}
            >
                {showMarker ? (
                    // 위치 표시 중 아이콘
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                ) : (
                    // 위치 숨김 중 아이콘
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        <path d="M2 2l20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                )}
            </button>
        </div>
    );
}

export default KoreanMap;