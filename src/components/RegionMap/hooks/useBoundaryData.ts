import { useEffect, useState } from 'react';
import { SidoBoundaryGeoJson } from '../../../types/geoTypes';
import { LocationApiService } from '../../../services/locationApi';

export const useBoundaryData = (sidoCode: string | unknown) => {
    const [boundaryData, setBoundaryData] = useState<SidoBoundaryGeoJson | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBoundaryData = async () => {
            setLoading(true);
            setError(null);

            try {
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
    }, [sidoCode]);

    return { boundaryData, loading, error };
};