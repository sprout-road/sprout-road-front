import { PathOptions } from 'leaflet';

interface SidoFeatureProperties {
    sidoCode: string;
    sidoNameKo: string;
    sidoNameEn: string;
}

interface SidoFeature {
    properties: SidoFeatureProperties;
}

// ✅ 시도 스타일링 함수 (Leaflet 타입 맞춤)
export const getSidoStyle = (
    feature: SidoFeature | undefined
): PathOptions => {
    if (!feature) return {};

    return {
        color: '#666666',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.0
    };
};
