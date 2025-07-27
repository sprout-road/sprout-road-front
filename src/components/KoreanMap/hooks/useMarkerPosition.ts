import { useState, useEffect } from 'react';
import { LatLng } from 'leaflet';
import { LocationHighlightResponse } from '../../../types/geoTypes';
import { getMarkerPosition } from '../../../shared/utils/markerUtils';

export const useMarkerPosition = (highlightInfo: LocationHighlightResponse | null) => {
    const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);

    useEffect(() => {
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
    }, [highlightInfo]);

    return markerPosition;
};