import {useNavigate, useSearchParams} from "react-router-dom"
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

function Portfolio() {
    const { userInfo: userData } = useUserInfo()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { currentLocation, isLocationLoading } = useLocationContext()
    
    const fromDate = searchParams.get('from')
    const endDate = searchParams.get('to')
    const regionCode = currentLocation?.regionCode

    const {data: portfolioCountData, loading: portfolioCountLoading, error: portfolioCountError } = useUserPortfolio(
        userData?.id,
        fromDate,     
        endDate,      
        regionCode
    )

    const handleBackClick = () => {
        navigate('/portfolio')
    }

    const splitDate = (date: string) => {
        const [year, month, day] = date.split('-')
        return `${year}년 ${month}월 ${day}일`;
    }

    // 공유하기 기능
    const handleShare = async () => {
        const shareData = {
            title: `${userData?.nickname}의 ${currentLocation?.regionName} 포트폴리오`,
            text: `${splitDate(fromDate)} ~ ${splitDate(endDate)} 기간 동안 미션 ${portfolioCountData?.missionCount}개 달성, 총 ${portfolioCountData?.travelCount}곳 방문했어요!`,
            url: window.location.href
        };

        // 모바일 웹앱이므로 Web Share API 우선 시도
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('공유 완료');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log('공유 실패, 링크 복사로 대체:', error);
                    handleCopyLink(shareData);
                }
            }
        } else {
            // Web Share API를 지원하지 않는 경우 링크 복사
            handleCopyLink(shareData);
        }
    };

    // 링크 복사 기능
    const handleCopyLink = async (shareData) => {
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

    // 조건부 렌더링을 모든 훅 호출 이후에 배치
    if (userData?.id === undefined) {
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

    return (
        <div>
            <Header onClick={handleBackClick}>디지털 포트폴리오</Header>
            <div className="mt-2 flex flex-row gap-2 items-center justify-center">
                <FaRegCheckCircle size={32} color="green" />
                <p className="text-green-600 font-bold text-xl">디지털 포트폴리오가<br />성공적으로 완성되었어요!</p>
            </div>
            <div className="flex justify-center text-black font-bold mt-4 text-lg">
                {userData?.nickname}의 {currentLocation?.regionName} 포트 폴리오
            </div>
            <div className="flex flex-col justify-center mt-8 text-green-600 gap-4">
                <div className="flex flex-row px-8 justify-baseline items-center">
                    <LuSprout size={28} color="green"/>
                    <span className="font-bold">방문 기간</span>
                </div>
                <div className="px-10 text-black font-bold">
                    {`${splitDate(fromDate)} ~ ${splitDate(endDate)}`}
                </div>
                <div className="flex flex-row px-8 justify-baseline items-center">
                    <FaTrophy size={28} color="green"/>
                    <span className="text-black font-bold">미션 성과</span>
                </div>
                <span className="px-10 font-bold text-black">미션 {portfolioCountData?.missionCount}개 달성</span>
                <div className="px-10 flex text-gray-400">
                    <span className="border-b-2">미션 수행 결과 보기</span>
                </div>
                <div className="flex flex-row px-8 justify-baseline items-center">
                    <FaMapMarkerAlt size={28} color="green"/>
                    <span className="font-bold">방문 장소</span>
                </div>
                <span className="px-10 font-bold text-black">총 {portfolioCountData?.travelCount}곳을 방문했어요</span>
                <div className="px-10 flex text-gray-400"><span className="border-b-2">방문한 장소의 트레블 로그 보기</span></div>
                <div className="flex flex-row justify-center mt-40 gap-4">
                    <button 
                        className="px-4 py-2 w-40 text-black font-bold bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
                        onClick={handleShare}
                    >
                        공유하기
                    </button>
                    <button 
                        className="px-4 py-2 w-40 text-white font-bold bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        다운로드
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Portfolio