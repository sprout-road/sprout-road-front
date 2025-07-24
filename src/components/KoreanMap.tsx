import { MapContainer, GeoJSON } from 'react-leaflet';
import { LatLngBoundsExpression, Layer, LeafletEvent } from 'leaflet';
import { SidoGeoJson } from '../types/geoTypes';
import 'leaflet/dist/leaflet.css';

interface KoreanMapProps {
    sidoData: SidoGeoJson;
}

interface FeatureProperties {
    sidoCode: string;
    sidoNameKo: string;
    sidoNameEn: string;
}

interface Feature {
    properties: FeatureProperties;
}

function KoreanMap({ sidoData }: KoreanMapProps) {
    // 한국 지도 경계 (대략적인 범위)
    const koreanBounds: LatLngBoundsExpression = [
        [33.0, 124.0], // 남서쪽
        [39.0, 132.0]  // 북동쪽
    ];

    const geoJsonStyle = {
        color: '#666666',        // 경계선 색상
        weight: 1,               // 경계선 두께
        opacity: 1,              // 경계선 투명도
        fillColor: 'transparent', // 채우기 색상 (투명)
        fillOpacity: 0           // 채우기 투명도
    };

    const onEachFeature = (feature: Feature, layer: Layer) => {
        // 시도 클릭 이벤트
        layer.on('click', () => {
            const properties = feature.properties;
            console.log('클릭한 시도:', properties);

            // 나중에 시군구 로드 로직 추가 예정
            // loadSigungu(properties.sidoCode);
        });

        // 마우스 오버 효과
        layer.on('mouseover', (e: LeafletEvent) => {
            const targetLayer = e.target;
            targetLayer.setStyle({
                fillColor: '#e3f2fd',
                fillOpacity: 0.3
            });
        });

        // 마우스 아웃 효과
        layer.on('mouseout', (e: LeafletEvent) => {
            const targetLayer = e.target;
            targetLayer.setStyle(geoJsonStyle);
        });
    };

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white">
            <MapContainer
                bounds={koreanBounds}
                className="w-full h-full"
                style={{
                    backgroundColor: 'transparent',
                    touchAction: 'none' // 모바일 스크롤 방지
                }}
                zoomControl={false}        // + - 버튼 제거
                dragging={false}          // 드래그 비활성화 (모바일용)
                scrollWheelZoom={false}   // 스크롤 줌 비활성화
                doubleClickZoom={false}   // 더블클릭 줌 비활성화
                touchZoom={false}         // 터치 줌 비활성화
                boxZoom={false}           // 박스 줌 비활성화
                keyboard={false}          // 키보드 제어 비활성화
                attributionControl={false} // 저작권 표시 제거
                zoomSnap={0}              // 줌 스냅 비활성화
                zoomDelta={0}             // 줌 델타 비활성화
            >
                <GeoJSON
                    data={sidoData}
                    style={geoJsonStyle}
                    onEachFeature={onEachFeature}
                />
            </MapContainer>
        </div>
    );
}

export default KoreanMap;