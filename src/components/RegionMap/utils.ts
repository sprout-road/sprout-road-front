import {LatLngBoundsExpression, PathOptions} from 'leaflet';
import {Feature, Geometry} from 'geojson';
import {RegionGeoJson} from '../../types/geoTypes';
import {MAP_CONFIG, STYLE_CONFIG} from './constants';

interface Bounds {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
}

// 서버에서 받는 실제 데이터 구조에 맞게 수정 (RegionProperties 기반)
export type SigunguFeature = Feature<Geometry, {
    regionCode: string;
    regionName: string;
    centerLat: number;
    centerLng: number;
}>;

// 타입 가드 함수 - RegionProperties 구조에 맞게 수정
export const isSigunguFeature = (feature: Feature<Geometry, unknown> | undefined): feature is SigunguFeature => {
    if (!feature?.properties) return false;

    const props = feature.properties as Record<string, unknown>;

    // RegionProperties에 있는 필드들로 체크
    return typeof props.regionCode === 'string' &&
        typeof props.regionName === 'string' &&
        typeof props.centerLat === 'number' &&
        typeof props.centerLng === 'number';
};

// 좌표 처리 헬퍼 함수
export const processCoordinates = (coord: number[], bounds: Bounds): void => {
    const lng = coord[0];
    const lat = coord[1];
    bounds.minLat = Math.min(bounds.minLat, lat);
    bounds.maxLat = Math.max(bounds.maxLat, lat);
    bounds.minLng = Math.min(bounds.minLng, lng);
    bounds.maxLng = Math.max(bounds.maxLng, lng);
};

// 지역 경계 계산
export const calculateRegionBounds = (regionData: RegionGeoJson): LatLngBoundsExpression => {
    if (!regionData.features || regionData.features.length === 0) {
        return MAP_CONFIG.DEFAULT_BOUNDS;
    }

    const bounds: Bounds = {
        minLat: Infinity,
        maxLat: -Infinity,
        minLng: Infinity,
        maxLng: -Infinity
    };

    regionData.features.forEach((feature) => {
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

    // 여백 추가
    const latPadding = (bounds.maxLat - bounds.minLat) * MAP_CONFIG.BOUNDS_PADDING;
    const lngPadding = (bounds.maxLng - bounds.minLng) * MAP_CONFIG.BOUNDS_PADDING;

    return [
        [bounds.minLat - latPadding, bounds.minLng - lngPadding],
        [bounds.maxLat + latPadding, bounds.maxLng + lngPadding]
    ];
};

// 시군구 중심점 계산 - 타입 안전하게 수정
export const calculateSigunguCenters = (regionData: RegionGeoJson) => {
    if (!regionData.features) return [];

    return regionData.features
        .map((feature) => ({
            name: feature.properties.regionName,
            lat: feature.properties.centerLat,
            lng: feature.properties.centerLng
        }));
};

// 시군구 스타일링 (Leaflet 타입과 호환)
export const getSigunguStyle = (
    feature: Feature<Geometry, unknown> | undefined
): PathOptions => {
    if (!feature || !isSigunguFeature(feature)) return STYLE_CONFIG.SIGUNGU.DEFAULT;

    return {
        ...STYLE_CONFIG.SIGUNGU.DEFAULT,
        className: 'cursor-pointer'
    };
};

// 시도 바운더리 스타일
export const getBoundaryStyle = (isCompact: boolean) => ({
    ...STYLE_CONFIG.BOUNDARY,
    weight: isCompact ? 2 : 3
});