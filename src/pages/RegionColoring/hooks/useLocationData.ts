import { useState, useEffect } from 'react';
import { SidoGeoJson, LocationHighlightResponse } from '../../../types/geoTypes';
import { LocationApiService } from '../../../services/locationApi';
import { useGeolocation } from '../../../shared/hooks/useGeolocation';
import { saveLocationToStorage } from '../../../shared/utils/locationStorage';

interface UseLocationDataReturn {
    sidoData: SidoGeoJson | null;
    highlightInfo: LocationHighlightResponse | null;
    loading: boolean;
    locationLoading: boolean;
    error: string | null;
}

export const useLocationData = (): UseLocationDataReturn => {
    const [sidoData, setSidoData] = useState<SidoGeoJson | null>(null);
    const [highlightInfo, setHighlightInfo] = useState<LocationHighlightResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { getCurrentLocation, loading: locationLoading, error: geoError } = useGeolocation();

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

    // 🎯 GPS 위치 조회 및 하이라이트 업데이트
    const updateLocationAndHighlight = async () => {
        try {
            const location = await getCurrentLocation();
            const highlight = await fetchHighlightInfo(location.lat, location.lng);
            saveLocationToStorage(location.lat, location.lng, location.accuracy, highlight.targetName);
        } catch (err) {
            // 에러는 useGeolocation에서 이미 처리됨
        }
    };

    // ✅ 페이지 로드시 무조건 GPS 조회
    useEffect(() => {
        if (sidoData) {
            updateLocationAndHighlight();
        }
    }, [sidoData]);

    // Geolocation 에러를 상위로 전달
    useEffect(() => {
        if (geoError) {
            setError(geoError);
        }
    }, [geoError]);

    return {
        sidoData,
        highlightInfo,
        loading,
        locationLoading,
        error
    };
};