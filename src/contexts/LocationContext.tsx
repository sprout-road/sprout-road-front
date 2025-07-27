/* eslint-disable react-refresh/only-export-components */
import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {LocationHighlightResponse, SigunguGeoJson} from '../types/geoTypes';
import {LocationApiService} from '../services/locationApi';
import {useGeolocation} from '../shared/hooks/useGeolocation';
import {
    getLocationFromStorage,
    getSigunguDataFromStorage,
    saveLocationToStorage,
    saveSigunguDataToStorage,
    StoredLocation
} from '../shared/utils/locationStorage';

// 5분 = 300,000ms
const LOCATION_CACHE_DURATION = 5 * 60 * 1000;

interface LocationContextType {
    currentLocation: LocationHighlightResponse | null;
    currentSigunguData: SigunguGeoJson | null;
    isLocationLoading: boolean;
    locationError: string | null;
    refreshLocation: () => Promise<void>;
    isLocationStale: boolean; // 위치 정보가 오래되었는지
}

// Context 기본값 정의
const defaultLocationContext: LocationContextType = {
    currentLocation: null,
    currentSigunguData: null,
    isLocationLoading: false,
    locationError: null,
    refreshLocation: async () => {
        throw new Error('useLocationContext must be used within a LocationProvider');
    },
    isLocationStale: false
};

const LocationContext = createContext<LocationContextType>(defaultLocationContext);

interface LocationProviderProps {
    children: ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
    const [currentLocation, setCurrentLocation] = useState<LocationHighlightResponse | null>(null);
    const [currentSigunguData, setCurrentSigunguData] = useState<SigunguGeoJson | null>(null);
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isLocationStale, setIsLocationStale] = useState(false);

    const { getCurrentLocation } = useGeolocation();

    // 🕐 위치 정보 만료 체크
    const checkLocationFreshness = (storedLocation: StoredLocation | null): boolean => {
        if (!storedLocation) return false;

        const now = Date.now();
        const isExpired = (now - storedLocation.timestamp) > LOCATION_CACHE_DURATION;

        if (isExpired) {
            console.log('📍 저장된 위치 정보가 만료됨 (5분 초과)');
            return false;
        }

        console.log('📍 저장된 위치 정보 사용 (5분 이내)');
        return true;
    };

    // 🎯 서버에서 하이라이트 정보 조회
    const fetchHighlightInfo = async (lat: number, lng: number): Promise<LocationHighlightResponse> => {
        try {
            const highlight = await LocationApiService.findLocationForHighlight(lat, lng);
            console.log('✅ 하이라이트 정보 조회 성공:', highlight);
            return highlight;
        } catch (err) {
            console.error('❌ 위치 하이라이트 조회 실패:', err);
            throw new Error('위치 정보 조회에 실패했습니다.');
        }
    };

    // 🗺️ 시군구 데이터 로드 (캐시 우선)
    const loadSigunguData = async (highlightInfo: LocationHighlightResponse): Promise<SigunguGeoJson | null> => {
        if (highlightInfo.highlightType !== 'sigungu' || !highlightInfo.parentSidoCode) {
            return null;
        }

        try {
            // 캐시된 데이터 먼저 확인
            const cachedData = getSigunguDataFromStorage(highlightInfo.parentSidoCode);
            if (cachedData) {
                return cachedData;
            }

            // 캐시 없으면 서버에서 조회
            console.log('🗺️ 시군구 데이터 서버 조회:', highlightInfo.parentSidoCode);
            const data = await LocationApiService.getSigunguBySidoCode(highlightInfo.parentSidoCode);

            // 캐시에 저장
            saveSigunguDataToStorage(highlightInfo.parentSidoCode, data);

            return data;
        } catch (error) {
            console.error('❌ 시군구 데이터 로드 실패:', error);
            return null;
        }
    };

    // 🔄 위치 정보 갱신
    const refreshLocation = async (): Promise<void> => {
        if (isLocationLoading) {
            console.log('⏳ 이미 위치 조회 중...');
            return;
        }

        setIsLocationLoading(true);
        setLocationError(null);
        setIsLocationStale(false);

        try {
            // GPS로 현재 위치 조회
            const gpsLocation = await getCurrentLocation();

            // 서버에서 하이라이트 정보 조회
            const highlight = await fetchHighlightInfo(gpsLocation.lat, gpsLocation.lng);

            // 시군구 데이터도 함께 로드
            const sigunguData = await loadSigunguData(highlight);

            // 상태 업데이트
            setCurrentLocation(highlight);
            setCurrentSigunguData(sigunguData);

            // 로컬스토리지 업데이트
            saveLocationToStorage(
                gpsLocation.lat,
                gpsLocation.lng,
                gpsLocation.accuracy,
                highlight
            );

            console.log('🎯 위치 정보 갱신 완료:', highlight);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '위치 조회 실패';
            setLocationError(errorMessage);
            console.error('❌ 위치 갱신 실패:', error);
        } finally {
            setIsLocationLoading(false);
        }
    };

    // 🕐 5분마다 자동 갱신 체크
    useEffect(() => {
        const interval = setInterval(() => {
            const stored = getLocationFromStorage();
            if (stored && !checkLocationFreshness(stored)) {
                console.log('⏰ 5분 경과 - 위치 정보 자동 갱신 필요');
                setIsLocationStale(true);
                // 자동 갱신하거나 사용자에게 알림 (선택)
                // refreshLocation(); // 자동 갱신하려면 주석 해제
            }
        }, 60 * 1000); // 1분마다 체크

        return () => clearInterval(interval);
    }, []);

    // 🚀 초기 위치 정보 로드
    useEffect(() => {
        const initializeLocation = async () => {
            const stored = getLocationFromStorage();

            if (stored && checkLocationFreshness(stored)) {
                // 5분 이내 데이터 있음 → 캐시된 하이라이트 정보 사용
                try {
                    setIsLocationLoading(true);

                    // 저장된 하이라이트 정보 복원
                    setCurrentLocation(stored.highlightInfo);

                    // 시군구 데이터도 복원 (필요시)
                    const sigunguData = await loadSigunguData(stored.highlightInfo);
                    setCurrentSigunguData(sigunguData);

                    console.log('📦 캐시된 위치 정보 완전 복원');
                } catch (error) {
                    console.log('❌ 캐시된 위치로 조회 실패, 새로 조회');
                    await refreshLocation();
                } finally {
                    setIsLocationLoading(false);
                }
            } else {
                // 캐시 없거나 만료됨 → 새로 조회
                console.log('🔄 위치 정보 없거나 만료됨, 새로 조회');
                await refreshLocation();
            }
        };

        initializeLocation();
    }, []);

    const value: LocationContextType = {
        currentLocation,
        currentSigunguData,
        isLocationLoading,
        locationError,
        refreshLocation,
        isLocationStale
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
}

// 🪝 커스텀 훅 (명시적 타입 단언)
export const useLocationContext = (): LocationContextType => {
    const context = useContext(LocationContext);

    // Provider 밖에서 사용했는지 체크
    if (context === defaultLocationContext) {
        throw new Error('useLocationContext must be used within a LocationProvider');
    }

    // TypeScript에게 이게 유효한 context임을 알려줌
    return context as LocationContextType;
};