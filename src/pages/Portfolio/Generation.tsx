import { LuCalendarMinus2 } from "react-icons/lu"
import Header from "../../components/common/Header"
import Calender from "../../components/common/Calender"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useUserInfo } from "../../hooks/useUserInfo"
import LoadingSpinner from "../../components/LoadingSpinner"
import { useLocationContext } from "../../contexts/LocationContext"

function PortfolioGeneration() {
    const navigate = useNavigate()
    const { userInfo: userData, loading } = useUserInfo()
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const {currentLocation, isLocationLoading} = useLocationContext()
    const userId: number | undefined = userData?.id

    const handleBackClick = (): void => {
        navigate('/main')
    }

    const formatDate = (date: Date | null): string => {
        if (!date) return ''
        return date.toISOString().split('T')[0]
    }

    const handleSelectDate = (): void => {
        // 에러 메시지 초기화
        setErrorMessage("")

        // 날짜 누락 체크
        if (!startDate || !endDate) {
            setErrorMessage("날짜를 선택해주세요.")
            return
        }

        // 날짜 순서 체크
        if (startDate > endDate) {
            setErrorMessage("날짜를 다시 확인해주세요.")
            return
        }

        if (!userId) {
            alert('사용자 정보를 불러올 수 없습니다.')
            return
        }

        const params = new URLSearchParams({
            from: formatDate(startDate),
            to: formatDate(endDate)
        })

        navigate(`/portfolio/generate/users/${userId}?${params.toString()}`)
    }

    // 날짜 변경 시 에러 메시지 초기화
    const handleStartDateChange = (date: Date | null): void => {
        setStartDate(date)
        setErrorMessage("")
    }

    const handleEndDateChange = (date: Date | null): void => {
        setEndDate(date)
        setErrorMessage("")
    }

    if (loading || isLocationLoading) {
        return <LoadingSpinner message="유저 정보 불러오는 중..." />
    }

    return (
        <div className="w-screen">
            <Header onClick={handleBackClick}>디지털 포트폴리오</Header>
            <div className="flex flex-col items-center text-center mt-20">
                <div className="text-2xl text-black font-bold mb-8">
                    {currentLocation?.regionName} 포트폴리오를<br />생성해 볼까요?
                </div>
                <p className="text-md text-gray-500 font-bold mb-11">
                    아래 항목을 선택하면 자동으로<br/>포트폴리오가 만들어집니다
                </p>
                <div className="flex flex-row text-lg text-black font-bold mb-4 items-center">
                    <LuCalendarMinus2 size={32} />
                    <span>방문한 기간을 선택해 주세요</span>
                </div>
                
                {/* 캘린더 영역 - 가운데 정렬 */}
                <div className="flex flex-col items-center">
                    <Calender 
                        date={startDate} 
                        onDateChange={handleStartDateChange}
                        hasError={!!errorMessage}
                    />
                    <Calender 
                        date={endDate} 
                        onDateChange={handleEndDateChange}
                        hasError={!!errorMessage}
                    />
                    
                    {/* 통합 에러 메시지 */}
                    {errorMessage && (
                        <div className="text-red-500 text-sm mt-2">
                            {errorMessage}
                        </div>
                    )}
                </div>

                <div className="mt-12">
                    <button 
                        className="bg-lime-500 font-bold text-white py-2 px-30 rounded-lg hover:bg-lime-600 transition-colors cursor-pointer"
                        onClick={handleSelectDate}
                        type="button"
                    >
                        선택 완료
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PortfolioGeneration;