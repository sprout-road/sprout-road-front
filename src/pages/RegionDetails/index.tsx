import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import RegionMap from '../../components/RegionMap';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';
import {useLocationContext} from '../../contexts/LocationContext';
import {SigunguGeoJson} from '../../types/geoTypes';
import {LocationApiService} from '../../services/locationApi';
import Header from '../../components/Header';

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
            {/* 지역 상세용 헤더 */}
            <Header type="detail" title={"트래블 로그"} />

            {/* 현재 위치 정보 - 헤더 바로 아래 */}
            {currentLocation && (
                <div className="absolute top-18 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-800">
                            {currentLocation.targetName}
                        </span>
                    </div>
                </div>
            )}

            {/* 지역 지도 */}
            <div className="pt-16 h-full">
                {sigunguData && (
                    <RegionMap
                        sigunguData={sigunguData}
                        highlightInfo={currentLocation}
                        regionName={regionName}
                    />
                )}
            </div>
        </div>
    );
}

export default RegionDetail;