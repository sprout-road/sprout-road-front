import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import RegionMap from '../../components/RegionMap';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';
import TravelLogSection from '../../components/TravelLog/TravelLogSection';
import {useLocationContext} from '../../contexts/LocationContext';
import {RegionGeoJson} from '../../types/geoTypes';
import {LocationApiService} from '../../services/locationApi';
import Header from '../../components/common/Header';
import MissionLegend from "../../components/common/MissionLegend.tsx";

function RegionDetail() {
    const { sidoCode } = useParams<{ sidoCode: string }>();
    const navigate = useNavigate();
    const { currentLocation } = useLocationContext();

    const [regionData, setRegionData] = useState<RegionGeoJson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [regionName, setRegionName] = useState<string>('');
    const [missionCounts, setMissionCounts] = useState<Map<string, number>>(new Map());

    // 선택된 시군구 정보 상태
    const [selectedSigungu, setSelectedSigungu] = useState<{
        regionCode: string;
        regionName: string;
    } | null>(null);

    interface MissionHistoryItem {
        regionCode: string;
        count: number;
    }

    const navigateBack = () => {
        navigate('/region-coloring')
    }

    // 지도에서 시군구 클릭 핸들러 - 디버깅 추가
    const handleSigunguClick = (regionCode: string, regionName: string) => {
        console.log('🗺️ RegionDetail에서 시군구 클릭 받음:', { regionCode, regionName });
        setSelectedSigungu({ regionCode, regionName });
        console.log('🗺️ selectedSigungu 상태 업데이트:', { regionCode, regionName });
    };

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

                const [regionData, missionHistory] = await Promise.all([
                    LocationApiService.getRegionBySidoCode(sidoCode),
                    LocationApiService.getMissionHistory()
                ]);

                setRegionData(regionData);

                const filteredMissions = (missionHistory as MissionHistoryItem[]).filter(item => item.regionCode.startsWith(sidoCode));
                const missionCountMap = new Map(filteredMissions.map(item => [item.regionCode, item.count]));
                setMissionCounts(missionCountMap);

                // 지역명 추출 (첫 번째 feature에서)
                if (regionData.features && regionData.features.length > 0) {
                    const firstFeature = regionData.features[0];
                    if (firstFeature.properties && firstFeature.properties.regionName) {
                        setRegionName(firstFeature.properties.regionName);
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

    // selectedSigungu 상태 변화 감지
    useEffect(() => {
        console.log('🗺️ selectedSigungu 상태 변화:', selectedSigungu);
    }, [selectedSigungu]);

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
            <div className="pt-14 flex-1 p-4 flex flex-col gap-4">
                {/* 상단: 지도 영역 (55%) + 현재 위치 정보 */}
                <div className="relative h-[55%] bg-white border-2 border-[#C9E7CA] rounded-lg overflow-hidden mt-2">
                    {/* 현재 위치 정보 - 지도 내부 상단 */}
                    {currentLocation && (
                        <div className="absolute z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-800">
                                    {currentLocation.regionName}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* 지도 */}
                    {regionData && (
                        <RegionMap
                            regionData={regionData}
                            sidoCode={sidoCode}
                            location={currentLocation}
                            regionName={regionName}
                            isCompact={true}
                            onSigunguClick={handleSigunguClick}
                            missionCounts={missionCounts}
                        />
                    )}

                    {missionCounts.size > 0 && (
                        <MissionLegend missionCounts={missionCounts} />
                    )}
                </div>

                {/* 하단: 트래블 로그 영역 (45%) */}
                <div className="h-[45%]">
                    <TravelLogSection
                        sigunguCode={selectedSigungu?.regionCode || ''}
                        region={selectedSigungu?.regionName || '지역을 선택해주세요'}
                    />
                </div>
            </div>
        </div>
    );
}

export default RegionDetail;