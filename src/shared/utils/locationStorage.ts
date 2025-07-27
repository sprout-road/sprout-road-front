import { LocationHighlightResponse, SigunguGeoJson } from '../../types/geoTypes';

// 🗂️ 로컬 스토리지 키
const LOCATION_STORAGE_KEY = 'current_user_location';
const SIGUNGU_CACHE_KEY = 'cached_sigungu_data';

export interface StoredLocation {
    lat: number;
    lng: number;
    accuracy: number;
    timestamp: number;
    locationName: string;
    highlightInfo: LocationHighlightResponse; // 전체 하이라이트 정보 저장
}

export interface StoredSigunguData {
    sidoCode: string;
    data: SigunguGeoJson;
    timestamp: number;
}

// 🗂️ 로컬스토리지에 위치 저장
export const saveLocationToStorage = (
    lat: number,
    lng: number,
    accuracy: number,
    highlightInfo: LocationHighlightResponse
): void => {
    try {
        const data: StoredLocation = {
            lat,
            lng,
            accuracy,
            timestamp: Date.now(),
            locationName: highlightInfo.targetName,
            highlightInfo // 전체 하이라이트 정보 저장
        };
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(data));
        console.log('💾 위치 업데이트 저장:', data);
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

// 🗺️ 시군구 데이터 저장
export const saveSigunguDataToStorage = (sidoCode: string, data: SigunguGeoJson): void => {
    try {
        const cacheData: StoredSigunguData = {
            sidoCode,
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(SIGUNGU_CACHE_KEY, JSON.stringify(cacheData));
        console.log('💾 시군구 데이터 저장:', sidoCode);
    } catch (error) {
        console.error('시군구 데이터 저장 실패:', error);
    }
};

// 🗺️ 시군구 데이터 불러오기 (5분 캐시)
export const getSigunguDataFromStorage = (sidoCode: string): SigunguGeoJson | null => {
    try {
        const stored = localStorage.getItem(SIGUNGU_CACHE_KEY);
        if (!stored) return null;

        const cacheData: StoredSigunguData = JSON.parse(stored);

        // 다른 시도이거나 5분 경과시 무효
        if (cacheData.sidoCode !== sidoCode ||
            (Date.now() - cacheData.timestamp) > 5 * 60 * 1000) {
            return null;
        }

        console.log('📦 캐시된 시군구 데이터 사용:', sidoCode);
        return cacheData.data;
    } catch (error) {
        console.error('시군구 데이터 읽기 실패:', error);
        return null;
    }
};