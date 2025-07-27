import { LatLngBoundsExpression } from 'leaflet';

// 한국 지도 경계 (웹앱 최적화 - 약간의 이동 허용)
export const KOREAN_BOUNDS: LatLngBoundsExpression = [
    [32.0, 123.0], // 남서쪽 (조금 더 넓게)
    [40.0, 133.0]  // 북동쪽 (조금 더 넓게)
];

// 지도 설정 상수
export const MAP_CONFIG = {
    minZoom: 6,
    maxZoom: 10,
    maxBoundsViscosity: 0.8
} as const;