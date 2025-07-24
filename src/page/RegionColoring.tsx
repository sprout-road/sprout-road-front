import { useEffect, useState } from 'react';
import KoreanMap from '../components/KoreanMap';
import { SidoGeoJson, LocationHighlightResponse } from '../types/geoTypes';
import { LocationApiService } from '../services/locationApi';

// 🗂️ 로컬 스토리지 키
const LOCATION_STORAGE_KEY = 'current_user_location';

interface StoredLocation {
    lat: number;
    lng: number;
    accuracy: number;
    timestamp: number;
    locationName: string;
}

function RegionColoring() {
    const [sidoData, setSidoData] = useState<SidoGeoJson | null>(null);
    const [highlightInfo, setHighlightInfo] = useState<LocationHighlightResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 시도 데이터 로드
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

    // 🗂️ 로컬스토리지에 위치 저장
    const saveLocationToStorage = (lat: number, lng: number, accuracy: number, locationName: string) => {
        try {
            const data: StoredLocation = {
                lat,
                lng,
                accuracy,
                timestamp: Date.now(),
                locationName
            };
            localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(data));
            console.log('💾 위치 업데이트 저장:', data);
        } catch (error) {
            console.error('로컬스토리지 저장 실패:', error);
        }
    };

    // 🎯 위치 기반 하이라이트 정보 조회
    const fetchHighlightInfo = async (lat: number, lng: number) => {
        try {
            const highlight = await LocationApiService.findLocationForHighlight(lat, lng);
            console.log('✅ 하이라이트 정보:', highlight);
            setHighlightInfo(highlight);
            return highlight;
        } catch (err) {
            console.error('❌ 위치 하이라이트 조회 실패:', err);
            throw new Error('위치 정보 조회에 실패했습니다.');
        }
    };

    // 🎯 GPS 위치 조회 (항상 새로 조회)
    const getCurrentLocationAndUpdate = async () => {
        setLocationLoading(true);
        setError(null);

        try {
            console.log('🎯 GPS로 현재 위치 조회 중...');

            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.'));
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: false, // ✅ 고정밀도 비활성화 (더 안정적)
                        timeout: 20000,           // ✅ 20초로 늘림
                        maximumAge: 300000,       // ✅ 5분 캐시 허용 (충분히 신선함)
                    }
                );
            });

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            console.log(`📍 GPS 위치: ${lat}, ${lng} (정확도: ${accuracy}m)`);

            // 서버에서 지역 정보 조회
            const highlight = await fetchHighlightInfo(lat, lng);

            // 로컬스토리지에 위치 정보 저장/업데이트
            saveLocationToStorage(lat, lng, accuracy, highlight.targetName);

        } catch (gpsError) {
            console.error('GPS 조회 실패:', gpsError);

            let errorMessage = '';
            if (gpsError instanceof GeolocationPositionError) {
                switch (gpsError.code) {
                    case gpsError.PERMISSION_DENIED:
                        errorMessage = 'GPS 권한이 거부되었습니다. 새로고침 후 위치 권한을 허용해주세요.';
                        break;
                    case gpsError.POSITION_UNAVAILABLE:
                        errorMessage = 'GPS 신호를 받을 수 없습니다. 실외로 이동 후 새로고침해주세요.';
                        break;
                    case gpsError.TIMEOUT:
                        errorMessage = 'GPS 요청 시간이 초과되었습니다. 새로고침해주세요.';
                        break;
                    default:
                        errorMessage = 'GPS 위치를 가져올 수 없습니다. 새로고침해주세요.';
                        break;
                }
            } else {
                errorMessage = gpsError instanceof Error ? gpsError.message : '위치를 가져올 수 없습니다.';
            }

            setError(errorMessage);
        } finally {
            setLocationLoading(false);
        }
    };

    // ✅ 페이지 로드시 무조건 GPS 조회
    useEffect(() => {
        if (sidoData) {
            getCurrentLocationAndUpdate();
        }
    }, [sidoData]);

    // 📱 로딩 상태들
    if (loading) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <div className="text-gray-600">지도 데이터 로딩 중...</div>
            </div>
        );
    }

    if (locationLoading) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <div className="text-gray-600">GPS로 현재 위치 확인 중...</div>
                <div className="text-sm text-gray-400">최신 위치로 업데이트합니다</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white text-center px-6 space-y-6">
                <div className="text-8xl">📍</div>
                <div>
                    <div className="text-xl font-semibold text-gray-800 mb-2">GPS 위치 확인 실패</div>
                    <div className="text-gray-600 mb-4 max-w-md">{error}</div>
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                    🔄 새로고침
                </button>

                <div className="text-xs text-gray-400 max-w-md space-y-1">
                    <div>💡 GPS 문제 해결 방법:</div>
                    <div>• Chrome: 주소창 좌측 🔒 아이콘 → 위치 허용</div>
                    <div>• 실외로 이동 후 새로고침</div>
                    <div>• 시스템 설정 → 개인정보보호 → 위치서비스 확인</div>
                </div>
            </div>
        );
    }

    // 🗺️ 메인 지도 화면 (상단 위치 정보 박스 및 새로고침 버튼 제거)
    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white">
            {/* 지도 */}
            {sidoData && (
                <KoreanMap
                    sidoData={sidoData}
                    highlightInfo={highlightInfo}
                />
            )}
        </div>
    );
}

export default RegionColoring;