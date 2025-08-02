import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import Header from "../../components/common/Header"
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import { TravelLogDetail } from "../../types/travelLogTypes";
import { useLocationContext } from "../../contexts/LocationContext";
import { TravelLogApi } from "../../services/TravelLogApi";

interface TravelType {
    id: number
    title: string
}

function TravelLogRecord() {
    const navigate = useNavigate()
    const [openDropdowns, setOpenDropdowns] = useState<{[key: number]: boolean}>({})

    const {userId} = useParams<{userId: string}>()
    const [searchParams] = useSearchParams()
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const {currentLocation} = useLocationContext()
    const regionCode = currentLocation?.regionCode
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [travellogs, setTravellogs] = useState<TravelType[]>([])
    const [travelDetails, setTravelDetails] = useState<{[key: number]: TravelLogDetail}>({})

    const fetchTravelLog = async () => {
        if (!userId || !from || !to || !regionCode) {
            setError('필수 파라미터가 누락되었습니다.');
            return;
        }

        setLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams({
                from,
                to,
                regionCode
            });

            const response = await fetch(
                `https://api.deepdivers.store/api/travel-logs/users/${userId}/period?${params}`
            );

            if (!response.ok) {
                throw new Error('미션 데이터를 불러오는데 실패했습니다.');
            }

            const data: TravelType[] = await response.json();
            setTravellogs(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTravelLog()
    }, [userId, from, to, regionCode])
    
    const handleBackClick = () => {
        navigate(-1)
    }

    const toggleDropdown = async (travelId: number) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [travelId]: !prev[travelId]
        }))
        if (!travelDetails[travelId] && !openDropdowns[travelId]) {
            try {
                const detail = await TravelLogApi.getTravelLogDetail(travelId)
                setTravelDetails(prev => ({
                    ...prev,
                    [travelId]: detail
                }))
            } catch (error) {
                console.error('여행 상세 정보를 불러오는데 실패했습니다:', error)
            }
        }
    }

    const renderContent = (content: any, index: number) => {
        if (content.type === "text" && content.content?.text) {
            return (
                <div key={index} className="mb-3">
                    <p className="text-gray-700 text-sm leading-relaxed">
                        {content.content.text}
                    </p>
                </div>
            )
        } else if (content.type === "image" && content.content?.url) {
            return (
                <div key={index} className="mb-4">
                    <img 
                        src={content.content.url}
                        alt={content.content.caption || "여행 사진"}
                        className="w-full h-48 object-cover rounded-lg"
                    />
                </div>
            )
        }
        return null;
    }

    if (loading) {
        return (
            <>
                <Header onClick={handleBackClick}>디지털 포트폴리오</Header>
                <div className="mx-9 mt-8 flex flex-col items-center">
                    <div className="bg-green-600 font-bold text-white text-xl py-2 px-32 rounded-lg">
                        방문 장소
                    </div>
                    <div className="mt-8">로딩 중...</div>
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Header onClick={handleBackClick}>디지털 포트폴리오</Header>
                <div className="mx-9 mt-8 flex flex-col items-center">
                    <div className="bg-green-600 font-bold text-white text-xl py-2 px-32 rounded-lg">
                        방문 장소
                    </div>
                    <div className="mt-8 text-red-500">{error}</div>
                </div>
            </>
        )
    }

    return (
        <>
            <Header onClick={handleBackClick}>디지털 포트폴리오</Header>
            <div className="mx-9 mt-8 flex flex-col items-center">
                <div className="bg-green-600 font-bold text-white text-xl py-2 px-32 rounded-lg">
                    방문 장소
                </div>
                
                {travellogs.length === 0 ? (
                    <div className="mt-8 text-gray-500">여행 기록이 없습니다.</div>
                ) : (
                    travellogs.map((travel) => {
                        const isDropOpen = openDropdowns[travel.id] || false;
                        const detail = travelDetails[travel.id];

                        return (
                            <div key={travel.id} className="w-full mt-4">
                                <div 
                                    className="flex flex-row items-center gap-2 cursor-pointer"
                                    onClick={() => toggleDropdown(travel.id)}
                                >
                                    <IoIosArrowDroprightCircle 
                                        size={20} 
                                        className={`transition-transform duration-200 ${isDropOpen ? "rotate-90" : ""}`} 
                                    />
                                    <span className="text-lg font-medium">{travel.title}</span>
                                </div>
                                {isDropOpen && (
                                    <div className="mt-4 w-full max-w-md mx-auto">
                                        <div className="bg-whiteoverflow-hidden">
                                            {detail ? (
                                                <>
                                                    <div className="bg-green-500 text-white p-3 flex items-center justify-between">
                                                        <span className="text-md font-medium">{detail.traveledAt}</span>
                                                        <span className="text-yellow-300 text-2xl">☀️</span>
                                                    </div>
                                                    <div className="bg-green-500 text-white px-3 pb-3">
                                                        <h3 className="text-xl font-bold text-center">{detail.title}</h3>
                                                    </div>
                                                    <div className="p-4">
                                                        <div className="space-y-2">
                                                            {detail.contents
                                                                .sort((a, b) => a.order - b.order)
                                                                .map((content, index) => renderContent(content, index))
                                                            }
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="p-4 text-center text-gray-500">
                                                    상세 정보를 불러오는 중...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </>
    )
}

export default TravelLogRecord