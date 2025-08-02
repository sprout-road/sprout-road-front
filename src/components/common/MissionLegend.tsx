interface MissionLegendProps {
    missionCounts: Map<string, number>;
}

function MissionLegend({ missionCounts }: MissionLegendProps) {
    // 최대값 계산
    const maxCount = missionCounts.size > 0 ? Math.max(...Array.from(missionCounts.values())) : 0;

    // 4단계 색상 (깃허브 스타일)
    const colors = [
        { level: 'none', color: '#e5e7eb', label: '0' },
        { level: 'light', color: '#bbf7d0', label: '1+' },
        { level: 'medium', color: '#22c55e', label: `${Math.ceil(maxCount * 0.33)}+` },
        { level: 'dark', color: '#15803d', label: `${Math.ceil(maxCount * 0.66)}+` }
    ];

    // 모든 값이 같은 경우 처리
    if (maxCount === 1) {
        colors[2].label = '1';
        colors[3].label = '1';
    }

    return (
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-10">
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">미션</span>
                <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">적음</span>
                    {colors.map((item, index) => (
                        <div
                            key={index}
                            className="w-2.5 h-2.5 rounded-sm border border-gray-200"
                            style={{ backgroundColor: item.color }}
                            title={`${item.label}개`}
                        />
                    ))}
                    <span className="text-xs text-gray-400">많음</span>
                </div>
            </div>
        </div>
    );
}

export default MissionLegend;