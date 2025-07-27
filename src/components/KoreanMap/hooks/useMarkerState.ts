import { useState } from 'react';

export const useMarkerState = () => {
    // 🗂️ LocalStorage에서 마커 표시 상태 불러오기
    const [showMarker, setShowMarker] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem('map_show_marker');
            return saved !== null ? JSON.parse(saved) : true; // 기본값: true
        } catch (error) {
            console.error('LocalStorage 읽기 실패:', error);
            return true;
        }
    });

    // 🗂️ 마커 표시 상태가 변경될 때 LocalStorage에 저장
    const toggleMarker = () => {
        const newState = !showMarker;
        setShowMarker(newState);

        try {
            localStorage.setItem('map_show_marker', JSON.stringify(newState));
            console.log('🗂️ 마커 상태 저장:', newState);
        } catch (error) {
            console.error('LocalStorage 저장 실패:', error);
        }
    };

    return {
        showMarker,
        toggleMarker
    };
};