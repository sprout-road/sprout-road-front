import { LatLng, DivIcon } from 'leaflet';
import { LocationHighlightResponse } from '../../types/geoTypes';

// 🎯 서버에서 받은 중심 좌표로 마커 위치 설정
export const getMarkerPosition = (highlightInfo: LocationHighlightResponse): LatLng | null => {
    if (!highlightInfo) {
        console.log('❌ 하이라이트 정보 없음');
        return null;
    }

    // 서버에서 중심 좌표를 보내준 경우
    if (highlightInfo.centerLat && highlightInfo.centerLng) {
        console.log(`✅ 서버 중심 좌표 사용: [${highlightInfo.centerLat}, ${highlightInfo.centerLng}]`);
        return new LatLng(highlightInfo.centerLat, highlightInfo.centerLng);
    }

    console.log('❌ 서버에서 중심 좌표를 보내주지 않음');
    return null;
};

// 🎨 투명 배경의 깔끔한 마커 (검은 글씨)
export const createLocationMarker = (text: string): DivIcon => {
    return new DivIcon({
        html: `
            <div style="
                position: relative;
                background: rgba(255, 255, 255, 0.9);
                color: #1f2937;
                padding: 8px 12px;
                border-radius: 16px;
                font-weight: 600;
                font-size: 14px;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border: 2px solid rgba(59, 130, 246, 0.5);
                white-space: nowrap;
                transform: translateY(-8px);
                backdrop-filter: blur(8px);
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 6px;
                ">
                    <span style="
                        display: inline-block;
                        width: 6px;
                        height: 6px;
                        background: #ef4444;
                        border-radius: 50%;
                        animation: pulse 2s infinite;
                    "></span>
                    ${text}
                </div>
                <!-- 말풍선 꼬리 -->
                <div style="
                    position: absolute;
                    bottom: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-top: 6px solid rgba(255, 255, 255, 0.9);
                "></div>
            </div>
            <style>
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
                    }
                }
            </style>
        `,
        className: 'location-marker',
        iconSize: [100, 40],
        iconAnchor: [50, 35],
    });
};