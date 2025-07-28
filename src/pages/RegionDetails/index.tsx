import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import RegionMap from '../../components/RegionMap';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';
import TravelLogSection from '../../components/TravelLogSection';
import {useLocationContext} from '../../contexts/LocationContext';
import {SigunguGeoJson} from '../../types/geoTypes';
import {LocationApiService} from '../../services/locationApi';
import Header from '../../components/common/Header';

function RegionDetail() {
    const { sidoCode } = useParams<{ sidoCode: string }>();
    const navigate = useNavigate();
    const { currentLocation } = useLocationContext();

    const [sigunguData, setSigunguData] = useState<SigunguGeoJson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [regionName, setRegionName] = useState<string>('');

    const navigateBack = () => {
        navigate('/region-coloring')
    }

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
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white flex flex-col">
            {/* 지역 상세용 헤더 */}
            <Header onClick={navigateBack}>트레블 로그</Header>

            {/* 메인 컨텐츠 영역 - 헤더 아래 */}
            <div className="pt-2 flex-1 p-4 flex flex-col gap-4">
                {/* 상단: 지도 영역 (55%) + 현재 위치 정보 */}
                <div className="relative h-[55%] bg-white border-2 border-[#C9E7CA] rounded-lg overflow-hidden mt-2">
                    {/* 현재 위치 정보 - 지도 내부 상단 */}
                    {currentLocation && (
                        <div className="absolute z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-800">
                                    {currentLocation.targetName}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* 지도 */}
                    {sigunguData && (
                        <RegionMap
                            sigunguData={sigunguData}
                            highlightInfo={currentLocation}
                            regionName={regionName}
                            isCompact={true}
                        />
                    )}
                </div>

                {/* 하단: 트래블 로그 영역 (45%) */}
                <div className="h-[45%]">
                    <TravelLogSection />
                </div>
            </div>
        </div>
    );
}

export default RegionDetail;