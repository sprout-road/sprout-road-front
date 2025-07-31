import { LocationResponse } from '../../types/geoTypes';

// 🗂️ 로컬 스토리지 키
const LOCATION_STORAGE_KEY = 'current_user_location';

export interface StoredLocation {
    lat: number;
    lng: number;
    accuracy: number;
    timestamp: number;
    locationInfo: LocationResponse;
}

// 🗂️ 로컬스토리지에 위치 저장
export const saveLocationToStorage = (
    lat: number,
    lng: number,
    accuracy: number,
    locationInfo: LocationResponse
): void => {
    try {
        const data: StoredLocation = {
            lat,
            lng,
            accuracy,
            timestamp: Date.now(),
            locationInfo
        };
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(data));
        console.log('💾 위치 정보 저장:', data);
    } catch (error) {
        console.error('로컬스토리지 저장 실패:', error);
    }
};

// 🗂️ 로컬스토리지에서 위치 불러오기
export const getLocationFromStorage = (): StoredLocation | null => {
    try {
        const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('로컬스토리지 읽기 실패:', error);
        return null;
    }
};

// 🗑️ 위치 정보 삭제
export const clearLocationFromStorage = (): void => {
    try {
        localStorage.removeItem(LOCATION_STORAGE_KEY);
        console.log('🗑️ 위치 정보 삭제됨');
    } catch (error) {
        console.error('로컬스토리지 삭제 실패:', error);
    }
};