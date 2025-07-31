import { useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';

interface RegionLabelsProps {
    sigunguCenters: Array<{
        name: string;
        lat: number;
        lng: number;
    }>;
}

// 지역명 라벨을 지도 위에 표시하는 컴포넌트
function RegionLabels({ sigunguCenters }: RegionLabelsProps) {
    const map = useMap();
    const [labels, setLabels] = useState<Array<{
        name: string;
        x: number;
        y: number;
    }>>([]);

    // 지도 이동/줌 시 라벨 위치 업데이트
    useEffect(() => {
        const updateLabelPositions = () => {
            const newLabels = sigunguCenters.map(center => {
                const point = map.latLngToContainerPoint([center.lat, center.lng]);
                return {
                    name: center.name,
                    x: point.x,
                    y: point.y
                };
            });
            setLabels(newLabels);
        };

        // 초기 위치 설정
        updateLabelPositions();

        // 지도 이벤트 리스너 등록
        map.on('zoom', updateLabelPositions);
        map.on('move', updateLabelPositions);
        map.on('resize', updateLabelPositions);

        // 클린업
        return () => {
            map.off('zoom', updateLabelPositions);
            map.off('move', updateLabelPositions);
            map.off('resize', updateLabelPositions);
        };
    }, [map, sigunguCenters]);

    return (
        <>
            {labels.map((label, index) => (
                <div
                    key={`label-${index}`}
                    className="absolute pointer-events-none select-none z-10"
                    style={{
                        left: label.x,
                        top: label.y,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div className={`px-2 py-1 rounded text-[10px] whitespace-nowrap ${'text-gray-700'}`}>
                        {label.name}
                    </div>
                </div>
            ))}
        </>
    );
}

export default RegionLabels;