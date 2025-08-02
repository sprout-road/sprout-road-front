import {useNavigate, useParams, useSearchParams} from "react-router-dom"
import Header from "../../components/common/Header"
import { FaRegCheckCircle } from "react-icons/fa";
import { LuSprout } from "react-icons/lu";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";
import ErrorComponent from "../../components/common/Error";
import { useLocationContext } from "../../contexts/LocationContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useUserPortfolio } from "../../hooks/useUserPortfolio";
import { useUserInfo } from "../../hooks/useUserInfo";

interface ShareData {
    title: string;
    text: string;
    url: string;
}

function Portfolio() {
    const { userInfo: userData } = useUserInfo()

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { currentLocation, isLocationLoading } = useLocationContext()
    const { userId } = useParams<{ userId: string }>();

    const fromDate = searchParams.get('from') as string;
    const endDate = searchParams.get('to') as string;
    const regionCode = currentLocation?.regionCode

    const {data: portfolioCountData, loading: portfolioCountLoading, error: portfolioCountError } = useUserPortfolio(
        userId,
        fromDate,
        endDate,
        regionCode
    )

    const handleBackClick = () => {
        navigate('/portfolio')
    }

    const splitDate = (date: string) : string => {
        const [year, month, day] = date.split('-')
        return `${year}년 ${month}월 ${day}일`;
    }

    // 링크 복사 기능
    const handleCopyLink = async (shareData: ShareData) => {
        try {
            await navigator.clipboard.writeText(shareData.url);
            alert('포트폴리오 링크가 클립보드에 복사되었습니다!');
        } catch (error) {
            console.error('링크 복사 실패:', error);
            // 클립보드 API를 지원하지 않는 경우의 대체 방법
            const textArea = document.createElement('textarea');
            textArea.value = shareData.url;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('포트폴리오 링크가 클립보드에 복사되었습니다!');
        }
    };

    // 공유하기 기능
    const handleShare = async () => {
        const shareData: ShareData = {
            title: `${userData?.nickname}의 ${currentLocation?.regionName} 포트폴리오`,
            text: `${splitDate(fromDate)} ~ ${splitDate(endDate)} 기간 동안 미션 ${portfolioCountData?.missionCount}개 달성, 총 ${portfolioCountData?.travelCount}곳 방문했어요!`,
            url: window.location.href
        };

        // 모바일 웹앱이므로 Web Share API 우선 시도
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('공유 완료');
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.error('API 호출 실패:', err);
                }
            }
        } else {
            // Web Share API를 지원하지 않는 경우 링크 복사
            handleCopyLink(shareData);
        }
    };

    const handleClickTravelLogReport = () => {
        navigate(`/portfolio/travel-logs/users/${userId}?from=${fromDate}&to=${endDate}`)
    }

    // 조건부 렌더링을 모든 훅 호출 이후에 배치
    if (userId === undefined) {
        return <ErrorComponent error={"유저 아이디를 찾을 수 없습니다"} />
    }

    if (fromDate === null || endDate === null) {
        return <ErrorComponent error={"필요한 정보를 불러오지 못했습니다."} />
    }

    if (isLocationLoading || portfolioCountLoading) {
        return <LoadingSpinner message="필요한 정보 불러오는 중..." />
    }

    if (portfolioCountError) {
        return <ErrorComponent error={portfolioCountError} />
    }

    function handleMissionResult() {
        navigate(`/portfolio/missions/users/${userId}?from=${fromDate}&to=${endDate}`);
    }

    return (
        <div className="fixed inset-0 w-screen viewport-height overflow-hidden bg-white flex flex-col">
            <Header onClick={handleBackClick}>디지털 포트폴리오</Header>

            <div className="flex-1 flex flex-col min-h-0 overflow-auto">
                {/* 상단 성공 메시지 */}
                <div className="flex-shrink-0 px-4 py-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <FaRegCheckCircle size={28} color="green" />
                        <p className="text-green-600 font-bold text-lg text-center leading-tight">
                            디지털 포트폴리오가<br />성공적으로 완성되었어요!
                        </p>
                    </div>

                    <div className="text-center text-black font-bold text-lg">
                        {userData?.nickname}의 {currentLocation?.regionName} 포트폴리오
                    </div>
                </div>

                {/* 포트폴리오 내용 */}
                <div className="flex-1 px-4 pb-4 min-h-0">
                    <div className="space-y-6">
                        {/* 방문 기간 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <LuSprout size={24} color="green"/>
                                <span className="font-bold text-green-600">방문 기간</span>
                            </div>
                            <div className="pl-9 text-black font-bold">
                                {`${splitDate(fromDate)} ~ ${splitDate(endDate)}`}
                            </div>
                        </div>

                        {/* 미션 성과 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <FaTrophy size={24} color="green"/>
                                <span className="font-bold text-green-600">미션 성과</span>
                            </div>
                            <div className="pl-9 space-y-2">
                                <div className="text-black font-bold">
                                    미션 {portfolioCountData?.missionCount}개 달성
                                </div>
                                <button
                                    onClick={handleMissionResult}
                                    className="text-gray-500 text-sm underline hover:text-gray-700 transition-colors"
                                >
                                    미션 수행 결과 보기
                                </button>
                            </div>
                        </div>

                        {/* 방문 장소 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <FaMapMarkerAlt size={24} color="green"/>
                                <span className="font-bold text-green-600">방문 장소</span>
                            </div>
                            <div className="pl-9 space-y-2">
                                <div className="text-black font-bold">
                                    총 {portfolioCountData?.travelCount}곳을 방문했어요
                                </div>
                                <button
                                    onClick={handleClickTravelLogReport}
                                    className="text-gray-500 text-sm underline hover:text-gray-700 transition-colors"
                                >
                                    방문한 장소의 트레블 로그 보기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 영역 - 고정 */}
                <div className="flex-shrink-0 p-4 bg-white border-t border-gray-100">
                    <div className="flex gap-3">
                        <button
                            className="flex-1 py-3 text-black font-bold bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
                            onClick={handleShare}
                        >
                            공유하기
                        </button>
                        <button
                            className="flex-1 py-3 text-white font-bold bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            다운로드
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Portfolio