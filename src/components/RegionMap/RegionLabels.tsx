import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

interface RegionLabelsProps {
    sigunguCenters: Array<{
        name: string;
        lat: number;
        lng: number;
    }>;
}

function RegionLabels({ sigunguCenters }: RegionLabelsProps) {
    const map = useMap();

    // 텍스트 크기 계산 함수
    const calculateTextSize = (text: string, fontSize: number = 11) => {
        // 대략적인 크기 계산 (한글/영문 고려)
        const koreanCharWidth = fontSize * 0.9;
        const englishCharWidth = fontSize * 0.6;

        let width = 0;
        for (let char of text) {
            if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(char)) {
                width += koreanCharWidth;
            } else {
                width += englishCharWidth;
            }
        }

        return {
            width: Math.ceil(width + 4), // 여백 추가
            height: fontSize + 4
        };
    };

    useEffect(() => {
        // 전용 pane 생성
        let labelPane = map.getPane('regionLabels');
        if (!labelPane) {
            labelPane = map.createPane('regionLabels');
            labelPane.style.zIndex = '650';
            labelPane.style.pointerEvents = 'none';
        }

        // 기존 레이블 제거
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker && (layer as any)._isRegionLabel) {
                map.removeLayer(layer);
            }
        });

        // 새로운 레이블 추가
        sigunguCenters.forEach(({ name, lat, lng }) => {
            const textSize = calculateTextSize(name, 11);

            const labelIcon = L.divIcon({
                className: 'region-label-dynamic',
                html: `<span>${name}</span>`,
                iconSize: [textSize.width, textSize.height],
                iconAnchor: [textSize.width / 2, textSize.height / 2],
            });

            const marker = L.marker([lat, lng], {
                icon: labelIcon,
                interactive: false,
                pane: 'regionLabels'
            });

            (marker as any)._isRegionLabel = true;
            marker.addTo(map);
        });

        return () => {
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker && (layer as any)._isRegionLabel) {
                    map.removeLayer(layer);
                }
            });
        };
    }, [map, sigunguCenters]);

    return null;
}

export default RegionLabels;