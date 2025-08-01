import {LocationResponse, SidoBoundaryGeoJson} from '../types/geoTypes';

const API_BASE_URL = 'https://api.deepdivers.store/api';

export class LocationApiService {
    /**
     * GPS 좌표로 현재 위치의 시군구 찾기 및 색칠 정보 조회
     *//*
    static async findLocationForHighlight(lat: number, lng: number): Promise<LocationHighlightResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/locate/highlight?lat=${lat}&lng=${lng}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('위치 하이라이트 정보 조회 실패:', error);
            throw new Error(error instanceof Error ? error.message : '위치 정보를 가져오는데 실패했습니다.');
        }
    }*/

    static async findLocationV2(lat: number, lng: number): Promise<LocationResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/gis/v2/locate?lat=${lat}&lng=${lng}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('위치 하이라이트 정보 조회 실패:', error);
            throw new Error(error instanceof Error ? error.message : '위치 정보를 가져오는데 실패했습니다.');
        }
    }

    /**
     * 특정 시도의 시군구 GeoJSON 데이터 조회 (면 데이터)
     */
    static async getSigunguBySidoCode(sidoCode: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/gis/sigungu/${sidoCode}`);
            console.log("RESPONSE: ", response);
            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('시군구 데이터 조회 실패:', error);
            throw new Error('시군구 데이터를 가져오는데 실패했습니다.');
        }
    }

    /**
     * 특정 시도의 지역 정보 GeoJSON 데이터 조회 (면 데이터)
     */
    static async getRegionBySidoCode(sidoCode: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/gis/regions/${sidoCode}`);
            console.log("RESPONSE: ", response);
            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('시군구 데이터 조회 실패:', error);
            throw new Error('시군구 데이터를 가져오는데 실패했습니다.');
        }
    }

    /**
     * 특정 시도의 바운더리 데이터 조회 (선 데이터)
     */
    static async getSidoBoundariesBySidoCode(sidoCode: string | unknown): Promise<SidoBoundaryGeoJson> {
        try {
            const response = await fetch(`${API_BASE_URL}/gis/sido/${sidoCode}/boundaries`);
            console.log("SIDO BOUNDARY RESPONSE: ", response);

            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('시도 바운더리 데이터 조회 실패:', error);
            throw new Error('시도 바운더리 데이터를 가져오는데 실패했습니다.');
        }
    }

    /**
     * 전체 시도 GeoJSON 데이터 조회
     */
    static async getAllSido() {
        try {
            const response = await fetch(`${API_BASE_URL}/gis/sido`);
            console.log("RESPONSE: ", response);

            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('시도 데이터 조회 실패:', error);
            throw new Error('시도 데이터를 가져오는데 실패했습니다.');
        }
    }

    static async getMissionHistory() {
        try {
            const response = await fetch(`${API_BASE_URL}/missions/history`);
            console.log("RESPONSE: ", response);

            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('시도 데이터 조회 실패:', error);
            throw new Error('시도 데이터를 가져오는데 실패했습니다.');
        }
    }
}