import KoreanMap from '../../components/KoreanMap/index';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';
import { useLocationData } from './hooks/useLocationData';

function RegionColoring() {
    const {
        sidoData,
        highlightInfo,
        loading,
        locationLoading,
        error
    } = useLocationData();

    // 📱 로딩 상태들
    if (loading) {
        return (
            <LoadingSpinner
                message="지도 데이터 로딩 중..."
                color="blue"
            />
        );
    }

    if (locationLoading) {
        return (
            <LoadingSpinner
                message="GPS로 현재 위치 확인 중..."
                subMessage="최신 위치로 업데이트합니다"
                color="green"
            />
        );
    }

    if (error) {
        return (
            <ErrorDisplay
                title="GPS 위치 확인 실패"
                message={error}
                onRetry={() => window.location.reload()}
                helpText={[
                    '💡 GPS 문제 해결 방법:',
                    '• Chrome: 주소창 좌측 🔒 아이콘 → 위치 허용',
                    '• 실외로 이동 후 새로고침',
                    '• 시스템 설정 → 개인정보보호 → 위치서비스 확인'
                ]}
            />
        );
    }

    // 🗺️ 메인 지도 화면
    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white">
            {sidoData && (
                <KoreanMap
                    sidoData={sidoData}
                    highlightInfo={highlightInfo}
                />
            )}
        </div>
    );
}

export default RegionColoring;