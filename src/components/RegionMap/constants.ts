// 지도 기본 설정
export const MAP_CONFIG = {
    DEFAULT_BOUNDS: [[33, 124], [39, 132]] as [[number, number], [number, number]],
    BOUNDS_PADDING: 0.1,
    ZOOM: {
        COMPACT: {
            MIN: 4,
            MAX: 14
        },
        NORMAL: {
            MIN: 6,
            MAX: 16
        }
    },
    BOUNDS_VISCOSITY: 0.8
} as const;

// 스타일 설정
export const STYLE_CONFIG = {
    SIGUNGU: {
        DEFAULT: {
            color: '#666666',
            weight: 1,
            opacity: 1,
            fillColor: 'transparent',
            fillOpacity: 0
        },
        HIGHLIGHTED: {
            fillColor: '#ff6b6b',
            fillOpacity: 0.6
        },
        HOVER: {
            fillColor: '#e3f2fd',
            fillOpacity: 0.3
        }
    },
    BOUNDARY: {
        color: '#666666',
        opacity: 0.7,
        fill: false
    }
} as const;