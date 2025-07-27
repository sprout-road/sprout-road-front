import { Layer, PathOptions } from 'leaflet';
import { Feature, Geometry } from 'geojson';
import { LocationHighlightResponse } from '../../types/geoTypes';
import { getSigunguStyle, isSigunguFeature } from './utils';
import { STYLE_CONFIG } from './constants';

// 시군구 이벤트 핸들러 생성 (Leaflet 타입과 호환)
export const createSigunguEventHandler = (
    highlightInfo: LocationHighlightResponse | null
) => {
    return (feature: Feature<Geometry, unknown>, layer: Layer) => {
        // 타입 가드로 안전하게 체크
        if (!isSigunguFeature(feature)) return;

        // 클릭 이벤트
        layer.on('click', () => {
            console.log('클릭한 시군구:', feature.properties);
            // 추후 시군구 상세 페이지로 이동하거나 추가 기능 구현
        });

        // 하이라이트된 지역이 아닌 경우에만 마우스 오버 효과 적용
        const isHighlighted = highlightInfo?.highlightType === 'sigungu' &&
            feature.properties.sigCode === highlightInfo.targetCode;

        if (!isHighlighted) {
            const styledLayer = layer as Layer & { setStyle: (style: PathOptions) => void };

            layer.on('mouseover', () => {
                styledLayer.setStyle(STYLE_CONFIG.SIGUNGU.HOVER);
            });

            layer.on('mouseout', () => {
                styledLayer.setStyle(getSigunguStyle(feature, highlightInfo));
            });
        }
    };
};