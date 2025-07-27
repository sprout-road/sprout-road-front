interface MapControlsProps {
    showMarker: boolean;
    onToggleMarker: () => void;
}

function MapControls({ showMarker, onToggleMarker }: MapControlsProps) {
    return (
        <button
            onClick={onToggleMarker}
            className={`
                absolute bottom-6 right-6 z-10 
                w-12 h-12 rounded-full shadow-lg
                transition-all duration-200 ease-in-out
                flex items-center justify-center
                ${showMarker
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-400 hover:bg-gray-500 text-white'
            }
            `}
            title={showMarker ? "위치 마커 숨기기" : "위치 마커 보기"}
        >
            {showMarker ? (
                // 위치 표시 중 아이콘
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
            ) : (
                // 위치 숨김 중 아이콘
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    <path d="M2 2l20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            )}
        </button>
    );
}

export default MapControls;