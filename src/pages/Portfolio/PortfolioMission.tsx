import React, {useEffect, useState} from 'react';
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import Header from "../../components/common/Header";
import {useLocationContext} from "../../contexts/LocationContext.tsx";

interface MissionSummaryResponse {
    id: number;
    completedAt: string; // ISO 날짜 문자열
    description: string;
}

function PortfolioMission() {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const [searchParams] = useSearchParams();
    const {currentLocation} = useLocationContext();
    const [missions, setMissions] = useState<MissionSummaryResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // URL 파라미터 추출
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const regionCode = currentLocation?.regionCode;

    const navigateBack = () => {
        navigate(-1);
    };

    const fetchMissions = async () => {
        if (!userId || !from || !to || !regionCode) {
            setError('필수 파라미터가 누락되었습니다.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                from,
                to,
                regionCode
            });

            const response = await fetch(
                `https://api.deepdivers.store/api/missions/users/${userId}/period?${params}`
            );

            if (!response.ok) {
                throw new Error('미션 데이터를 불러오는데 실패했습니다.');
            }

            const data: MissionSummaryResponse[] = await response.json();
            setMissions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMissions();
    }, [userId, from, to, regionCode]);

    // 날짜 포맷팅 함수
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}월 ${day}일`;
    };

    const MissionCard: React.FC<{ mission: MissionSummaryResponse; isSelected?: boolean }> = ({
                                                                                                  mission,
                                                                                                  isSelected = false
                                                                                              }) => (
        <div className={`
            relative bg-white border-2 rounded-2xl p-4 mb-3 shadow-sm
            ${isSelected ? 'border-blue-400' : 'border-gray-300'}
        `}>
            {/* 완료 체크 아이콘 */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>

            {/* 미션 내용 */}
            <div className="ml-12">
                <p className="text-base font-medium text-gray-900 text-center leading-relaxed">
                    {formatDate(mission.completedAt)}- {mission.description}
                </p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gray-50 flex flex-col">
            <Header onClick={navigateBack}>미션 수행</Header>

            <div className="flex-1 flex flex-col min-h-0">
                {/* 상단 타이틀 섹션 */}
                <div className="flex-shrink-0 p-4">
                    <div className="bg-green-500 text-white text-center py-6 rounded-2xl">
                        <h1 className="text-xl font-bold">미션수행 성과보기</h1>
                    </div>
                </div>

                {/* 미션 목록 섹션 */}
                <div className="flex-1 px-4 pb-4 min-h-0 flex flex-col">
                    {/* 섹션 제목 - 고정 */}
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex-shrink-0">미션 수행</h2>

                    {/* 로딩 상태 */}
                    {loading && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-gray-500">미션 데이터를 불러오는 중...</div>
                        </div>
                    )}

                    {/* 에러 상태 */}
                    {error && (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="text-red-500 text-center mb-4">
                                <p>{error}</p>
                            </div>
                            <button
                                onClick={fetchMissions}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                다시 시도
                            </button>
                        </div>
                    )}

                    {/* 미션 리스트 - 스크롤 영역 */}
                    {!loading && !error && missions.length > 0 && (
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {missions.map((mission) => (
                                <MissionCard
                                    key={mission.id}
                                    mission={mission}
                                />
                            ))}
                        </div>
                    )}

                    {/* 빈 상태 */}
                    {!loading && !error && missions.length === 0 && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-gray-500 text-center">
                                <p>해당 기간에 완료된 미션이 없습니다.</p>
                                {from && to && (
                                    <p className="text-sm mt-2">{from} ~ {to}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PortfolioMission;