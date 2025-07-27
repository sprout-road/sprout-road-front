import { PathOptions } from 'leaflet';
import { LocationHighlightResponse } from '../../types/geoTypes';

interface SidoFeatureProperties {
    sidoCode: string;
    sidoNameKo: string;
    sidoNameEn: string;
}

interface SidoFeature {
    properties: SidoFeatureProperties;
}

interface SigunguFeature {
    properties: { sigCode: string };
}

// ✅ 시도 스타일링 함수 (Leaflet 타입 맞춤)
export const getSidoStyle = (
    feature: SidoFeature | undefined,
    highlightInfo: LocationHighlightResponse | null
): PathOptions => {
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
export const getSigunguStyle = (
    feature: SigunguFeature | undefined,
    highlightInfo: LocationHighlightResponse | null
): PathOptions => {
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