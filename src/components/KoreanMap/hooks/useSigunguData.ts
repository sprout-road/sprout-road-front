import { useState, useEffect } from 'react';
import { SigunguGeoJson, LocationHighlightResponse } from '../../../types/geoTypes';
import { LocationApiService } from '../../../services/locationApi';

export const useSigunguData = (highlightInfo: LocationHighlightResponse | null) => {
    const [sigunguData, setSigunguData] = useState<SigunguGeoJson | null>(null);

    useEffect(() => {
        const loadSigunguIfNeeded = async () => {
            if (highlightInfo?.highlightType === 'sigungu' && highlightInfo.parentSidoCode) {
                try {
                    console.log('🗺️ 시군구 데이터 로드:', highlightInfo.parentSidoCode);
                    const data = await LocationApiService.getSigunguBySidoCode(highlightInfo.parentSidoCode);
                    setSigunguData(data);
                } catch (error) {
                    console.error('❌ 시군구 데이터 로드 실패:', error);
                }
            } else {
                setSigunguData(null);
            }
        };

        loadSigunguIfNeeded();
    }, [highlightInfo]);

    return sigunguData;
};