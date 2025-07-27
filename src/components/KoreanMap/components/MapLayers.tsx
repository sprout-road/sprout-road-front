import { GeoJSON, Marker } from 'react-leaflet';
import { Layer, LeafletEvent, PathOptions, LatLng } from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { SidoGeoJson, LocationHighlightResponse, SigunguGeoJson } from '../../../types/geoTypes';
import { getSidoStyle, getSigunguStyle } from '../../../shared/utils/mapStyles';
import { createLocationMarker } from '../../../shared/utils/markerUtils';

interface MapLayersProps {
    sidoData: SidoGeoJson;
    sigunguData: SigunguGeoJson | null;
    highlightInfo: LocationHighlightResponse | null;
    showMarker: boolean;
    markerPosition: LatLng | null;
}

interface FeatureProperties {
    sidoCode: string;
    sidoNameKo: string;
    sidoNameEn: string;
}

interface Feature {
    properties: FeatureProperties;
}

function MapLayers({
                       sidoData,
                       sigunguData,
                       highlightInfo,
                       showMarker,
                       markerPosition
                   }: MapLayersProps) {
    const navigate = useNavigate();

    const onEachSidoFeature = (feature: Feature, layer: Layer) => {
        // 시도 클릭 이벤트 - 지역 상세 페이지로 이동
        layer.on('click', () => {
            const properties = feature.properties;
            console.log('클릭한 시도:', properties);

            // 지역 상세 페이지로 이동
            navigate(`/region/${properties.sidoCode}`);
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
                targetLayer.setStyle(getSidoStyle(feature, highlightInfo));
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
        <>
            {/* ✅ 시도 레이어 */}
            <GeoJSON
                key="sido-layer"
                data={sidoData}
                style={(feature) => getSidoStyle(feature, highlightInfo)}
                onEachFeature={onEachSidoFeature}
            />

            {/* ✅ 시군구 레이어 (타입 맞춤) */}
            {sigunguData && (
                <GeoJSON
                    key="sigungu-layer"
                    data={sigunguData}
                    style={(feature) => getSigunguStyle(feature, highlightInfo)}
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
        </>
    );
}

export default MapLayers;