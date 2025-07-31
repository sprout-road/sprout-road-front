/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { LocationResponse } from '../types/geoTypes';
import { LocationApiService } from '../services/locationApi';
import { useGeolocation } from '../shared/hooks/useGeolocation';
import {
    getLocationFromStorage,
    saveLocationToStorage,
    StoredLocation
} from '../shared/utils/locationStorage';

// 5분 = 300,000ms
const LOCATION_CACHE_DURATION = 5 * 60 * 1000;

export interface LocationContextType {
    currentLocation: LocationResponse | null;
    isLocationLoading: boolean;
    locationError: string | null;
    refreshLocation: () => Promise<void>;
    isLocationStale: boolean;
}

const defaultLocationContext: LocationContextType = {
    currentLocation: null,
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
    const [currentLocation, setCurrentLocation] = useState<LocationResponse | null>(null);
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

    // 🎯 서버에서 위치 정보 조회
    const fetchLocationInfo = async (lat: number, lng: number): Promise<LocationResponse> => {
        try {
            const locationResult = await LocationApiService.findLocationV2(lat, lng);
            console.log('✅ 위치 정보 조회 성공:', locationResult);
            return locationResult;
        } catch (err) {
            console.error('❌ 위치 정보 조회 실패:', err);
            throw new Error('위치 정보 조회에 실패했습니다.');
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

            // 서버에서 위치 정보 조회
            const locationInfo = await fetchLocationInfo(gpsLocation.lat, gpsLocation.lng);

            // 상태 업데이트
            setCurrentLocation(locationInfo);

            // 로컬스토리지 업데이트
            saveLocationToStorage(
                gpsLocation.lat,
                gpsLocation.lng,
                gpsLocation.accuracy,
                locationInfo
            );

            console.log('🎯 위치 정보 갱신 완료:', locationInfo);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '위치 조회 실패';
            setLocationError(errorMessage);
            console.error('❌ 위치 갱신 실패:', err);
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
            }
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    // 🚀 초기 위치 정보 로드
    useEffect(() => {
        const initializeLocation = async () => {
            const stored = getLocationFromStorage();

            if (stored && checkLocationFreshness(stored)) {
                try {
                    setIsLocationLoading(true);

                    // 저장된 위치 정보 복원
                    setCurrentLocation(stored.locationInfo);

                    console.log('📦 캐시된 위치 정보 복원');
                } catch (err) {
                    console.log('❌ 캐시된 위치로 조회 실패, 새로 조회:', err);
                    await refreshLocation();
                } finally {
                    setIsLocationLoading(false);
                }
            } else {
                console.log('🔄 위치 정보 없거나 만료됨, 새로 조회');
                await refreshLocation();
            }
        };

        initializeLocation();
    }, []);

    const value: LocationContextType = {
        currentLocation,
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

export const useLocationContext = (): LocationContextType => {
    const context = useContext(LocationContext);

    if (context === defaultLocationContext) {
        throw new Error('useLocationContext must be used within a LocationProvider');
    }

    return context as LocationContextType;
};