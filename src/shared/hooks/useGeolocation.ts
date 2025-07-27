import { useState } from 'react';

interface GeolocationResult {
    lat: number;
    lng: number;
    accuracy: number;
}

interface UseGeolocationReturn {
    getCurrentLocation: () => Promise<GeolocationResult>;
    loading: boolean;
    error: string | null;
}

export const useGeolocation = (): UseGeolocationReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCurrentLocation = async (): Promise<GeolocationResult> => {
        setLoading(true);
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

            const result = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            };

            console.log(`📍 GPS 위치: ${result.lat}, ${result.lng} (정확도: ${result.accuracy}m)`);
            return result;

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
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        getCurrentLocation,
        loading,
        error
    };
};