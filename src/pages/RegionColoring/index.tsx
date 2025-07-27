import { useEffect, useState } from 'react';
import KoreanMap from '../../components/KoreanMap/index';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';
import { useLocationContext } from '../../contexts/LocationContext';
import { SidoGeoJson } from '../../types/geoTypes';
import { LocationApiService } from '../../services/locationApi';

function RegionColoring() {
    const {
        currentLocation,
        currentSigunguData,
        isLocationLoading,
        locationError
    } = useLocationContext();

    const [sidoData, setSidoData] = useState<SidoGeoJson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 시도 데이터 로드 (한 번만)
    useEffect(() => {
        const fetchSidoData = async () => {
            try {
                const data = await LocationApiService.getAllSido();
                setSidoData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : '지도 데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchSidoData();
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
            {/* 헤더 */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <button
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        {/* 버튼 내용 */}
                    </button>
                </div>
            </div>

            {/* 현재 위치 정보 - 헤더 아래 */}
            {currentLocation && (
                <div className="absolute top-20 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-800">
                        현재 위치: {currentLocation.targetName}
                    </span>
                    </div>
                </div>
            )}

            {/* 지도 */}
            {sidoData && (
                <KoreanMap
                    sidoData={sidoData}
                    highlightInfo={currentLocation}
                    sigunguData={currentSigunguData}
                />
            )}
        </div>
    );
}

export default RegionColoring;