import { useEffect, useState } from 'react';
import { SidoBoundaryGeoJson, SigunguGeoJson } from '../../../types/geoTypes';
import { LocationApiService } from '../../../services/locationApi';

export const useBoundaryData = (sigunguData: SigunguGeoJson) => {
    const [boundaryData, setBoundaryData] = useState<SidoBoundaryGeoJson | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBoundaryData = async () => {
            if (!sigunguData.features || sigunguData.features.length === 0) return;

            setLoading(true);
            setError(null);

            try {
                // 첫 번째 feature에서 sidoCode 추출
                const sidoCode = sigunguData.features[0].properties.sidoCode;
                console.log('🔲 시도 바운더리 데이터 로드:', sidoCode);

                const boundaries = await LocationApiService.getSidoBoundariesBySidoCode(sidoCode);
                setBoundaryData(boundaries);
                console.log('✅ 시도 바운더리 데이터 로드 완료:', boundaries);
            } catch (err) {
                const errorMessage = '시도 바운더리 데이터 로드 실패';
                console.error('❌', errorMessage, err);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        loadBoundaryData();
    }, [sigunguData]);

    return { boundaryData, loading, error };
};