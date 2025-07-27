import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RegionMap from '../../components/RegionMap';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';
import { useLocationContext } from '../../contexts/LocationContext';
import { SigunguGeoJson } from '../../types/geoTypes';
import { LocationApiService } from '../../services/locationApi';

function RegionDetail() {
    const { sidoCode } = useParams<{ sidoCode: string }>();
    const navigate = useNavigate();
    const { currentLocation } = useLocationContext();

    const [sigunguData, setSigunguData] = useState<SigunguGeoJson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [regionName, setRegionName] = useState<string>('');

    // 시군구 데이터 로드
    useEffect(() => {
        const fetchSigunguData = async () => {
            if (!sidoCode) {
                setError('올바르지 않은 지역 코드입니다.');
                setLoading(false);
                return;
            }

            try {
                console.log('🗺️ 지역 상세 데이터 로드:', sidoCode);
                const data = await LocationApiService.getSigunguBySidoCode(sidoCode);
                setSigunguData(data);

                // 지역명 추출 (첫 번째 feature에서)
                if (data.features && data.features.length > 0) {
                    const firstFeature = data.features[0];
                    if (firstFeature.properties && firstFeature.properties.sidoNameKo) {
                        setRegionName(firstFeature.properties.sidoNameKo);
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : '지역 데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchSigunguData();
    }, [sidoCode]);

    // 현재 위치가 이 시도에 속하는지 체크
    const isCurrentLocationInThisRegion = (): boolean => {
        if (!currentLocation || !sidoCode) return false;
        return currentLocation.parentSidoCode === sidoCode;
    };

    if (loading) {
        return (
            <LoadingSpinner
                message="지역 지도 로딩 중..."
        color="blue"
            />
    );
    }

    if (error) {
        return (
            <ErrorDisplay
                title="지역 데이터 로드 실패"
        message={error}
        onRetry={() => navigate('/region-coloring')}
        retryText="← 전체 지도로 돌아가기"
            />
    );
    }

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white">
            {/* 상단 헤더 */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm">
    <div className="flex items-center justify-between p-4">
    <button
        onClick={() => navigate('/region-coloring')}
    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
    >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    전체 지도
    </button>

    <h1 className="text-lg font-semibold text-gray-800">
        {regionName || '지역 상세'}
    </h1>

    <div className="w-20"></div> {/* 균형을 위한 빈 공간 */}
    </div>
    </div>

    {/* 지역 지도 */}
    <div className="pt-16 h-full">
        {sigunguData && (
            <RegionMap
                sigunguData={sigunguData}
    highlightInfo={isCurrentLocationInThisRegion() ? currentLocation : null}
    regionName={regionName}
    />
)}
    </div>
    </div>
);
}

export default RegionDetail;