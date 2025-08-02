import {useEffect, useState} from 'react';
import KoreanMap from '../../components/KoreanMap/index';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';
import {useLocationContext} from '../../contexts/LocationContext';
import {RegionGeoJson, SidoGeoJson} from '../../types/geoTypes';
import {LocationApiService} from '../../services/locationApi';
import Header from "../../components/common/Header";

function RegionColoring() {
    const {
        currentLocation,
        isLocationLoading,
        locationError
    } = useLocationContext();

    const [sidoData, setSidoData] = useState<SidoGeoJson | null>(null);
    const [missionCounts, setMissionCounts] = useState<Map<string, number>>(new Map());
    const [regionData, setRegionData] = useState<Map<string, RegionGeoJson>>(new Map());

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 시도 데이터 로드 (한 번만)
    useEffect(() => {
        const fetchRegionData = async () => {
            try {
                const data = await LocationApiService.getAllSido();
                setSidoData(data);

                const missionHistory = await LocationApiService.getMissionHistory();
                const missionCountMap = new Map(missionHistory.map(item => [item.regionCode, item.count]));
                setMissionCounts(missionCountMap);

                const sidoCodes = new Set(missionHistory.map(item => item.regionCode.substring(0, 2)));
                const regionDataMap = new Map<string, RegionGeoJson>();
                for (const sidoCode of sidoCodes) {
                    const regionGeoJson = await LocationApiService.getRegionBySidoCode(sidoCode);
                    regionDataMap.set(sidoCode, regionGeoJson);
                }
                setRegionData(regionDataMap);
            } catch (err) {
                setError(err instanceof Error ? err.message : '지도 데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchRegionData();
    }, []);

    // 📱 로딩 상태들
    if (loading) {
        return (
            <LoadingSpinner
                message="지도 데이터 로딩 중..."
                color="blue"
            />
        );
    }

    if (isLocationLoading) {
        return (
            <LoadingSpinner
                message="GPS로 현재 위치 확인 중..."
                subMessage="최신 위치로 업데이트합니다"
                color="green"
            />
        );
    }

    if (error || locationError) {
        return (
            <ErrorDisplay
                title="GPS 위치 확인 실패"
                message={error || locationError || '알 수 없는 오류가 발생했습니다.'}
                onRetry={() => window.location.reload()}
                helpText={[
                    '💡 GPS 문제 해결 방법:',
                    '• Chrome: 주소창 좌측 🔒 아이콘 → 위치 허용',
                    '• 실외로 이동 후 새로고침',
                    '• 시스템 설정 → 개인정보보호 → 위치서비스 확인'
                ]}
            />
        );
    }

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white">
            <div className="z-14 fixed w-full">
                <Header isHome={true}/>
            </div>
            {/* 현재 위치 정보 - 헤더 바로 아래 */}
            {currentLocation && (
                <div className="absolute top-20 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-800">
                            {currentLocation.regionName}
                        </span>
                    </div>
                </div>
            )}

            {/* 지도 */}
            {sidoData && (
                <KoreanMap
                    sidoData={sidoData}
                    regionData={regionData}
                    missionCounts={missionCounts}
                />
            )}
        </div>
    );
}

export default RegionColoring;