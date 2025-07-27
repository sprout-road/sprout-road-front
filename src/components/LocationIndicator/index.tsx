import { useLocationContext } from '../../contexts/LocationContext';

interface LocationIndicatorProps {
    showRefreshButton?: boolean;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

function LocationIndicator({
                               showRefreshButton = false,
                               position = 'top-right'
                           }: LocationIndicatorProps) {
    const {
        currentLocation,
        isLocationLoading,
        isLocationStale,
        refreshLocation
    } = useLocationContext();

    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4'
    };

    if (!currentLocation && !isLocationLoading) {
        return null;
    }

    return (
        <div className={`fixed ${positionClasses[position]} z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-xs`}>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    {/* 상태 아이콘 */}
                    {isLocationLoading ? (
                        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : isLocationStale ? (
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    ) : (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    )}

                    {/* 위치 정보 */}
                    <div className="text-sm">
                        {isLocationLoading ? (
                            <span className="text-gray-600">위치 조회 중...</span>
                        ) : currentLocation ? (
                            <span className="text-gray-800 font-medium">
                                {currentLocation.targetName}
                            </span>
                        ) : (
                            <span className="text-gray-500">위치 정보 없음</span>
                        )}
                    </div>
                </div>

                {/* 새로고침 버튼 */}
                {showRefreshButton && !isLocationLoading && (
                    <button
                        onClick={refreshLocation}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="위치 정보 새로고침"
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                )}
            </div>

            {/* 만료 경고 */}
            {isLocationStale && (
                <div className="mt-2 text-xs text-orange-600">
                    위치 정보가 오래되었습니다. 새로고침을 권장합니다.
                </div>
            )}
        </div>
    );
}

export default LocationIndicator;